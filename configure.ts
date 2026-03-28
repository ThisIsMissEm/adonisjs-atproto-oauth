/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import type Configure from '@adonisjs/core/commands/configure'
import type { CodeTransformer } from '@adonisjs/assembler/code_transformer'
import { existsSync } from 'node:fs'
import { stubsRoot } from './stubs/main.ts'

type Packages = { name: string; isDevDependency: boolean }[]

export async function configure(command: Configure) {
  const packageName = '@thisismissem/adonisjs-atproto-oauth'

  const inertiaConfigPath = command.app.configPath('inertia.ts')
  const usingInertia = existsSync(inertiaConfigPath)

  /**
   * Prompt when `install` or `--no-install` flags are
   * not used
   */
  let shouldInstallPackages: boolean | undefined = command.parsedFlags.install
  if (shouldInstallPackages === undefined) {
    shouldInstallPackages = await command.prompt.confirm(
      `Do you want to install additional packages required by "${packageName}"?`,
      { default: true }
    )
  }

  const useLucid = await command.prompt.confirm(
    `Do you want to use Lucid for storing OAuth state??`,
    { default: true }
  )

  const codemods = await command.createCodemods()
  const packagesToInstall: Packages = [
    { name: '@atproto-labs/simple-store', isDevDependency: false },
    { name: '@atproto/jwk-jose', isDevDependency: false },
    { name: '@atproto/lex', isDevDependency: false },
    { name: '@atproto/oauth-client-node', isDevDependency: false },
  ]

  if (shouldInstallPackages) {
    await codemods.installPackages(packagesToInstall)
  }

  // Publish config file
  await codemods.makeUsingStub(stubsRoot, 'config/atproto_oauth.stub', {
    useLucid,
  })

  // Add provider to rc file
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@thisismissem/adonisjs-atproto-oauth/provider')
  })

  // Add migrations:
  if (useLucid) {
    const timestamp = new Date().getTime()
    await codemods.makeUsingStub(stubsRoot, 'migrations/oauth_sessions.stub', {
      entity: command.app.generators.createEntity('oauth_sessions'),
      migration: {
        folder: 'database/migrations',
        fileName: `${timestamp}_create_oauth_sessions_table.ts`,
      },
    })

    await codemods.makeUsingStub(stubsRoot, 'migrations/oauth_states.stub', {
      entity: command.app.generators.createEntity('oauth_states'),
      migration: {
        folder: 'database/migrations',
        fileName: `${timestamp + 1}_create_oauth_states_table.ts`,
      },
    })

    // Add models:
    await codemods.makeUsingStub(stubsRoot, 'models/model.stub', {
      entity: command.app.generators.createEntity('oauth_state'),
    })

    await codemods.makeUsingStub(stubsRoot, 'models/model.stub', {
      entity: command.app.generators.createEntity('oauth_session'),
    })
  }

  // Add controller:
  await codemods.makeUsingStub(stubsRoot, 'validators/oauth_validator.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'controllers/oauth_controller.stub', {
    entity: command.app.generators.createEntity('oauth'),
    usingInertia,
  })

  // Add the routes file:
  await codemods.makeUsingStub(stubsRoot, 'routes/oauth.stub', {})

  // Register the middleware:
  await codemods.registerMiddleware('router', [
    {
      path: `${packageName}/initialize_atproto_auth_middleware`,
    },
  ])

  await codemods.defineEnvVariables({
    // We use 127.0.0.1 for AT Protocol OAuth:
    HOST: '127.0.0.1',
    PUBLIC_URL: 'http://$HOST:$PORT/',
  })

  await codemods.defineEnvValidations({
    variables: {
      PUBLIC_URL: `Env.schema.string({ format: 'url', tld: false })`,
      ATPROTO_OAUTH_CLIENT_ID: `Env.schema.string.optional({ format: 'url', tld: true, protocol: true })`,
      ATPROTO_OAUTH_JWT_PRIVATE_KEY: `Env.schema.secret.optional()`,
    },
    leadingComment: 'Variables for configuring the AT Protocol OAuth',
  })

  const tsMorphAction = command.logger.action('Modifying project with ts-morph')
  const project = await codemods.getTsMorphProject()
  if (!project) {
    tsMorphAction.failed('Failed to modify project')
    return
  }

  try {
    tsMorphAction.succeeded()
    await modifyAuthConfig(command, project)
    await addRoutes(command, project)
  } catch (err) {
    command.logger.debug(err)
    tsMorphAction.failed('Failed to modify project')
  }

  console.log('')

  const instructions = command.ui.instructions()
  instructions.heading('AT Protocol OAuth setup!')
  if (!shouldInstallPackages) instructions.add('Install the packages listed below')
  if (!useLucid) {
    instructions.add('Modify config/atproto_oauth.ts to have `stores` implementations')
  }
  instructions.add('Run the migrations: node ace migration:run')
  instructions.add('Add your login form')
  instructions.render()

  if (!shouldInstallPackages) {
    console.log('')
    await codemods.listPackagesToInstall(packagesToInstall)
    console.log('')
  }
}

