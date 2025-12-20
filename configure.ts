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

import type ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

type Packages = { name: string; isDevDependency: boolean }[]

export async function configure(command: ConfigureCommand) {
  /**
   * Prompt when `install` or `--no-install` flags are
   * not used
   */
  let shouldInstallPackages: boolean | undefined = command.parsedFlags.install
  if (shouldInstallPackages === undefined) {
    shouldInstallPackages = await command.prompt.confirm(
      'Do you want to install additional packages required by "@thisismissem/adonisjs-atproto-tap"?'
    )
  }

  const codemods = await command.createCodemods()
  const packagesToInstall: Packages = [{ name: '@atproto/tap', isDevDependency: false }]

  if (shouldInstallPackages) {
    await codemods.installPackages(packagesToInstall)
  } else {
    await codemods.listPackagesToInstall(packagesToInstall)
  }

  // Publish config file
  await codemods.makeUsingStub(stubsRoot, 'config/tap.stub', {})
  await codemods.makeUsingStub(stubsRoot, 'start/indexer.stub', {})

  // Add provider to rc file
  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('@thisismissem/adonisjs-atproto-tap/provider')
    rcFile.addPreloadFile('#start/indexer')
  })

  await codemods.defineEnvVariables({
    TAP_URL: 'http://localhost:2480/',
    TAP_ADMIN_PASSWORD: 'admin-password',
  })

  await codemods.defineEnvValidations({
    variables: {
      TAP_URL: `Env.schema.string({ format: 'url', tld: false, protocol: true })`,
      TAP_ADMIN_PASSWORD: `Env.schema.string.optional()`,
    },
    leadingComment: 'Variables for configuring the AT Protocol Tap client',
  })
}
