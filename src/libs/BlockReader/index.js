// @flow
/*
  Представляет методы для чтения блоков информации
 */

import FileReader from '../FileReader'
import * as Errors from './errors'

import type { DataBlock } from '../FileReader'
import type { DosHeader } from '../ExeFile/dosHeader'
import type { FileHeader } from '../ExeFile/fileHeader'
import type { OptionalHeader } from '../ExeFile/optionalHeader'
import type { NtHeader } from '../ExeFile/ntHeader'
import type { DataDirectory } from '../ExeFile/dataDirectory'
import type { SectionHeader } from '../ExeFile/sectionHeader'
import type { ExportDescriptor } from '../ExeFile/exportDescriptor'
import type { ImportDescriptor } from '../ExeFile/importDescriptor'
import { BlockReaderError } from './errors'
import { Type } from '../types'

const Byte = 1
const Word = 2
const DWord = 4

/** Описание блока информации ля извлечения */
export type DataBlockDesk = {
  size: number,
  name: string,
  desc: string
}

/** Читает блоки информации из файла */
export default class BlockReader {
  _reader: FileReader
  _pointerStack: Array<number> = []

  constructor (fileReader?: FileReader) {
    if (fileReader) {
      this.setReader(fileReader)
    }
  }

  /** Устанавливает инструмент чтения файла */
  setReader (fileReader: FileReader) {
    this._reader = fileReader
  }

  /** Возвращает инструмент чтения файла */
  getReader (): FileReader {
    return this._reader
  }

  /** Возвращает байты файла */
  getFileBytes (): Uint8Array {
    return this._reader.bytes
  }

  /** Устанавливает позицию курсора в файле [//TODO: DEPRECATED, удалить this]*/
  setPointer (pos: number): BlockReader {
    if (!this._reader) throw new Errors.BlockReaderEmptyFileReaderError(`file reader is not set`)
    this._reader.pointer = pos
    return this
  }

  /** Возвращает позицию указателя */
  getPointer (): number {
    return this._reader.pointer
  }

  /** Сохраняет позицию курсора в стек */
  savePointer () {
    this._pointerStack.push(this._reader.pointer)
  }

  /** Восстанавливает позицию курсора из стека */
  restorePointer () {
    if (this._pointerStack.length > 0)
      this._reader.pointer = this._pointerStack.pop()
    else throw new BlockReaderError('pointer stack is empty, save pointer first')
  }

  /** Читает массив блоков информации по массиву их описаний */
  readStructure (struct: Array<DataBlockDesk>): Array<DataBlock> {
    if (!this._reader) throw new Errors.BlockReaderEmptyFileReaderError(`file reader is not set`)
    let blocks: Array<DataBlock> = []
    struct.forEach(s => blocks.push(this._reader.readBlock(s.size, s.name, s.desc)))
    return blocks
  }

  /** Читает строку оканчивающуюся нулевым символом */
  readString (): string {
    let name = []
    for (; ;) {
      let char = this._reader.readNext()
      if (char === 0) break
      name.push(char)
    }
    return String.fromCharCode(...name)
  }

  /** Читает один тип в блок */
  readType (type: number): DataBlock {
    return this._reader.readBlock(type)
  }

  /**
   * Конвертирует массив блоков информации в словарь по их именам
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

  /** Создаёт новый блок описания блока информации */
  _desc (size: number, name: string, desc: string = ''): DataBlockDesk {
    return { size, name, desc }
  }
}
