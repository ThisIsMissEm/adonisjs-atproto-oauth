import {
  AtIdentifierString,
  AtUriString,
  DatetimeString,
  DidString,
  HandleString,
  isDatetimeString,
  isLanguageString,
  LanguageString,
} from '@atproto/lex'
import {
  isAtIdentifierRule,
  isAtUriRule,
  isDatetimeRule,
  isDidRule,
  isHandleRule,
  isLanguageRule,
  isServiceRule,
} from './rules.js'
import { BaseLiteralType, symbols } from '@vinejs/vine'
import { FieldOptions, Validation } from '@vinejs/vine/types'
import { WebUri } from '@atproto/oauth-client-node'

export class VineAtprotoAtUri extends BaseLiteralType<string, AtUriString, AtUriString> {
  [symbols.SUBTYPE] = `atproto.at-uri`;
  [symbols.UNIQUE_NAME] = `atproto.at-uri`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string' && value.toLowerCase().startsWith('at://')
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isAtUriRule()
  }

  clone() {
    return new VineAtprotoAtUri(this.cloneOptions(), this.cloneValidations()) as this
  }
}

export class VineAtprotoIdentifier extends BaseLiteralType<
  string,
  AtIdentifierString,
  AtIdentifierString
> {
  [symbols.SUBTYPE] = `atproto.identifier`;
  [symbols.UNIQUE_NAME] = `atproto.identifier`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return (
      typeof value === 'string' &&
      (value.toLocaleLowerCase().startsWith('did:') ||
        (value.includes('.') && !value.startsWith('http:') && !value.startsWith('https:')))
    )
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isAtIdentifierRule()
  }

  clone() {
    return new VineAtprotoUri(this.cloneOptions(), this.cloneValidations()) as this
  }
}

export class VineAtprotoDid extends BaseLiteralType<string, DidString, DidString> {
  [symbols.SUBTYPE] = `atproto.did`;
  [symbols.UNIQUE_NAME] = `atproto.did`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string' && value.toLocaleLowerCase().startsWith('did:')
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isDidRule()
  }

  clone() {
    return new VineAtprotoDid(this.cloneOptions(), this.cloneValidations()) as this
  }
}

export class VineAtprotoHandle extends BaseLiteralType<string, HandleString, HandleString> {
  [symbols.SUBTYPE] = `atproto.handle`;
  [symbols.UNIQUE_NAME] = `atproto.handle`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return (
      typeof value === 'string' &&
      value.includes('.') &&
      !value.startsWith('http:') &&
      !value.startsWith('https:')
    )
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isHandleRule()
  }

  clone() {
    return new VineAtprotoHandle(this.cloneOptions(), this.cloneValidations()) as this
  }
}

export class VineAtprotoService extends BaseLiteralType<string, WebUri, WebUri> {
  [symbols.SUBTYPE] = `atproto.service`;
  [symbols.UNIQUE_NAME] = `atproto.service`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string' && URL.canParse(value)
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isServiceRule()
  }

  clone() {
    return new VineAtprotoService(this.cloneOptions(), this.cloneValidations()) as this
  }
}

export class VineAtprotoDatetime extends BaseLiteralType<string, DatetimeString, DatetimeString> {
  [symbols.SUBTYPE] = `atproto.datetime`;
  [symbols.UNIQUE_NAME] = `atproto.datetime`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string' && isDatetimeString(value)
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isDatetimeRule()
  }

  clone() {
    return new VineAtprotoDatetime(this.cloneOptions(), this.cloneValidations()) as this
  }
}

export class VineAtprotoLanguage extends BaseLiteralType<string, LanguageString, LanguageString> {
  [symbols.SUBTYPE] = `atproto.language`;
  [symbols.UNIQUE_NAME] = `atproto.language`;

  // Required for unionOfTypes
  [symbols.IS_OF_TYPE] = (value: unknown) => {
    return typeof value === 'string' && isLanguageString(value)
  }

  constructor(options?: FieldOptions, validations?: Validation<any>[]) {
    super(options, validations || [])
    this.dataTypeValidator = isLanguageRule()
  }

  clone() {
    return new VineAtprotoLanguage(this.cloneOptions(), this.cloneValidations()) as this
  }
}
