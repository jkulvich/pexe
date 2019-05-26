// @flow

import type { DataBlock } from '../FileReader'

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
