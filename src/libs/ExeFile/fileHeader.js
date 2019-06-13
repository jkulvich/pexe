// @flow

import type { DataBlock } from '../FileReader'
import BlockReader from '../BlockReader'

import type { DataBlockDesk } from '../BlockReader'
import { Type } from '../types'

export type FileHeader = {
  Machine: DataBlock,
  NumberOfSections: DataBlock,
  TimeDataStamp: DataBlock,
  PointerToSymbolTable: DataBlock,
  NumberOfSymbols: DataBlock,
  SizeOfOptionalHeader: DataBlock,
  Characteristics: DataBlock,
}

export default class BlockReaderFileHeader extends BlockReader {
  read (): FileHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.Word, 'Machine', 'Architecture type of the computer'),
      this._desc(Type.Word, 'NumberOfSections', 'Size of the section table'),
      this._desc(Type.DWord, 'TimeDataStamp', 'Date and time the image was created'),
      this._desc(Type.DWord, 'PointerToSymbolTable', 'Offset of the symbol table, or zero if no COFF symbol table exists'),
      this._desc(Type.DWord, 'NumberOfSymbols', 'Number of symbols in the symbol table'),
      this._desc(Type.Word, 'SizeOfOptionalHeader', 'NtOptional32Header'),
      this._desc(Type.Word, 'Characteristics', 'ExecutableImage, 32BitMachine')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }
}