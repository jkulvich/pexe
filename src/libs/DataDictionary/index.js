// @flow
/*
Code to text decoder
*/

import type { SectionHeader } from '../ExeFile/sectionHeader'

export default class DataDictionary {
  /** Decode architecture [Machine] */
  static decodeMachine (id: number): string {
    let machines = {
      [String(0x0000)]: 'Unknown',
      [String(0x014C)]: 'I386',
      [String(0x014D)]: 'I486',
      [String(0x014E)]: 'PENTIUM',
      [String(0x0160)]: 'R3000_BE',
      [String(0x0162)]: 'R3000',
      [String(0x0166)]: 'R4000',
      [String(0x0168)]: 'R10000',
      [String(0x0169)]: 'WCEMIPSV2',
      [String(0x0184)]: 'ALPHA',
      [String(0x01A2)]: 'SH3',
      [String(0x01A3)]: 'SH3DSP',
      [String(0x01A6)]: 'SH4',
      [String(0x01A8)]: 'SH5',
      [String(0x01C0)]: 'ARM',
      [String(0x01C2)]: 'THUMB',
      [String(0x01D3)]: 'AM33',
      [String(0x01F0)]: 'POWERPC',
      [String(0x01F1)]: 'POWERPCFP',
      [String(0x0200)]: 'IA64',
      [String(0x0266)]: 'MIPS16',
      [String(0x0284)]: 'ALPHA64',
      [String(0x0366)]: 'MIPSFPU',
      [String(0x0466)]: 'MIPSFPU16',
      [String(0x0520)]: 'TRICORE',
      [String(0x0CEF)]: 'CEF',
      [String(0x0EBC)]: 'EBC',
      [String(0x8664)]: 'AMD64',
      [String(0x9104)]: 'M32R',
      [String(0xC0EE)]: 'CEE',
      [String(0x01C4)]: 'ARMNT'
    }
    return machines[id] || 'Unknown'
  }

  /** Decode image type [Magic] */
  static decodeMagic (id: number): string {
    let magics = {
      [String(0x010B)]: 'PE32',
      [String(0x020B)]: 'PE64',
      [String(0x0107)]: 'ROM'
    }
    return magics[id] || 'Unknown'
  }

  /** Decode OS version by major and minor [MajorOperatingSystemVersion, MinorOperatingSystemVersion] */
  static decodeOSVersion (maj: number, min: number) {
    let version = maj + '.' + min
    let versions = {
      '1.1': 'Windows 1.0',
      '1.2': 'Windows 1.02',
      '1.3': 'Windows 1.03',
      '1.4': 'Windows 1.04',
      '2.3': 'Windows 2.03',
      '2.10': 'Windows 2.10',
      '2.11': 'Windows 2.11',
      '3.0': 'Windows 3.0',
      '3.10': 'Windows 3.1',
      '3.11': 'Windows 3.11',
      '3.2': 'Windows 3.2',
      '3.50': 'Windows 3.5',
      '3.51': 'Windows 3.51',
      '4.0': 'Windows 95',
      '4.10': 'Windows 98',
      '5.0': 'Windows 2000',
      '4.90': 'Windows ME',
      '5.1': 'Windows XP',
      '5.2': 'Windows XP Professional x64 Edition',
      '6.0': 'Windows Vista',
      '6.1': 'Windows 7',
      '6.2': 'Windows 8',
      '6.3': 'Windows 8.1',
      '10.0': 'Windows 10'
    }
    return versions[version] || 'Unknown'
  }

  /** Decode runtime subsystem [Subsystem] */
  static decodeSubsystem (id: number): string {
    let subsystems = {
      [String(0x0000)]: 'Unknown',
      [String(0x0001)]: 'Native',
      [String(0x0002)]: 'WindowsGui',
      [String(0x0003)]: 'WindowsCui',
      [String(0x0005)]: 'Os2Cui',
      [String(0x0007)]: 'PosixCui',
      [String(0x0008)]: 'NativeWindows',
      [String(0x0009)]: 'WindowsCeGui',
      [String(0x000A)]: 'EfiApplication',
      [String(0x000B)]: 'EfiBootServiceDriver',
      [String(0x000C)]: 'EfiRuntimeDriver',
      [String(0x000D)]: 'EfiRom',
      [String(0x000E)]: 'Xbox',
      [String(0x0010)]: 'WindowsBootApplication'
    }
    return subsystems[id] || 'Unknown'
  }

  /** Decode characteristics set [Characteristics] */
  static decodeChars (id: number): Array<string> {
    let chars = {
      [String(0x0001)]: 'RelocsStripped',
      [String(0x0002)]: 'ExecutableImage',
      [String(0x0004)]: 'LineNumsStripped',
      [String(0x0008)]: 'LocalSymsStripped',
      [String(0x0010)]: 'AggressiveWSTrim',
      [String(0x0020)]: 'LargeAddressAware',
      [String(0x0040)]: 'Reserved',
      [String(0x0080)]: 'BytesReversedLo',
      [String(0x0100)]: '32BitMachine',
      [String(0x0200)]: 'DebugStripped',
      [String(0x0400)]: 'RemovableRunFromSwap',
      [String(0x0800)]: 'NetRunFromSwap',
      [String(0x1000)]: 'System',
      [String(0x2000)]: 'DLL',
      [String(0x4000)]: 'UpSystemOnly',
      [String(0x8000)]: 'BytesReversedHi'
    }
    let charsList: Array<string> = []
    for (let code in chars) if ((id & +code) === +code) charsList.push(chars[code])
    return charsList
  }

