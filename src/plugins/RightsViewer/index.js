// @flow

import BasePlugin from '../BasePlugin'
import type { ExeFile } from '../../libs/ExeFile/struct'
import type { PluginInfo } from '../BasePlugin/types/PluginInfo'

/**
 * Позволяет получить информацию по доступам приложения
 * на основе импортируемых методов
 */
export default class RightsViewer extends BasePlugin {
  pluginInfo(): PluginInfo {
    return {
      version: '0.9.0',
      name: 'RightsViewer',
      desc: 'Позволяет просматривать доступные разрешения на основе импортируемых методов',
      author: 'Yuri Kulagin (@jkulvich)',
      site: 'https://github.com/jkulvich/pexe'
    }
  }

  main(exe: ExeFile): {} {
    return {}
  }
}