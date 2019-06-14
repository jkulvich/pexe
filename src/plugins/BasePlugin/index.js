// @flow

import type { ExeFile } from '../../libs/ExeFile/struct'
import type { PluginInfo } from './types/PluginInfo'
import PluginInfoNotImplementedError from './errors/PluginInfoNotImplemented'
import PluginMainNotImplementedError from './errors/PluginMainNotImplemented'

/** Базовый класс плагинов */
export default class BasePlugin {
  /** Информация о плагине */
  pluginInfo(): PluginInfo {
    throw new PluginInfoNotImplementedError()
    // return {
    //   version: '0.0.0',
    //   name: 'BasePlugin',
    //   desc: 'Plugin base class',
    //   author: 'Yuri Kulagin (@jkulvich)',
    //   site: 'https://github.com/jkulvich/pexe'
    // }
  }

  /** Метод обработки */
  main(exe: ExeFile): {} {
    throw new PluginMainNotImplementedError()
  }
}