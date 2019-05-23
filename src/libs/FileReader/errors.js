/** Базовый класс ошибки модуля */
export class FileReaderError extends Error {
  name = 'FileReaderError'
}

/** Когда достигнут конец файла и чтение невозможно */
export class FileReaderEOFError extends FileReaderError {
  name = 'FileReaderEOFError'
}
