// @flow
/*
Bytes manipulation
*/

import * as Errors from './errors'

export default class Bytes {
  /** Determines that number is byte */
  static isByte (byte: number): boolean {
    return typeof byte === typeof Number() && byte >= 0 && byte <= 255
  }

  /** Determines that string is hex byte (2 chars) */
  static isHex (hex: string): boolean {
    if (typeof hex !== typeof String()) return false
    if (hex.length !== 2) return false
    return (/[0-9a-f]{2}/i).test(hex)
  }

  /** Determines that string is hex array */
  static isHexString (hexs: string): boolean {
    if (typeof hexs !== typeof String()) return false
    if (hexs.length % 2 !== 0) return false
    let hexArr = hexs.match(/([a-z0-9]{2})/ig)
    if (hexArr != null) {
      for (let hex of hexArr) {
        if (!Bytes.isHex(hex)) return false
      }
      return true
    } else throw new Errors.BytesError('unexpected null after regexp')
  }

  /** Determines that number is integer and positive */
  static isPosInt (num: number): boolean {
    return Math.abs(num | 0) === num
  }

  /**
   * Returns 2 chars hex string equals given byte
   * @param {number} byte
   * @returns {string}
   */
  static byteToHex (byte: number): string {
    if (!Bytes.isByte(byte)) {
      throw new Errors.BytesNotByteError(`expected number byte, got: ${byte}`)
    }
    return byte.toString(16).toUpperCase().padStart(2, '0')
  }

  /**
   * Returns byte by given hex string
   * @param {string} hex - 2 chars
   * @returns {number}
   */
  static hexToByte (hex: string): number {
    if (!Bytes.isHex(hex)) {
      throw new Errors.BytesNotHexByteError(`expected string hex with 1 or 2 hex chars, got: ${hex}`)
    }
    return parseInt(hex, 16)
  }

  /**
   * Returns hex string equals given bytes array
   * @param arr {number[]}
   * @param align {number} - left zero bytes count alignment
   * @returns {string}
   */
  static arrayToHex (arr: Uint8Array, align: number = 0): string {
    let zeros = '00'.repeat(Math.max(0, align - arr.length))
    let hexs = Array(arr.length)
    arr.slice().reverse().forEach((num, i) => {
      hexs[i] = Bytes.byteToHex(num)
    })
    return zeros + hexs.join('')
  }

  /**
   * Returns bytes array by given hex string
   * @param hexs {string}
   * @returns {number[]}
   */
  static hexToArray (hexs: string): Uint8Array {
    if (!Bytes.isHexString(hexs)) throw new Errors.BytesNotHexStringError(`expected hex string, got: ${hexs}`)
    let hexNums = hexs.match(/[a-z\d]{2}/gi)
    if (hexNums == null) throw new Errors.BytesError('unexpected null after regexp')
    let arr = hexNums.map(hex => Bytes.hexToByte(hex)).reverse()
    while (arr.length > 0) {
      let n = arr.pop()
      if (n !== 0) {
        arr.push(n)
        break
      }
    }
    return new Uint8Array(arr)
  }

  /**
   * Returns number by given bytes array
   * @param arr {number[]}
   * @returns {number}
   */
  static arrayToNumber (arr: Uint8Array): number {
    return [...arr].map((num, pos) => (256 ** pos) * num).reduce((acc: number, num) => acc + num)
  }

  /**
   * Returns bytes array by given number
   * @param num {number}
   * @returns {number[]}
   */
  static numberToArray (num: number): Uint8Array {
    if (!Bytes.isPosInt(num)) throw new Errors.BytesNotPosIntError(`expected positive integer, got: ${num}`)
    let arr = []
    while (num > 0) {
      arr.push(num % 256)
      num = (num - num % 256) / 256
    }
    return new Uint8Array(arr)
  }

  /**
   * Returns bytes array by given text
   * @param str {string}
   * @returns {Array}
   */
  static stringToArray (str: string): Uint8Array {
    return new TextEncoder().encode(str)
  }

  /**
   * Returns text by given bytes array
   * @param arr {number[]}
   * @returns {string}
   */
  static arrayToString (arr: Uint8Array): string {
    return new TextDecoder().decode(arr)
  }

  /**
   * Returns hex string by given number
   * @param num {number}
   * @param align {number}
   * @returns {string}
   */
  static numberToHex (num: number, align: number = 0): string {
    return Bytes.arrayToHex(Bytes.numberToArray(num), align)
  }

  /**
   * Returns number by given hex string
   * @param hex {string}
   * @returns {number}
   */
  static hexToNumber (hex: string): number {
    return Bytes.arrayToNumber(Bytes.hexToArray(hex))
  }
}
