// @flow

export type ExportData = {
  name: string,
  funcs: Array<ExportDataFunc>
}

export type ExportDataFunc = {
  num: number,
  name: string,
}