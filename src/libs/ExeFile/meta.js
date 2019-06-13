// @flow

import type { ImportData } from './importData'
import type { SectionData } from './sectionData'
import type { ExportData } from './exportData'

export type Meta = {
  isDOS: boolean,
  isNT: boolean,
  isDLL: boolean,
  is64: boolean,
  isNET: boolean,
  isStripped: boolean,
  isDebug: boolean,
  machine: string,
  magic: string,
  osVersion: string,
  subsystem: string,
  chars: Array<string>,
  dateStamp: Date,
  dllChars: Array<string>,
  sections: Array<SectionData>,
  imports: Array<ImportData>,
  exports: Array<ExportData>,
}