// @flow
/*
  Парсер исполняемых файлов
*/

import FileReader from './libs/FileReader'
import BlockReader from './libs/BlockReader'
import DataDictionary from './libs/DataDictionary'

import type { ExeFile } from './libs/ExeFile/struct'
import type { SectionHeader } from './libs/ExeFile/sectionHeader'
import type { Meta } from './libs/ExeFile/meta'
import BlockReaderDosHeader from './libs/ExeFile/dosHeader'
import BlockReaderNTHeader from './libs/ExeFile/ntHeader'
import type { DosHeader } from './libs/ExeFile/dosHeader'
import type { NtHeader } from './libs/ExeFile/ntHeader'
import BlockReaderSectionHeader from './libs/ExeFile/sectionHeader'
import type { ImportDescriptor } from './libs/ExeFile/importDescriptor'
import BlockReaderImportDescriptor from './libs/ExeFile/importDescriptor'
import type { ExportDescriptor } from './libs/ExeFile/exportDescriptor'
import BlockReaderExportDescriptor from './libs/ExeFile/exportDescriptor'
import { Type } from './libs/types'
import type { DataBlock } from './libs/FileReader'
import type { ImportData } from './libs/ExeFile/importData'
import { PexeIncorrectOrdinalError, PexeRvaToRawNullError } from './errors'
import type { SectionData } from './libs/ExeFile/sectionData'
import type { ExportData, ExportDataFunc } from './libs/ExeFile/exportData'

export default class Pexe {
  breader: BlockReader

  constructor (bytes?: Uint8Array) {
    if (bytes) this.setFile(bytes)
  }

  /**
   * Устанавливает байты целевого файла
   * @param bytes {Uint8Array}
   */
  setFile (bytes: Uint8Array) {
    this.breader = new BlockReader(new FileReader(bytes))
  }

  /**
   * Извлекает файл из сети и устанавливает его в качестве целевого
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
   * Генерирует функцию конвертации RVA в RAW адреса
   * @param sections
   * @param alignment
   * @returns {Function}
   */
  generateRvaToRawFunc (sections: Array<SectionHeader>, alignment: number): (rva: number) => number | null {
    let alignUp = (n, a) => Math.ceil(n / a) * a
    return (rva: number): number | null => {
      for (let i = 0; i < sections.length; i++) {
        let start = sections[i].VirtualAddress.num
        let end = start + alignUp(sections[i].VirtualSize.num, alignment)
        if (rva >= start && rva < end) {
          return rva - sections[i].VirtualAddress.num + sections[i].PointerToRawData.num
        }
      }
      return null
      //throw new PexeRvaToRawNullError(`RVA: ${rva}`)
      //return 0
    }
  }

  /**
   * Формирует мета-информацию принимая готовую распаршенную информацию
   * По сути не добавляет никакой новой информации, но приводит в читаемый вид существующую
   * @param exe {ExeFile}
   * @returns {Meta}
   */
  getMeta (exe: ExeFile): Meta {
    let meta: Meta = {}
    meta.isDOS = exe.headers.dos.e_magic.text === 'MZ'
    meta.isNT = exe.headers.nt.Signature.text === 'PE\0\0'

    if (meta.isNT) {
      meta.date = new Date(exe.headers.nt.file.TimeDataStamp.num * 1000)

      meta.machine = DataDictionary.decodeMachine(exe.headers.nt.file.Machine.num)
      meta.magic = DataDictionary.decodeMagic(exe.headers.nt.optional.Magic.num)
      meta.subsystem = DataDictionary.decodeSubsystem(exe.headers.nt.optional.Subsystem.num)
      meta.chars = DataDictionary.decodeChars(exe.headers.nt.file.Characteristics.num)
      meta.dllChars = DataDictionary.decodeDllChars(exe.headers.nt.optional.DllCharacteristics.num)
      meta.osVersion = DataDictionary.decodeOSVersion(
        exe.headers.nt.optional.MajorOperatingSystemVersion.num,
        exe.headers.nt.optional.MinorOperatingSystemVersion.num
      )

      // Дружелюбное представление секций
      meta.sections = this.parseSections(exe)

      // Парсинг директорий
      meta.imports = this.parseImports(exe)
      meta.exports = this.parseExports(exe)

      // Флаги
      meta.isDLL = meta.chars.includes('DLL')
      meta.is64 = meta.magic === 'PE64'
      meta.isStripped = meta.chars.findIndex(c => c.toLowerCase().indexOf('stripped') >= 0) >= 0
      meta.isGUI = meta.subsystem === 'WindowsGui'
      // Дополнительно детектить по директории IMAGE_DIRECTORY_ENTRY_DEBUG
      meta.isDebug = meta.sections.findIndex(s => s.name.toLowerCase().indexOf('debug') >= 0) >= 0
      // .cormeta если присутствует секция - ПО содержит managed код тоже
      meta.isNET = meta.imports.findIndex(imp => imp.name === 'mscoree.dll') >= 0
      // isPacked

    }
    return meta
  }

