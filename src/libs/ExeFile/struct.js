// @flow
/*
  Exe file structure
*/

import type { DosHeader } from './dosHeader'
import type { NtHeader } from './ntHeader'
import type { SectionHeader } from './sectionHeader'

export type ExeFile = {
  bytes: Uint8Array,
  meta: {
    isDOS: boolean,
    isNT: boolean,
    isDLL: boolean,
    is64: boolean,
    machine: string,
    magic: string,
    osVersion: string,
    subsystem: string,
    chars: Array<string>,
    dateStamp: Date,
    dllChars: Array<string>,
    sections: Array<string>
  },
  headers: {
    dos: DosHeader,
    nt: NtHeader
  },
  sections: Array<SectionHeader>
}
