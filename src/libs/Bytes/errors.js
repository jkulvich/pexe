/** Base error */
export class BytesError extends Error {
  name = 'BytesError'
}

/** If present number isn't byte */
export class BytesNotByteError extends BytesError {
  name = 'BytesNotByteError'
}

/** If present string isn't one hex byte (2 chars) */
export class BytesNotHexByteError extends BytesError {
  name = 'BytesNotHexByteError'
}

/** If present array isn't array of hex numbers */
export class BytesNotHexStringError extends BytesError {
  name = 'BytesNotHexStringError'
}

/** If present number isn't positive integer */
export class BytesNotPosIntError extends BytesError {
  name = 'BytesNotPosIntError'
}
