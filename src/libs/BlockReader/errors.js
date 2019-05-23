/** Base error */
export class BlockReaderError extends Error {
  name = 'BlockReaderError'
}

/** If FileReader is not set */
export class BlockReaderEmptyFileReaderError extends BlockReaderError {
  name = 'BlockReaderEmptyFileReaderError'
}
