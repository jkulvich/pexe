// @flow

import type { DataBlock } from '../FileReader'
import BlockReader from '../BlockReader'
import type { DataBlockDesk } from '../BlockReader'
import { Type } from '../types'

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

export default class BlockReaderSectionHeader extends BlockReader {
  read (): SectionHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.Array(Type.Byte * 8), 'Name', ''),
      this._desc(Type.DWord, 'VirtualSize', ''),
      this._desc(Type.DWord, 'VirtualAddress', ''),
      this._desc(Type.DWord, 'SizeOfRawData', ''),
      this._desc(Type.DWord, 'PointerToRawData', ''),
      this._desc(Type.DWord, 'PointerToRelocations', ''),
      this._desc(Type.DWord, 'PointerToLinenumbers', ''),
      this._desc(Type.Word, 'NumberOfRelocations', ''),
      this._desc(Type.Word, 'NumberOfLinenumbers', ''),
      this._desc(Type.DWord, 'Characteristics', '')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  readAll (count: number): Array<SectionHeader> {
    let arr = []
    for (let i = 0; i < count; i++) arr.push(this.read())
    return arr
  }
}