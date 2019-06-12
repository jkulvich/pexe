// @flow
/*
Reads file by byte per byte
*/

import * as Errors from './errors'
import Bytes from '../Bytes'
import { Type } from '../types'

/** Information block scheme */
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

/** Reading and parsing byte array */
export default class FileReader {
  bytes: Uint8Array
  pointer: number = 0

  constructor (bytes?: Uint8Array) {
    if (bytes) this.setFile(bytes)
  }

  /** Set new working file */
  setFile (bytes: Uint8Array): void {
    this.bytes = bytes
    this.pointer = 0
  }

  /** Is pointer in end of file */
  isEOF (): boolean {
    return this.pointer >= this.bytes.length - 1
  }

  /** Read next byte or throw exception */
  readNext (): number {
    if (!this.isEOF()) return this.bytes[this.pointer++]
    else throw new Errors.FileReaderEOFError(`end of file`)
  }

  /** Determines that can read given count of bytes **/
  canRead (count: number): boolean {
    return this.pointer + count <= this.bytes.length
  }

  /** Reads given count of bytes or throws exception **/
  readArray (count: number): Uint8Array {
    if (this.canRead(count)) return new Uint8Array(count).map(() => this.readNext())
    else throw new Errors.FileReaderEOFError(`end of file`)
  }

  /** Reads block and makes block with description */
  readBlock (count: number, name: string = '', desc: string = ''): DataBlock {
    let offset = this.pointer
    let block = this.readArray(count)
    let types: { [number]: string } = {}
    types[Type.Byte] = 'Byte'
    types[Type.Word] = 'Word'
    types[Type.DWord] = 'DWord'
    types[Type.QWord] = 'QWord'
    types[Type.TWord] = 'TWord'
    types[Type.OWord] = 'OWord'
    types[Type.YWord] = 'YWord'
    types[Type.ZWord] = 'ZWord'
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
