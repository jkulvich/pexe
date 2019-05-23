// @flow
/*
  Exe file structure
*/

import type { DataBlock } from '../FileReader'

export type DOSHeader = {
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

export type FileHeader = {
  Machine: DataBlock,
  NumberOfSections: DataBlock,
  TimeDataStamp: DataBlock,
  PointerToSymbolTable: DataBlock,
  NumberOfSymbols: DataBlock,
  SizeOfOptionalHeader: DataBlock,
  Characteristics: DataBlock,
}

export type OptionalHeader = {
  Magic: DataBlock,
  MajorLinkerVersion: DataBlock,
  MinorLinkerVersion: DataBlock,
  SizeOfCode: DataBlock,
  SizeOfInitializedData: DataBlock,
  SizeOfUninitializedData: DataBlock,
  AddressOfEntryPoint: DataBlock,
  BaseOfCode: DataBlock,
  BaseOfData: DataBlock,
  ImageBase: DataBlock,
  SectionAlignment: DataBlock,
  FileAlignment: DataBlock,
  MajorOperatingSystemVersion: DataBlock,
  MinorOperatingSystemVersion: DataBlock,
  MajorImageVersion: DataBlock,
  MinorImageVersion: DataBlock,
  MajorSubsystemVersion: DataBlock,
  MinorSubsystemVersion: DataBlock,
  Win32VersionValue: DataBlock,
  SizeOfImage: DataBlock,
  SizeOfHeaders: DataBlock,
  CheckSum: DataBlock,
  Subsystem: DataBlock,
  DllCharacteristics: DataBlock,
  SizeOfStackReserve: DataBlock,
  SizeOfStackCommit: DataBlock,
  SizeOfHeapReserve: DataBlock,
  SizeOfHeapCommit: DataBlock,
  LoaderFlags: DataBlock,
  NumberOfRvaAndSizes: DataBlock,
}

export type NTHeader = {
  Signature: DataBlock,
  file: FileHeader,
  optional: OptionalHeader
}

export type ExeFile = {
  bytes: Uint8Array,
  meta: {
    isDOS: boolean,
    isNT: boolean,
    machine: string,
    magic: string,
    osVersion: string,
    subsystem: string,
    chars: Array<string>,
    dllChars: Array<string>
  },
  headers: {
    dos: DOSHeader,
    nt: NTHeader
  }
}
