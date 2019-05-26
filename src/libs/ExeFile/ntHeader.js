// @flow

import type { DataBlock } from '../FileReader'
import type { FileHeader } from './fileHeader'
import type { OptionalHeader } from './optionalHeader'

export type NtHeader = {
  Signature: DataBlock,
  file: FileHeader,
  optional: OptionalHeader
}
