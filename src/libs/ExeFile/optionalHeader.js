// @flow

import type { DataBlock } from '../FileReader'
import type { DataDirectory } from './dataDirectory'

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
  DataDirectory: Array<DataDirectory>,
}
