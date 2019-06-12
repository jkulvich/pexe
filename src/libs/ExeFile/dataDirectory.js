// @flow

import type { DataBlock } from '../FileReader'
import BlockReader from '../BlockReader'
import type { DataBlockDesk } from '../BlockReader'
import type { ImportDescriptor } from './importDescriptor'
import type { ExportDescriptor } from './exportDescriptor'
import { Type } from '../types'

export type DataDirectory = {
  VirtualAddress: DataBlock,
  Size: DataBlock,
}

export type DataDirectories = {
  import: Array<ImportDescriptor>,
  export: Array<ExportDescriptor>,
}

export default class BlockReaderDataDirectory extends BlockReader {
  read (): DataDirectory {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.DWord, 'VirtualAddress', ''),
      this._desc(Type.DWord, 'Size', '')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  readAll (): Array<DataDirectory> {
    let arr = []
    for (let i = 0; i < 16; i++) {
      arr.push(this.read())
    }
    return arr
  }
}