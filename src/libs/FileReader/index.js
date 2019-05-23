// @flow
/*
Содержит методы чтения файла на уровне байт
*/

import * as Errors from './errors'
import Bytes from '../Bytes'

/** Структура описания информационного блока */
export type DataBlock = {
  size: number,
  name: string,
  desc: string,
  offset: number,
  type: string,
  raw: Uint8Array,
  num: number,
  text: string,
  hex: string,
}

/** Чтение и разбор массива байт */
export default class FileReader {
  /** Байты рабочего файла */
  _bytes: Uint8Array
  /** Указатель на текущую позицию в файле */
  pointer: number = 0

  constructor (bytes?: Uint8Array) {
    if (bytes) this.setFile(bytes)
  }

  /** Устанавливает новый рабочий файл */
  setFile (bytes: Uint8Array): void {
    this._bytes = bytes
    this.pointer = 0
  }

  /** Проверяет, находится ли указатель в конце файла */
  isEOF (): boolean {
    return this.pointer >= this._bytes.length - 1
  }

  /** Читает следующий байт или выбрасывает исключение, если конец файла */
  readNext (): number {
    if (!this.isEOF()) return this._bytes[this.pointer++]
    else throw new Errors.FileReaderEOFError(`end of file`)
  }

  /** Возвращает логическое значение, говорящее, возможно ли прочитать следующее количество байт прежде чем файл закончиться **/
  canRead (count: number): boolean {
    return this.pointer + count <= this._bytes.length
  }

  /** Читает несколько байт и возвращает их, выбрасывает исключение если достигнут конец файла **/
  readArray (count: number): Uint8Array {
    if (this.canRead(count)) return new Uint8Array(count).map(() => this.readNext())
    else throw new Errors.FileReaderEOFError(`end of file`)
  }

  /** Читает блок и составляет по нему описание */
  readBlock (count: number, name: string = '', desc: string = ''): DataBlock {
    let offset = this.pointer
    let block = this.readArray(count)
    let types: { [number]: string } = {}
    types[1] = 'Byte'
    types[2] = 'Word'
    types[4] = 'DWord'
    types[8] = 'QWord'
    types[16] = 'YWord'
    return {
      size: count,
      name,
      desc,
      offset: offset,
      type: types[count] || 'Data',
      raw: block,
      num: Bytes.arrayToNumber(block),
      text: Bytes.arrayToString(block),
      hex: Bytes.arrayToHex(block)
    }
  }
}
