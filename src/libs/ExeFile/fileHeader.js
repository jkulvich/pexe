// @flow

import type { DataBlock } from '../FileReader'

export type FileHeader = {
  Machine: DataBlock,
  NumberOfSections: DataBlock,
  TimeDataStamp: DataBlock,
  PointerToSymbolTable: DataBlock,
  NumberOfSymbols: DataBlock,
  SizeOfOptionalHeader: DataBlock,
  Characteristics: DataBlock,
}
