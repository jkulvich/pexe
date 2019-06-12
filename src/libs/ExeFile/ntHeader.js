// @flow

import type { DataBlock } from '../FileReader'
import type { FileHeader } from './fileHeader'
import type { OptionalHeader } from './optionalHeader'
import type { DosHeader } from './dosHeader'
import BlockReader from '../BlockReader'

import type { DataBlockDesk } from '../BlockReader'
import BlockReaderFileHeader from './fileHeader'
import BlockReaderOptionalHeader from './optionalHeader'
import { Type } from '../types'

export type NtHeader = {
  Signature: DataBlock,
  file: FileHeader,
  optional: OptionalHeader
}

export default class BlockReaderNTHeader extends BlockReader {
  read (): NtHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.DWord, 'Signature', 'PE\\0\\0')
    ]
    let struct = this.readStructure(structdef)
    let map: Object = this.convertStructureToMap(struct)

    let brFileHeader = new BlockReaderFileHeader()
    brFileHeader.setReader(this._reader)

    let brOptionalHeader = new BlockReaderOptionalHeader()
    brOptionalHeader.setReader(this._reader)

    map.file = brFileHeader.read()
    map.optional = brOptionalHeader.read()

    return map
  }
}