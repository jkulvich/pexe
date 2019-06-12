// @flow

import type { DataBlock } from '../FileReader'
import type { DataDirectory } from './dataDirectory'
import type { DosHeader } from './dosHeader'
import BlockReader from '../BlockReader'

import type { DataBlockDesk } from '../BlockReader'
import BlockReaderDataDirectory from './dataDirectory'
import { Type } from '../types'

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

export default class BlockReaderOptionalHeader extends BlockReader {
  read (): DosHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Type.Word, 'Magic', 'PE32 - State of the image file'),
      this._desc(Type.Byte, 'MajorLinkerVersion', ''),
      this._desc(Type.Byte, 'MinorLinkerVersion', ''),
      this._desc(Type.DWord, 'SizeOfCode', 'Size of the code section'),
      this._desc(Type.DWord, 'SizeOfInitializedData', 'Size of the initialized data section'),
      this._desc(Type.DWord, 'SizeOfUninitializedData', 'Size of the uninitialized data section'),
      this._desc(Type.DWord, 'AddressOfEntryPoint', 'Pointer to the entry point function, relative to the image base address, or zero if no entry point is present'),
      this._desc(Type.DWord, 'BaseOfCode', 'Pointer to the beginning of the code section, relative to the image base'),
      this._desc(Type.DWord, 'BaseOfData', 'Pointer to the beginning of the data section, relative to the image base'),
      this._desc(Type.DWord, 'ImageBase', 'Preferred address of the first byte of the image when it is loaded in memory'),
      this._desc(Type.DWord, 'SectionAlignment', 'Alignment of the section loaded in memory'),
      this._desc(Type.DWord, 'FileAlignment', 'Alignment of the raw data of sections in the image file'),
      this._desc(Type.Word, 'MajorOperatingSystemVersion', 'Major version number of the required operating system'),
      this._desc(Type.Word, 'MinorOperatingSystemVersion', 'Minor version number of the required operating system'),
      this._desc(Type.Word, 'MajorImageVersion', ''),
      this._desc(Type.Word, 'MinorImageVersion', ''),
      this._desc(Type.Word, 'MajorSubsystemVersion', ''),
      this._desc(Type.Word, 'MinorSubsystemVersion', ''),
      this._desc(Type.DWord, 'Win32VersionValue', 'Reserved'),
      this._desc(Type.DWord, 'SizeOfImage', 'Size of the image including all headers'),
      this._desc(Type.DWord, 'SizeOfHeaders', ''),
      this._desc(Type.DWord, 'CheckSum', 'Image file checksum'),
      this._desc(Type.Word, 'Subsystem', 'WindowsCui - Subsystem required to run this image'),
      this._desc(Type.Word, 'DllCharacteristics', 'DynamicBase, NxCompat, TerminalServerAware - DLL characteristics of the image'),
      this._desc(Type.DWord, 'SizeOfStackReserve', 'Number of bytes to reserve for the stack'),
      this._desc(Type.DWord, 'SizeOfStackCommit', 'Number of bytes to commit for the stack'),
      this._desc(Type.DWord, 'SizeOfHeapReserve', 'Number of bytes to reserve for the local heap'),
      this._desc(Type.DWord, 'SizeOfHeapCommit', 'Number of bytes to commit for the local heap'),
      this._desc(Type.DWord, 'LoaderFlags', 'Obsolete'),
      this._desc(Type.DWord, 'NumberOfRvaAndSizes', 'Number of directory entries in the remainder of the optional header')
    ]
    let struct = this.readStructure(structdef)
    let map: Object = this.convertStructureToMap(struct)

    let brDataDirectories = new BlockReaderDataDirectory()
    brDataDirectories.setReader(this._reader)

    map.DataDirectory = brDataDirectories.readAll()

    return map
  }
}