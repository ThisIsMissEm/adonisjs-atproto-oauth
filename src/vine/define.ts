import { Vine } from '@vinejs/vine'
import {
  VineAtprotoDatetime,
  VineAtprotoDid,
  VineAtprotoHandle,
  VineAtprotoIdentifier,
  VineAtprotoLanguage,
  VineAtprotoService,
  VineAtprotoAtUri,
} from './schema.js'

export type VineAtproto = {
  identifier(): VineAtprotoIdentifier
  did(): VineAtprotoDid
  handle(): VineAtprotoHandle
  service(): VineAtprotoService
  atUri(): VineAtprotoAtUri
  datetime(): VineAtprotoDatetime
  language(): VineAtprotoLanguage
}

export function defineVineAtProto() {
  Vine.getter('atproto', () => ({
    identifier: () => new VineAtprotoIdentifier(),
    did: () => new VineAtprotoDid(),
    handle: () => new VineAtprotoHandle(),
    service: () => new VineAtprotoService(),
    atUri: () => new VineAtprotoAtUri(),
    datetime: () => new VineAtprotoDatetime(),
    language: () => new VineAtprotoLanguage(),
  }))
}
