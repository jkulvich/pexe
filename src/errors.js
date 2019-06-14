/** Общая ошибка */
export class PexeError extends Error {
  name = 'PexeError'
}

/** При неудачной попытке конвертации адреса в памяти к смещению */
export class PexeRvaToRawNullError extends PexeError {
  name = 'PexeRvaToRawNullError'
}

/** При невозможности получить RWA функции на которую указывает ординал */
export class PexeIncorrectOrdinalError extends PexeError {
  name = "PexeIncorrectOrdinalError"
}