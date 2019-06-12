// @flow

export type Meta = {
  isDOS: boolean,
  isNT: boolean,
  isDLL: boolean,
  is64: boolean,
  machine: string,
  magic: string,
  osVersion: string,
  subsystem: string,
  chars: Array<string>,
  dateStamp: Date,
  dllChars: Array<string>,
  sections: Array<string>,
}