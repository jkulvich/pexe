// @flow

import type { DataBlock } from '../FileReader'
import BlockReader from '../BlockReader'
import type { DataBlockDesk } from '../BlockReader'
import { Type } from '../types'

export type ExportDescriptor = {
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

export default class BlockReaderExportDescriptor extends BlockReader {
  read (): ExportDescriptor {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.DWord, 'Characteristics', ''),
      this._desc(Type.DWord, 'TimeDateStamp', ''),
      this._desc(Type.Word, 'MajorVersion', ''),
      this._desc(Type.Word, 'MinorVersion', ''),
      this._desc(Type.DWord, 'Name', ''),
      this._desc(Type.DWord, 'Base', ''),
      this._desc(Type.DWord, 'NumberOfFunctions', ''),
      this._desc(Type.DWord, 'NumberOfNames', ''),
      this._desc(Type.DWord, 'AddressOfFunctions', ''),
      this._desc(Type.DWord, 'AddressOfNames', ''),
      this._desc(Type.DWord, 'AddressOfNameOrdinals', ''),
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  readAll (): Array<ExportDescriptor> {
    let arr = []
    for (;;) {
      let desc = this.read()
      if (
        desc.Name.num === 0 ||
        desc.NumberOfFunctions === 0 ||
        desc.AddressOfNames === 0 ||
        desc.AddressOfNameOrdinals === 0 ||
        desc.AddressOfFunctions === 0
      ) break
      arr.push(desc)
    }
    return arr
  }
}