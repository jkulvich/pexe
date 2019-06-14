// @flow

import type { DataBlock } from '../FileReader'

export type SectionData = {
  name: string,
  offset: number,
  size: number,
  chars: Array<string>,
}