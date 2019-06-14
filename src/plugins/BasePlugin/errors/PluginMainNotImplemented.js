// @flow

import BasePluginError from './BasePlugin'

/** Если был вызван не переопределённый метод обработки */
export default class PluginMainNotImplementedError extends BasePluginError {
  name = 'PluginMainNotImplementedError'
}