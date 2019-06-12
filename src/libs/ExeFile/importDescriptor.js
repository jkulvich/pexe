// @flow

import type { DataBlock } from '../FileReader'
import BlockReader from '../BlockReader'
import type { DataBlockDesk } from '../BlockReader'
import { Type } from '../types'

export type ImportDescriptor = {
  OriginalFirstThunk: DataBlock,
  TimeDateStamp: DataBlock,
  ForwarderChain: DataBlock,
  Name: DataBlock,
  FirstThunk: DataBlock,
}

export default class BlockReaderImportDescriptor extends BlockReader {
  read (): ImportDescriptor {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.DWord, 'OriginalFirstThunk', ''),
      this._desc(Type.DWord, 'TimeDateStamp', ''),
      this._desc(Type.DWord, 'ForwarderChain', ''),
      this._desc(Type.DWord, 'Name', ''),
      this._desc(Type.DWord, 'FirstThunk', ''),
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  readAll (): Array<ImportDescriptor> {
    let arr = []
    for (;;) {
      let desc = this.read()
      if (desc.OriginalFirstThunk.num === 0) break
      arr.push(desc)
    }
    return arr
  }
}