// @flow

import type { DataBlock } from '../FileReader'

export type ExportDirectory = {
  Characteristics: DataBlock,
  TimeDateStamp: DataBlock,
  MajorVersion: DataBlock,
  MinorVersion: DataBlock,
  Name: DataBlock,
  Base: DataBlock,
  NumberOfFunctions: DataBlock,
  NumberOfNames: DataBlock,
  AddressOfFunctions: DataBlock,
  AddressOfNames: DataBlock,
  AddressOfNameOrdinals: DataBlock,
}