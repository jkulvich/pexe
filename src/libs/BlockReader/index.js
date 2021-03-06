// @flow
/*
Presets for known data structures
 */

import FileReader from '../FileReader'
import * as Errors from './errors'

import type { DataBlock } from '../FileReader'
import type {
  DOSHeader,
  NTHeader,
  OptionalHeader,
  FileHeader
} from '../ExeFile/struct'

const Byte = 1
const Word = 2
const DWord = 4

/** DataBlock description for next extraction */
export type DataBlockDesk = {
  size: number,
  name: string,
  desc: string
}

/** Reads structures from file */
export default class BlockReader {
  _reader: FileReader

  constructor (fileReader?: FileReader) {
    if (fileReader) {
      this.setReader(fileReader)
    }
  }

  /** FileReader setter */
  setReader (fileReader: FileReader) {
    this._reader = fileReader
  }

  /** FileReader pointer setter */
  setPointer (pos: number): BlockReader {
    if (!this._reader) throw new Errors.BlockReaderEmptyFileReaderError(`file reader is not set`)
    this._reader.pointer = pos
    return this
  }

  /** Reads structure by structure description */
  readStructure (struct: Array<DataBlockDesk>): Array<DataBlock> {
    if (!this._reader) throw new Errors.BlockReaderEmptyFileReaderError(`file reader is not set`)
    let blocks: Array<DataBlock> = []
    struct.forEach(s => blocks.push(this._reader.readBlock(s.size, s.name, s.desc)))
    return blocks
  }

  /**
   * Convert DataBlock array to DataBlock map by name
   * @param block
   * @returns {Object}
   */
  convertStructureToMap (block: Array<DataBlock>): { [string]: DataBlock } {
    let map: { [string]: DataBlock } = {}
    block.forEach(b => {
      map[b.name] = b
    })
    return map
  }

  /** Creates new structure description */
  _desc (size: number, name: string, desc: string = ''): DataBlockDesk {
    return { size, name, desc }
  }

  /** Reads DOS header */
  readDOSHeader (): DOSHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Word, 'e_magic', 'Magic number (MZ)'),
      this._desc(Word, 'e_cblp', 'Bytes on last page of file'),
      this._desc(Word, 'e_cp', 'Pages in file'),
      this._desc(Word, 'e_crlc', 'Relocations'),
      this._desc(Word, 'e_cparhdr', 'Size of header in paragraphs'),
      this._desc(Word, 'e_minalloc', 'Minimum extra paragraphs needed'),
      this._desc(Word, 'e_maxalloc', 'Maximum extra paragraphs needed'),
      this._desc(Word, 'e_ss', 'Initial (relative) SS value'),
      this._desc(Word, 'e_sp', 'Initial SP value'),
      this._desc(Word, 'e_csum', 'Checksum'),
      this._desc(Word, 'e_ip', 'Initial IP value'),
      this._desc(Word, 'e_cs', 'Initial CS value'),
      this._desc(Word, 'e_lfarlc', 'File address of relocation table'),
      this._desc(Word, 'e_ovno', 'Overlay number'),
      this._desc(Word * 4, 'e_res', 'Reserved'),
      this._desc(Word, 'e_oemid', 'OEM identifier'),
      this._desc(Word, 'e_oeminfo', 'OEM information; e_oemid specific'),
      this._desc(Word * 10, 'e_res2', 'Reserved'),
      this._desc(Word, 'e_lfanew', 'File address of new exe header')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  /** Reads File header (or COFF) */
  readFileHeader (): FileHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Word, 'Machine', 'Architecture type of the computer'),
      this._desc(Word, 'NumberOfSections', 'Size of the section table'),
      this._desc(DWord, 'TimeDataStamp', 'Date and time the image was created'),
      this._desc(DWord, 'PointerToSymbolTable', 'Offset of the symbol table, or zero if no COFF symbol table exists'),
      this._desc(DWord, 'NumberOfSymbols', 'Number of symbols in the symbol table'),
      this._desc(Word, 'SizeOfOptionalHeader', 'NtOptional32Header'),
      this._desc(Word, 'Characteristics', 'ExecutableImage, 32BitMachine')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  /** Reads optional header */
  readOptionalHeader (): OptionalHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(Word, 'Magic', 'PE32 - State of the image file'),
      this._desc(Byte, 'MajorLinkerVersion', ''),
      this._desc(Byte, 'MinorLinkerVersion', ''),
      this._desc(DWord, 'SizeOfCode', 'Size of the code section'),
      this._desc(DWord, 'SizeOfInitializedData', 'Size of the initialized data section'),
      this._desc(DWord, 'SizeOfUninitializedData', 'Size of the uninitialized data section'),
      this._desc(DWord, 'AddressOfEntryPoint', 'Pointer to the entry point function, relative to the image base address, or zero if no entry point is present'),
      this._desc(DWord, 'BaseOfCode', 'Pointer to the beginning of the code section, relative to the image base'),
      this._desc(DWord, 'BaseOfData', 'Pointer to the beginning of the data section, relative to the image base'),
      this._desc(DWord, 'ImageBase', 'Preferred address of the first byte of the image when it is loaded in memory'),
      this._desc(DWord, 'SectionAlignment', 'Alignment of the section loaded in memory'),
      this._desc(DWord, 'FileAlignment', 'Alignment of the raw data of sections in the image file'),
      this._desc(Word, 'MajorOperatingSystemVersion', 'Major version number of the required operating system'),
      this._desc(Word, 'MinorOperatingSystemVersion', 'Minor version number of the required operating system'),
      this._desc(Word, 'MajorImageVersion', ''),
      this._desc(Word, 'MinorImageVersion', ''),
      this._desc(Word, 'MajorSubsystemVersion', ''),
      this._desc(Word, 'MinorSubsystemVersion', ''),
      this._desc(DWord, 'Win32VersionValue', 'Reserved'),
      this._desc(DWord, 'SizeOfImage', 'Size of the image including all headers'),
      this._desc(DWord, 'SizeOfHeaders', ''),
      this._desc(DWord, 'CheckSum', 'Image file checksum'),
      this._desc(Word, 'Subsystem', 'WindowsCui - Subsystem required to run this image'),
      this._desc(Word, 'DllCharacteristics', 'DynamicBase, NxCompat, TerminalServerAware - DLL characteristics of the image'),
      this._desc(DWord, 'SizeOfStackReserve', 'Number of bytes to reserve for the stack'),
      this._desc(DWord, 'SizeOfStackCommit', 'Number of bytes to commit for the stack'),
      this._desc(DWord, 'SizeOfHeapReserve', 'Number of bytes to reserve for the local heap'),
      this._desc(DWord, 'SizeOfHeapCommit', 'Number of bytes to commit for the local heap'),
      this._desc(DWord, 'LoaderFlags', 'Obsolete'),
      this._desc(DWord, 'NumberOfRvaAndSizes', 'Number of directory entries in the remainder of the optional header')
    ]
    let struct = this.readStructure(structdef)
    return this.convertStructureToMap(struct)
  }

  /** Reads NT header */
  readNTHeader (): NTHeader {
    let structdef: Array<DataBlockDesk> = [
      this._desc(DWord, 'Signature', 'PE\\0\\0')
    ]
    let struct = this.readStructure(structdef)
    let map: Object = this.convertStructureToMap(struct)

    map.file = this.readFileHeader()
    map.optional = this.readOptionalHeader()

    return map
  }
}
