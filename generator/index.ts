import { existsSync, mkdirSync, read, readFileSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import type { Plugin } from 'vite'
import {  templateVue } from './const'
import { templateAdd } from './model'
import MagicString from 'magic-string';

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
      server.ws.on('generator:react',async (e: GeneratorVueOptions) => {
        const filePath = join(__dirname, `..${sep}src${sep}component${sep}${e.filename}`)
        // 判断目录是否存在
        if (!existsSync(filePath)) {
          mkdirSync(filePath)
        }

        const content = templateVue(e)
        const modal  = templateAdd(e)
        const route = await readFileSync(join(__dirname, `..${sep}src${sep}utils${sep}route.ts`), 'utf-8')
        const s = new MagicString(route);

        const index = route.indexOf('// TODO: add your route here')
        console.log("🚀 ~ server.ws.on ~ index:", index)

        s.appendLeft(index, 
          `  { name: '${e.filename}', path: lazy(() => import('~C/${e.filename}')) },\n`)
        try {
          writeFileSync(join(filePath, `${e.filename}.tsx`), content)
          writeFileSync(join(filePath, 'Add.tsx'), modal)
        writeFileSync(join(__dirname, `..${sep}src${sep}utils${sep}route.ts`), s.toString())
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