  /** Decode library characteristics set [DllCharacteristics] */
  static decodeDllChars (id: number): Array<string> {
    let dllchars = {
      [String(0x0020)]: 'HighEntropyVa',
      [String(0x0040)]: 'DynamicBase',
      [String(0x0080)]: 'ForceIntegrity',
      [String(0x0100)]: 'NxCompat',
      [String(0x0200)]: 'NoIsolation',
      [String(0x0400)]: 'NoSeh',
      [String(0x0800)]: 'NoBind',
      [String(0x1000)]: 'Appcontainer',
      [String(0x2000)]: 'WdmDriver',
      [String(0x4000)]: 'GuardCf',
      [String(0x8000)]: 'TerminalServerAware'
    }
    let dllcharsList = []
    for (let code in dllchars) if ((id & +code) === +code) dllcharsList.push(dllchars[code])
    return dllcharsList
  }

  static decodeSectionsName (sections: Array<SectionHeader>): Array<string> {
    let names = []
    sections.forEach(section => {
      let nonzero = false
      let name = []
      section.Name.raw.reverse().forEach(c => {
        if (c !== 0) nonzero = true
        if (nonzero) name.push(c)
      })
      names.push(String.fromCharCode(...name.reverse()))
    })
    return names
  }

  /** Декодирует информацию в характеристике секции [Section -> Characteristics] */
  static decodeSectionChars (id: number): Array<string> {
    let chars = {
      [String(0x00000001)]: 'Reserved [00000001]',
      [String(0x00000002)]: 'Reserved [00000002]',
      [String(0x00000004)]: 'Reserved [00000004]',
      [String(0x00000008)]: 'IMAGE_SCN_TYPE_NO_PAD',
      [String(0x00000010)]: 'Reserved [00000010]',
      [String(0x00000020)]: 'IMAGE_SCN_CNT_CODE',
      [String(0x00000040)]: 'IMAGE_SCN_CNT_INITIALIZED_DATA',
      [String(0x00000080)]: 'IMAGE_SCN_CNT_UNINITIALIZED_DATA',
      [String(0x00000100)]: 'IMAGE_SCN_LNK_OTHER',
      [String(0x00000200)]: 'IMAGE_SCN_LNK_INFO',
      [String(0x00000400)]: 'Reserved [00000400]',
      [String(0x00000800)]: 'IMAGE_SCN_LNK_REMOVE',
      [String(0x00001000)]: 'IMAGE_SCN_LNK_COMDAT',
      [String(0x00002000)]: 'Reserved [00002000]',
      [String(0x00004000)]: 'IMAGE_SCN_NO_DEFER_SPEC_EXC',
      [String(0x00008000)]: 'IMAGE_SCN_GPREL',
      [String(0x00010000)]: 'Reserved [00010000]',
      [String(0x00020000)]: 'IMAGE_SCN_MEM_PURGEABLE',
      [String(0x00040000)]: 'IMAGE_SCN_MEM_LOCKED',
      [String(0x00080000)]: 'IMAGE_SCN_MEM_PRELOAD',
      [String(0x00100000)]: 'IMAGE_SCN_ALIGN_1BYTES',
      [String(0x00200000)]: 'IMAGE_SCN_ALIGN_2BYTES',
      [String(0x00300000)]: 'IMAGE_SCN_ALIGN_4BYTES',
      [String(0x00400000)]: 'IMAGE_SCN_ALIGN_8BYTES',
      [String(0x00500000)]: 'IMAGE_SCN_ALIGN_16BYTES',
      [String(0x00600000)]: 'IMAGE_SCN_ALIGN_32BYTES',
      [String(0x00700000)]: 'IMAGE_SCN_ALIGN_64BYTES',
      [String(0x00800000)]: 'IMAGE_SCN_ALIGN_128BYTES',
      [String(0x00900000)]: 'IMAGE_SCN_ALIGN_256BYTES',
      [String(0x00A00000)]: 'IMAGE_SCN_ALIGN_512BYTES',
      [String(0x00B00000)]: 'IMAGE_SCN_ALIGN_1024BYTES',
      [String(0x00C00000)]: 'IMAGE_SCN_ALIGN_2048BYTES',
      [String(0x00D00000)]: 'IMAGE_SCN_ALIGN_4096BYTES',
      [String(0x00E00000)]: 'IMAGE_SCN_ALIGN_8192BYTES',
      [String(0x01000000)]: 'IMAGE_SCN_LNK_NRELOC_OVFL',
      [String(0x02000000)]: 'IMAGE_SCN_MEM_DISCARDABLE',
      [String(0x04000000)]: 'IMAGE_SCN_MEM_NOT_CACHED',
      [String(0x08000000)]: 'IMAGE_SCN_MEM_NOT_PAGED',
      [String(0x10000000)]: 'IMAGE_SCN_MEM_SHARED',
      [String(0x20000000)]: 'IMAGE_SCN_MEM_EXECUTE',
      [String(0x40000000)]: 'IMAGE_SCN_MEM_READ',
      [String(0x80000000)]: 'IMAGE_SCN_MEM_WRITE',
    }
    let charsList = []
    for (let code in chars) if ((id & +code) === +code) charsList.push(chars[code])
    if (id === 0) charsList.push('Reserved [00000000]')
    return charsList
  }
}