  /**
   * Приводит к читабельному виду информацию по импорту
   * @param exe
   * @returns {Array}
   */
  parseImports (exe: ExeFile): Array<ImportData> {
    let rvaToRaw = this.generateRvaToRawFunc(exe.sections, exe.headers.nt.optional.SectionAlignment.num)
    let imports = []

    for (let importDesk of exe.directories.import) {
      let data: ImportData = {}

      let nameOffset = rvaToRaw(importDesk.Name.num)
      if (nameOffset != null) {
        this.breader.setPointer(nameOffset)
        data.name = this.breader.readString()
        data.isBound = importDesk.TimeDateStamp.num !== 0
        data.funcs = []

        // Если импорт стандартный
        if (!data.isBound) {
          let addressTable = rvaToRaw(importDesk.FirstThunk.num)
          let lookupTableRaw = importDesk.OriginalFirstThunk.num === 0
            ? rvaToRaw(importDesk.OriginalFirstThunk.num)
            : addressTable

          // raw(56364) Offset for first element and start of import table
          // rva(66608) raw(56880) OriginalFirstThunk of dll1.dll for msvcrt.dll
          // rva(66802) raw(57074)

          // Идём по таблице ссылающейся на номера и имена функций
          if (lookupTableRaw !== null) {
            for (let lookup = lookupTableRaw; ; lookup += Type.DWord) {
              this.breader.setPointer(lookup)
              let structNameRva = this.breader.readType(Type.DWord).num

              // Выходим если достигли конца таблицы
              if (structNameRva === 0) break

              // Читаем номер и имя функции
              let structNameRaw = rvaToRaw(structNameRva)
              if (structNameRaw !== null) {
                this.breader.setPointer(structNameRaw)
                let num = this.breader.readType(Type.Word).num
                let name = this.breader.readString()

                data.funcs.push({ num, name })
              } else console.error(`WTF? structNameRaw is NULL: RVA: ${structNameRva}, lookupTableRaw: ${lookupTableRaw}`)
            }
          }

        }
        // TODO: bound import
      }

      imports.push(data)
    }

    return imports
  }

  parseExports (exe: ExeFile): Array<ExportData> {
    let rvaToRaw = this.generateRvaToRawFunc(exe.sections, exe.headers.nt.optional.SectionAlignment.num)
    let imports = []

    for (let exportDesk of exe.directories.export) {
      let data: ExportData = {}
      let nameRaw = rvaToRaw(exportDesk.Name.num)
      if (nameRaw !== null) {
        this.breader.setPointer(nameRaw)
        data.name = this.breader.readString()

        let addressFuncNamesRaw = rvaToRaw(exportDesk.AddressOfNames.num)
        let addressFuncOrdinalsRaw = rvaToRaw(exportDesk.AddressOfNameOrdinals.num)
        let addressFuncOffsetRaw = rvaToRaw(exportDesk.AddressOfFunctions.num)
        if (
          addressFuncNamesRaw !== null &&
          addressFuncOrdinalsRaw !== null &&
          addressFuncOffsetRaw !== null
        ) {
          let funcNames: Array<string> = []
          let addresses: Array<number> = []
          let ordinals: Array<number> = []

          // Чтение массива имён
          for (let i = 0; i < exportDesk.NumberOfNames.num; i++) {
            this.breader.setPointer(addressFuncNamesRaw + i * Type.DWord)
            let nameFuncRva = this.breader.readType(Type.DWord).num

            let nameFuncRaw = rvaToRaw(nameFuncRva)
            if (nameFuncRaw !== null) {
              this.breader.setPointer(nameFuncRaw)
              let nameFunc = this.breader.readString()
              funcNames.push(nameFunc)
            }
          }

          // Чтение массива ординалов
          for (let i = 0; i < exportDesk.NumberOfNames.num; i++) {
            this.breader.setPointer(addressFuncOrdinalsRaw + i * Type.Word)
            let ordinal = this.breader.readType(Type.Word).num
            ordinals.push(ordinal)
          }

          // Чтение массива смещений
          for (let i = 0; i < exportDesk.NumberOfFunctions.num; i++) {
            this.breader.setPointer(addressFuncOffsetRaw + i * Type.DWord)
            let funcOffset = this.breader.readType(Type.DWord).num
            addresses.push(funcOffset) // ТАМ RVA КОНВЕРТНУТЬ!
          }

          // Формируем массив экспортируемых функций
          let methods: Array<ExportDataFunc> = []
          let sortedOrdinals = Object.entries(ordinals).sort((a, b) => Number(a[1]) - Number(b[1]))
          for (let i = 0; i < funcNames.length; i++) {
            let ordinal = Number(sortedOrdinals[i][1])
            let offset = rvaToRaw(addresses[ordinal])
            if (offset === null) throw new PexeIncorrectOrdinalError(`ordinal with index ${i} with func addr ${addresses[ordinals[i]]} can't be casted to raw`)
            methods.push({
              name: funcNames[i],
              ordinal: ordinal + 1,
              offset,
              rva: addresses[ordinal]
            })
          }

          data.date = new Date(exportDesk.TimeDateStamp.num * 1000)
          data.funcs = methods
          imports.push(data)
        }
      }
      break // TODO: Блокировка на одно вхождение. Чисто технически одна библиотека может экспортировать несколько модулей
      // Но на некоторых парсер падает, т.к. нет нулей для опознания конца структуры
    }

    return imports
  }

