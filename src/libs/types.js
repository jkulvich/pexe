// @flow

export class Type {
  static get Byte() { // 1
    return 1
  }
  static get Word() { // 2
    return Type.Byte * 2
  }
  static get DWord() { // 4
    return Type.Word * 2
  }
  static get QWord() { // 8
    return Type.DWord * 2
  }
  static get TWord() { // 10
    return Type.Byte * 10
  }
  static get OWord() { // 16
    return Type.QWord * 2
  }
  static get YWord() { // 32
    return Type.QWord * 2
  }
  static get ZWord() { // 64
    return Type.YWord * 2
  }
  static Array(element: number, count: number) {
    return element * count
  }
  static Data(length: number) {
    return length
  }
}