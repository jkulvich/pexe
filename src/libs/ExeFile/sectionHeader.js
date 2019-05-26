// @flow

import type { DataBlock } from '../FileReader'

export type SectionHeader = {
  Name: DataBlock,
  VirtualSize: DataBlock,
  VirtualAddress: DataBlock,
  SizeOfRawData: DataBlock,
  PointerToRawData: DataBlock,
  PointerToRelocations: DataBlock,
  PointerToLinenumbers: DataBlock,
  NumberOfRelocations: DataBlock,
  NumberOfLinenumbers: DataBlock,
  Characteristics: DataBlock,
}