  /**
   * Подготавливает инфомрацию о секциях в более дрежелюбном виде
   * @param exe
   * @returns {Array}
   */
  parseSections (exe: ExeFile): Array<SectionData> {
    let sections = []
    for (let section of exe.sections) {
      this.breader.setPointer(section.Name.offset)
      let name = this.breader.readString()

      let offset = section.PointerToRawData.num
      let size = section.SizeOfRawData.num
      let chars = DataDictionary.decodeSectionChars(section.Characteristics.num)

      sections.push({ name, offset, size, chars })
    }
    return sections
  }

  /**
   * Читает DOS заголовок
   * @returns {DosHeader}
   */
  readDOSHeader (): DosHeader {
    let brDOSReader = new BlockReaderDosHeader()
    brDOSReader.setReader(this.breader.getReader())
    return brDOSReader.read()
  }

  /**
   * Читает NT заголовок
   * @returns {NtHeader}
   */
  readNTHeader (): NtHeader {
    let brNTHeader = new BlockReaderNTHeader()
    brNTHeader.setReader(this.breader.getReader())
    return brNTHeader.read()
  }

  /**
   * Читает секции
   * @param count
   * @returns {Array<SectionHeader>}
   */
  readSections (count: number): Array<SectionHeader> {
    let brSection = new BlockReaderSectionHeader()
    brSection.setReader(this.breader.getReader())
    return brSection.readAll(count)
  }

  /**
   * Читает таблицу импортов
   * @returns {Array<ImportDescriptor>}
   */
  readDirImportDescriptors (): Array<ImportDescriptor> {
    let brImportDesc = new BlockReaderImportDescriptor()
    brImportDesc.setReader(this.breader.getReader())
    return brImportDesc.readAll()
  }

  /**
   * Читает таблицу экспортов
   * @returns {Array<ExportDescriptor>}
   */
  readDirExportDescriptors (): Array<ExportDescriptor> {
    let brExportDesc = new BlockReaderExportDescriptor()
    brExportDesc.setReader(this.breader.getReader())
    return brExportDesc.readAll()
  }

  /**
   * Возвращает информацию по исполняемому файлу
   * @returns {ExeFile}
   */
  parse (): ExeFile {
    let file: Object = {
      bytes: this.breader.getFileBytes(),
      meta: {},
      headers: {
        dos: {},
        nt: {}
      },
      sections: [],
      directories: {},
    }
    let exe: ExeFile = file

    exe.headers.dos = this.readDOSHeader()

    // Если DOS приложение
    if (exe.headers.dos.e_magic.text === 'MZ') {
      this.breader.setPointer(exe.headers.dos.e_lfanew.num)
      exe.headers.nt = this.readNTHeader()

      // Если Windows приложение
      if (exe.headers.nt.Signature.text === 'PE\0\0') {
        exe.sections = this.readSections(exe.headers.nt.file.NumberOfSections.num)

        let rvaToRaw = this.generateRvaToRawFunc(exe.sections, exe.headers.nt.optional.SectionAlignment.num)
        window.rvaToRaw = rvaToRaw

        // Чтение таблицы импорта
        exe.directories.import = []
        let rawImportDir = rvaToRaw(exe.headers.nt.optional.DataDirectory[1].VirtualAddress.num)
        if (rawImportDir) {
          this.breader.setPointer(rawImportDir)
          exe.directories.import = this.readDirImportDescriptors()
        }

        // Чтение таблицы экспорта
        exe.directories.export = []
        let rawExportDir = rvaToRaw(exe.headers.nt.optional.DataDirectory[0].VirtualAddress.num)
        if (rawExportDir) {
          this.breader.setPointer(rawExportDir)
          exe.directories.export = this.readDirExportDescriptors()
        }

      }

    }

    // Анализ данных и формирование более удобного представления
    exe.meta = this.getMeta(exe)

    return exe
  }
}

/*
- Если это dll то должно совпадать время создания файла и время сборки методов в таблице экспорта (хотя это не всегда)
- Если dll экспортирует методы под более чем 1 именем
- Если dll экспортирует методы под не совпадающим со своим именем

- Если секция содержащая характеристику IMAGE_SCN_CNT_CODE называется не .text или секций с этой характеристикой несколько
 */