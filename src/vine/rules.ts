import {
  isAtIdentifierString,
  isAtUriString,
  isDatetimeString,
  isDidString,
  isHandleString,
  isLanguageString,
} from '@atproto/lex'
import { webUriSchema } from '@atproto/oauth-client-node'
import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'

function atString(value: unknown, field: FieldContext, rule: string): value is string {
  if (!field.isDefined) {
    return false
  }

  if (typeof value === 'string') {
    return true
  }

  field.report('The {{ field }} field value must be a string', rule, field)
  return false
}

export const isAtUriRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-uri'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!isAtUriString(value)) {
    field.report(
      'The {{ field }} field value must be a valid AT Protocol AT URI string',
      ruleName,
      field
    )
    return false
  }

  return true
})

export const isAtIdentifierRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-identifier'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!isAtIdentifierString(value)) {
    field.report(
      'The {{ field }} field value must be a valid AT Protocol AT Identifier string',
      ruleName,
      field
    )
    return false
  }

  return true
})

export const isHandleRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-handle'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!isHandleString(value)) {
    field.report('The {{ field }} field value must be a valid AT Protocol handle', ruleName, field)
    return false
  }

  return true
})

export const isHandleUsernameRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-handle-username'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (value.includes('.')) {
    field.report(
      'The {{ field }} field value must be a valid username for an AT Protocol handle',
      ruleName,
      field
    )
    return false
  }

  // We only have a username portion, so append .pds.example to create a "full" handle:
  if (!isHandleString(value + '.pds.example')) {
    field.report(
      'The {{ field }} field value must be a valid username for an AT Protocol handle',
      ruleName,
      field
    )
    return false
  }

  return true
})

export const isDidRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-did'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!isDidString(value)) {
    field.report(
      'The {{ field }} field value must be a valid AT Protocol DID string',
      ruleName,
      field
    )
    return false
  }

  return true
})

export const isServiceRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-service'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!URL.canParse(value)) {
    field.report('The {{ field }} field value must be a valid URL string', ruleName, field)
    return false
  }

  const { error, data } = webUriSchema.safeParse(value)
  if (error) {
    field.report('The {{ field }} field value must be a valid Web URI', ruleName, field, {
      errors: error.flatten(),
    })
    return false
  }

  field.mutate(data, field)

  return true
})

export const isDatetimeRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-datetime'
  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!isDatetimeString(value)) {
    field.report(
      'The {{ field }} field value must be a valid AT Protocol Datetime string',
      ruleName,
      field
    )
    return false
  }

  return true
})

export const isLanguageRule = vine.createRule((value, _, field) => {
  const ruleName = 'at-language'

  if (!atString(value, field, ruleName)) {
    return false
  }

  if (!isLanguageString(value)) {
    field.report(
      'The {{ field }} field value must be a valid AT Protocol Language string',
      ruleName,
      field
    )
    return false
  }

  return true
})
