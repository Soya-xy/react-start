import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import type { Plugin } from 'vite'
import {  templateVue } from './const'
import { templateAdd } from './model'

export interface Fields {
  type: string
  name: string
  value: string
  search?: number
}

export interface GeneratorVueOptions {
  menuname: string
  filename: string
  path: string
  listApi: string
  curdApi: string
  field: Fields[]
}

export default function generator(): Plugin {
  return {
    name: 'generator-react',
    configureServer(server) {
      server.ws.on('generator:react', (e: GeneratorVueOptions) => {
        console.log("🚀 ~ server.ws.on ~ e:", e)
        const filePath = join(__dirname, `..${sep}src${sep}component${sep}${e.filename}`)
        // 判断目录是否存在
        if (!existsSync(filePath)) {
          mkdirSync(filePath)
        }

        const content = templateVue(e)
        const modal  = templateAdd(e)
        try {
          writeFileSync(join(filePath, `${e.filename}.tsx`), content)
          writeFileSync(join(filePath, 'Add.tsx'), modal)
          server.ws.send('generator:over', { success: true })
        }
        catch (error) {
          console.error(error)
          server.ws.send('generator:over', { error })
        }
      })
    },
  }
}
