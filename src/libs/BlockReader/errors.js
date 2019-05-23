/** Базовый класс ошибки модуля */
export class BlockReaderError extends Error {
  name = 'BlockReaderError'
}

/** Если не установлен инструмент чтения файла */
export class BlockReaderEmptyFileReaderError extends BlockReaderError {
  name = 'BlockReaderEmptyFileReaderError'
}
