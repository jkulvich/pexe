/** Base error */
export class FileReaderError extends Error {
  name = 'FileReaderError'
}

/** If end of file and can't read next */
export class FileReaderEOFError extends FileReaderError {
  name = 'FileReaderEOFError'
}
