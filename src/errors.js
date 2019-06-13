/** Общая ошибка */
export class PexeError extends Error {
  name = 'PexeError'
}

/** При неудачной попытке конвертации адреса в памяти к смещению */
export class RvaToRawNullError extends PexeError {
  name = 'RvaToRawNullError'
}