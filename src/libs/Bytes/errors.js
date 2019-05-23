/** Базовый класс ошибки модуля */
export class BytesError extends Error {
  name = 'BytesError'
}

/** Происходит если число не байт, т.е. не лежит в диапазоне [0-255] */
export class BytesNotByteError extends BytesError {
  name = 'BytesNotByteError'
}

/** Происходит если число не hex строка содержащая одно число */
export class BytesNotHexByteError extends BytesError {
  name = 'BytesNotHexByteError'
}

/** Происходит когда строка не является массивом байт */
export class BytesNotHexStringError extends BytesError {
  name = 'BytesNotHexStringError'
}

/** Происходит когда число не является целым позитивным */
export class BytesNotPosIntError extends BytesError {
  name = 'BytesNotPosIntError'
}
