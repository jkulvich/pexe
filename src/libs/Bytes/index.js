// @flow
/*
Класс занимается обработкой байтов и различными их конвертациями
 */

import * as Errors from './errors'

export default class Bytes {
  /** Проверяет, что число является байтом */
  static isByte (byte: number): boolean {
    return typeof byte === typeof Number() && byte >= 0 && byte <= 255
  }

  /** Проверяет, что строка является шеснадцатеричным байтом */
  static isHex (hex: string): boolean {
    if (typeof hex !== typeof String()) return false
    if (hex.length !== 2) return false
    return (/[0-9a-f]{2}/).test(hex)
  }

  /** Проверяет, что строка содержит шеснадцатеричный массив */
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

  /** Проверяет, что число целое и положительное */
  static isPosInt (num: number): boolean {
    return Math.abs(num | 0) === num
  }

  /**
   * Возвращает строку из двух сиволов являющуюся шеснадцатеричным представлением байта
   * @param {number} byte - байт [0-255]
   * @returns {string}
   */
  static byteToHex (byte: number): string {
    if (!Bytes.isByte(byte)) {
      throw new Errors.BytesNotByteError(`expected number byte, got: ${byte}`)
    }
    return byte.toString(16).toUpperCase().padStart(2, '0')
  }

  /**
   * Возвращает байт по переданным одному или двум символам, например 5D => 93
   * @param {string} hex - 1 или 2 символа
   * @returns {number}
   */
  static hexToByte (hex: string): number {
    if (!Bytes.isHex(hex)) {
      throw new Errors.BytesNotHexByteError(`expected string hex with 1 or 2 hex chars, got: ${hex}`)
    }
    return parseInt(hex, 16)
  }

  /**
   * Возвращает hex строку эквивалентную массиву байт [77, 90] => 5A4D
   * @param arr {number[]} - массив байт
   * @param align {number} - выравнивание строки до указанного количества байт
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
   * Возвращает массив байт по шеснадцатиричной строке, например 5A4D => [77, 90]
   * @param hexs {string} - hex строка
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
   * Возвращает число из массива байт, например [77, 90] => 23117
   * @param arr {number[]} - массив байт
   * @returns {number}
   */
  static arrayToNumber (arr: Uint8Array): number {
    return arr.map((num, pos) => (256 ** pos) * num).reduce((acc: number, num) => acc + num)
  }

  /**
   * Возвращает массив байт из числа, например 23117 => [77, 90]
   * @param num {number} - целое позитивное число
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
   * Возвращает массив байт на основе строки смиволов (каждый символ - 1 байт), например "MZ" => [77, 90]
   * @param str {string}
   * @returns {Array}
   */
  static stringToArray (str: string): Uint8Array {
    return new TextEncoder().encode(str)
  }

  /**
   * Возвращает строку символов на основе массива байт, например [77, 90] => "MZ"
   * @param arr {number[]}
   * @returns {string}
   */
  static arrayToString (arr: Uint8Array): string {
    return new TextDecoder().decode(arr)
  }

  /**
   * Переводит число в шеснадцатеричное представление и использует выравнивание если указано
   * @param num {number}
   * @param align {number}
   * @returns {string}
   */
  static numberToHex (num: number, align: number = 0): string {
    return Bytes.arrayToHex(Bytes.numberToArray(num), align)
  }

  /**
   * Переводит шеснадцатеричное число в десятичнное представление
   * @param hex {}
   * @returns {number}
   */
  static hexToNumber (hex: string): number {
    return Bytes.arrayToNumber(Bytes.hexToArray(hex))
  }
}
