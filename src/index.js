// @flow

import BlockReader from './libs/BlockReader'
import FileReader from './libs/FileReader'
import PexeParser from './parser'
import type { ExeFile } from './libs/ExeFile/struct'
import BasePlugin from './plugins/BasePlugin'
import RightsViewer from './plugins/RightsViewer'

export default class Pexe {
  parser = new PexeParser()
  plugins: Array<BasePlugin> = []

  setFile (bytes: Uint8Array) {
    this.parser.setFile(bytes)
  }

  async fetchFile (url: string) {
    let resp = await window.fetch(url)
    let buff = await resp.arrayBuffer()
    this.setFile(new Uint8Array(buff))
  }

  addPlugin(plugins: BasePlugin | Array<BasePlugin>) {
    if (plugins instanceof Array) {
      this.plugins.push(...plugins)
    } else {
      this.plugins.push(plugins)
    }
  }

  applyPlugins(exe: ExeFile) {
    for (let plugin of this.plugins) {
      let info = plugin.pluginInfo()
      exe.meta.plugins[info.name] = plugin.main(exe)
    }
  }

  parse(): ExeFile {
    this.addPlugin(new RightsViewer())

    let exe = this.parser.parse()
    this.applyPlugins(exe)
    return exe
  }
}