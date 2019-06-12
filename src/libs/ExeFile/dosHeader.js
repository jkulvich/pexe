// @flow

import type { DataBlock } from '../FileReader'
import BlockReader from '../BlockReader'
import type { DataBlockDesk } from '../BlockReader'
import { Type } from '../types'

export type DosHeader = {
  e_magic: DataBlock,
  e_cblp: DataBlock,
  e_cp: DataBlock,
  e_crlc: DataBlock,
  e_cparhdr: DataBlock,
  e_minalloc: DataBlock,
  e_maxalloc: DataBlock,
  e_ss: DataBlock,
  e_sp: DataBlock,
  e_csum: DataBlock,
  e_ip: DataBlock,
  e_cs: DataBlock,
  e_lfarlc: DataBlock,
  e_ovno: DataBlock,
  e_res: DataBlock,
  e_oemid: DataBlock,
  e_oeminfo: DataBlock,
  e_res2: DataBlock,
  e_lfanew: DataBlock,
}

export default class BlockReaderDosHeader extends BlockReader {
  read (): DosHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.Word, 'e_magic', 'Magic number (MZ)'),
      this._desc(Type.Word, 'e_cblp', 'Bytes on last page of file'),
      this._desc(Type.Word, 'e_cp', 'Pages in file'),
      this._desc(Type.Word, 'e_crlc', 'Relocations'),
      this._desc(Type.Word, 'e_cparhdr', 'Size of header in paragraphs'),
      this._desc(Type.Word, 'e_minalloc', 'Minimum extra paragraphs needed'),
      this._desc(Type.Word, 'e_maxalloc', 'Maximum extra paragraphs needed'),
      this._desc(Type.Word, 'e_ss', 'Initial (relative) SS value'),
      this._desc(Type.Word, 'e_sp', 'Initial SP value'),
      this._desc(Type.Word, 'e_csum', 'Checksum'),
      this._desc(Type.Word, 'e_ip', 'Initial IP value'),
      this._desc(Type.Word, 'e_cs', 'Initial CS value'),
      this._desc(Type.Word, 'e_lfarlc', 'File address of relocation table'),
      this._desc(Type.Word, 'e_ovno', 'Overlay number'),
      this._desc(Type.Array(Type.Word, 4), 'e_res', 'Reserved'),
      this._desc(Type.Word, 'e_oemid', 'OEM identifier'),
      this._desc(Type.Word, 'e_oeminfo', 'OEM information; e_oemid specific'),
      this._desc(Type.Array(Type.Word, 10), 'e_res2', 'Reserved'),
      this._desc(Type.Word, 'e_lfanew', 'File address of new exe header')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }
}