// @flow
/*
  Exe file structure
*/

import type { DosHeader } from './dosHeader'
import type { NtHeader } from './ntHeader'
import type { SectionHeader } from './sectionHeader'
import type { Meta } from './meta'
import type { DataDirectories } from './dataDirectory'

export type ExeFile = {
  bytes: Uint8Array,
  meta: Meta,
  headers: {
    dos: DosHeader,
    nt: NtHeader
  },
  sections: Array<SectionHeader>,
  directories: DataDirectories,
}
