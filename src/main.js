// @flow
/*
  Executable files parser
*/

import FileReader from './libs/FileReader'
import BlockReader from './libs/BlockReader'
import DataDictionary from './libs/DataDictionary'

import type { ExeFile } from './libs/ExeFile/struct'
import type { SectionHeader } from './libs/ExeFile/sectionHeader'

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

  /*
  RAW (file offset) = RVA - sectionRVA + rawSection // Смещение относительно начала файла
  RVA (Relative Virtual Address) =  // Адрес относительно того, куда была выгружена программа
  VA (Virtual Address) = ImageBase + RVA // Адрес относительно начала виртуальной памяти

  rawSection - смещение до секции от начала файла
  sectionRVA - RVA секции (это поле хранится внутри секции)
   */

  /**
   * Converts RVA to RAW
   * @param {number} rva
   * @param {Array<SectionHeader>} sections
   * @param {number} alignment
   * @returns {number | null} raw address or null if incorrect sections
   */
  rvaToRaw (rva: number, sections: Array<SectionHeader>, alignment: number): number | null {
    let alignUp = (n, a) => Math.ceil(n / a) * a
    for (let i = 0; i < sections.length; i++) {
      let start = sections[i].VirtualAddress.num
      let end = start + alignUp(sections[i].VirtualSize.num, alignment)
      if (rva >= start && rva < end) {
        return rva - sections[i].VirtualAddress.num + sections[i].PointerToRawData.num
      }
    }
    return null
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
      },
      sections: []
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

    // Read sections headers
    if (exe.meta.isNT) {
      exe.sections = breader.readSections(exe.headers.nt.file.NumberOfSections.num)
      exe.meta.sections = DataDictionary.decodeSectionsName(exe.sections)
    }

    // Getting import tables
    if (exe.meta.isNT) {
      let alignment = exe.headers.nt.optional.SectionAlignment.num
      let sections = exe.sections

      let importRva = exe.headers.nt.optional.DataDirectory[1].VirtualAddress.num
      let importRaw = this.rvaToRaw(importRva, sections, alignment)

      if (importRaw != null) {
        breader.setPointer(importRaw)
        for (let i = 0;; i++) {
          let importDesc = breader.readImportDescriptor()
          if (importDesc.OriginalFirstThunk === 0) break

          // Достаём имена библиотек
          let libnameRaw = this.rvaToRaw(importDesc.Name.num, sections, alignment)
          if (libnameRaw == null) break //TODO: Такой ситуации не должно быть в рабочем exe'шнике
          breader.savePointer()
          let libname = breader.setPointer(libnameRaw).readString()
          breader.restorePointer()
          console.log(libname)

        }
      }
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
      exe.meta.dateStamp = new Date(exe.headers.nt.file.TimeDataStamp.num * 1000)
      exe.meta.isDLL = exe.meta.chars.includes('DLL')
      exe.meta.is64 = exe.meta.magic === 'PE64'
    }

    return exe
  }
}
