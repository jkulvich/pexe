// @flow

import BasePluginError from './BasePlugin'

/** Если был вызван не переопределённый метод получения информации о плагине */
export default class PluginInfoNotImplementedError extends BasePluginError {
  name = 'PluginInfoNotImplementedError'
}