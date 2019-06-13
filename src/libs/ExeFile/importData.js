// @flow

export type ImportData = {
  name: string,
  isBound: boolean,
  funcs: Array<ImportDataFunc>
}

export type ImportDataFunc = {
  num: number,
  name: string,
}