async function modifyAuthConfig(command: Configure, project: CodeTransformer['project']) {
  const atprotoAuthProvider = '@thisismissem/adonisjs-atproto-oauth/auth/provider'
  const authConfigPath = command.app.configPath('auth.ts')
  const action = command.logger.action(`update config/auth.ts`)

  const auth = project.getSourceFile(authConfigPath)
  if (!auth) {
    action.failed(`Failed to modify config/auth.ts`)
    return
  }

  if (
    !auth
      .getImportDeclarations()
      .some(
        (importDeclaration) => importDeclaration.getModuleSpecifierValue() === atprotoAuthProvider
      )
  ) {
    // Add the `atprotoAuthProvider` import:
    auth.addImportDeclaration({
      moduleSpecifier: atprotoAuthProvider,
      namedImports: [{ name: 'atprotoUserProvider' }],
    })

    // Modify the `@adonisjs/auth/session` import to remove `sessionUserProvider`:
    const authSessionImport = auth.getImportDeclaration((importDeclaration) => {
      return importDeclaration.getModuleSpecifierValue() === '@adonisjs/auth/session'
    })

    if (authSessionImport) {
      const imports = authSessionImport
        .getNamedImports()
        .filter((importSpecifier) => {
          return importSpecifier.getName() !== 'sessionUserProvider'
        })
        .map((importSpecifier) => {
          return importSpecifier.getStructure()
        })
      authSessionImport.removeNamedImports()
      authSessionImport.addNamedImports(imports)

      let source = auth.getText(true)
      // 3. Replace sessionUserProvider({ ... }) call (possibly multiline) with atprotoAuthProvider
      source = source.replace(/sessionUserProvider\(\s*\{[\s\S]*?\}\s*\)/g, 'atprotoUserProvider')

      auth.replaceWithText(source)
      await auth.save()
      action.succeeded()
    } else {
      action.failed(`Could not automatically modify config/auth.ts to use \`atprotoUserProvider\`.`)
    }
  }
}

async function addRoutes(command: Configure, project: CodeTransformer['project']) {
  const action = command.logger.action('update start/routes.ts')

  const oauthRoutesModule = '#start/routes/oauth'
  const routes = project.getSourceFile('start/routes.ts')
  if (!routes) {
    action.failed('Failed to modify start/routes.ts')
    return
  }

  const imports = routes.getImportDeclarations()

  if (
    !imports.some(
      (importDeclaration) => importDeclaration.getModuleSpecifierValue() === oauthRoutesModule
    )
  ) {
    routes.addImportDeclaration({ moduleSpecifier: oauthRoutesModule })
    routes.save()
    action.succeeded()
  } else {
    action.skipped(`Import already exists: ${oauthRoutesModule}`)
  }
}
