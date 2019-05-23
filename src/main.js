// @flow
/*
  Executable files parser
*/

import FileReader from './libs/FileReader'
import BlockReader from './libs/BlockReader'
import DataDictionary from './libs/DataDictionary'

import type { ExeFile } from './libs/ExeFile/struct'

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
   * Fetch file from url and set it
   * @param url
   * @returns {Promise<void>}
   */
  async fetchFile (url: string) {
    let resp = await window.fetch(url)
    let buff = await resp.arrayBuffer()
    this.setFile(new Uint8Array(buff))
  }

  /**
   * Returns exe file info
   * @returns {ExeFile}
   */
  parse (): ExeFile {
    let file: Object = {
      bytes: new Uint8Array([]),
      meta: {},
      headers: {
        dos: {},
        nt: {}
      }
    }
    let exe: ExeFile = file

    let breader = new BlockReader(this._reader)
    exe.bytes = this._reader.bytes

    // Read DOS header
    if (this._reader.bytes.length >= 64) {
      exe.headers.dos = breader.setPointer(0).readDOSHeader()
      if (exe.headers.dos.e_magic.text === 'MZ') exe.meta.isDOS = true
    }

    // Read NT header if lfanew is correct
    let lfanew = Number(exe.headers.dos.e_lfanew.num)
    if (lfanew > 64 && lfanew < exe.bytes.length - 512) {
      exe.headers.nt = breader.setPointer(lfanew).readNTHeader()
      if (exe.headers.nt.Signature.text === 'PE\0\0') exe.meta.isNT = true
    }

    // Decode user-friendly information
    if (exe.meta.isNT) {
      exe.meta.machine = DataDictionary.decodeMachine(exe.headers.nt.file.Machine.num)
      exe.meta.magic = DataDictionary.decodeMagic(exe.headers.nt.optional.Magic.num)
      exe.meta.osVersion = DataDictionary.decodeOSVersion(
        exe.headers.nt.optional.MajorOperatingSystemVersion.num,
        exe.headers.nt.optional.MinorOperatingSystemVersion.num
      )
      exe.meta.subsystem = DataDictionary.decodeSubsystem(exe.headers.nt.optional.Subsystem.num)
      exe.meta.chars = DataDictionary.decodeChars(exe.headers.nt.file.Characteristics.num)
      exe.meta.dllChars = DataDictionary.decodeDllChars(exe.headers.nt.optional.DllCharacteristics.num)
    }

    return exe
  }
}
