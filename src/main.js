// @flow
/*
  Executable files parser
*/

import FileReader from './libs/FileReader'
import Bytes from './libs/Bytes'
import BlockReader from './libs/BlockReader'
import DataDictionary from './libs/DataDictionary'

import type DataBlockDesk from './libs/BlockReader'
import type DataBlock from './libs/FileReader'

export default class Pexe {
  _reader: FileReader

  constructor (bytes?: Uint8Array) {
    this._reader = new FileReader()
    if (bytes) this.setFile(bytes)
  }

  /**
   * Set new file
   * @param bytes {Uint8Array}
   */
  setFile (bytes: Uint8Array) {
    this._reader.setFile(bytes)
  }

  /**
   * Fetch and set new file
   * @param url
   * @returns {Promise<void>}
   */
  async fetchFile (url: string) {
    let resp = await fetch('./soft.exe')
    let buff = await resp.arrayBuffer()
    this.setFile(new Uint8Array(buff))
    return buff
  }
}
