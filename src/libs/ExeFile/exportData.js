// @flow

export type ExportData = {
  name: string,
  funcs: Array<ExportDataFunc>,
  date: Date,
}

export type ExportDataFunc = {
  name: string,
  ordinal: number,
  offset: number,
}