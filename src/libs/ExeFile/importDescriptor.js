// @flow

import type { DataBlock } from '../FileReader'

export type ImportDescriptor = {
  OriginalFirstThunk: DataBlock,
  TimeDateStamp: DataBlock,
  ForwarderChain: DataBlock,
  Name: DataBlock,
  FirstThunk: DataBlock,
}