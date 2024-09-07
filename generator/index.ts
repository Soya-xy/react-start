import { existsSync, mkdirSync, read, readFileSync, writeFileSync } from 'node:fs'
import { join, sep } from 'node:path'
import type { Plugin } from 'vite'
import { templateVue } from './const'
import { templateAdd } from './model'
import MagicString from 'magic-string';
import Global from "../src/class/global";

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
  fetchToken: string
  parent: any
  parentID: string | number
}
// 查找
const findMenu = (data: any, path: string) => {
  for (const item of data) {
    if (item.path === path) {
      console.log("🚀 ~ findMenu ~ item:", item)
      return item
    } else if (item.child) {
      const result = findMenu(item.child, path)
      if (result) return result
    }
  }
  return undefined
}

function fetchData(url: string, method: string, body: any, token: string) {
  return fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify(body)
  }).then((res: any) => res.json())
}

export default function generator(): Plugin {
  return {
    name: 'generator-react',
    configureServer(server) {
      server.ws.on('generator:react', async (e: GeneratorVueOptions) => {
        const filePath = join(__dirname, `..${sep}src${sep}component${sep}${e.filename}`)
        // 判断目录是否存在
        if (!existsSync(filePath)) {
          mkdirSync(filePath)
        }

        const content = templateVue(e)
        const modal = templateAdd(e)
        const route = await readFileSync(join(__dirname, `..${sep}src${sep}utils${sep}route.ts`), 'utf-8')
        const s = new MagicString(route);

        const index = route.indexOf('// TODO: add your route here')

        s.appendLeft(index,
          `  { name: '${e.filename}', path: lazy(() => import('~C/${e.filename}/${e.filename}')) },\n`)
        try {
          writeFileSync(join(filePath, `${e.filename}.tsx`), content)
          writeFileSync(join(filePath, 'Add.tsx'), modal)
          writeFileSync(join(__dirname, `..${sep}src${sep}utils${sep}route.ts`), s.toString())

          fetchData(Global.httpUrl + 'menu/menuList', 'POST', {
            page: 1,
            size: 9999,
            orderBy: '',
          }, e.fetchToken).then((res: any) => {
            if (res.code === 1) {
              const item: any = findMenu(res.data.datas, e.filename)
              if (!item?.id) {
                fetchData(Global.httpUrl + 'menu/addMenu', 'POST', {
                  level: e.parent.length,
                  icon: "icon-jibenguanli",
                  name: e.menuname + '列表',
                  path: e.filename,
                  route: `/admin/${e.listApi}`,
                  sort: 1,
                  display: 1,
                  needLog: 0,
                  pid: e.parentID,
                }, e.fetchToken).then((res2: any) => {
                  if (res2.code === 1) {
                    fetchData(Global.httpUrl + 'menu/menuList', 'POST', {
                      page: 1,
                      size: 9999,
                      orderBy: '',
                    }, e.fetchToken).then((res3: any) => {
                      if (res3.code === 1) {
                        const items: any = findMenu(res3.data.datas, e.filename)
                        console.log("🚀 ~ server.ws.on ~ item:", items)
                        if (items) {
                          const apiMenu = [
                            { name: `添加${e.menuname}`, route: `/admin/${e.curdApi.replace("%", "add")}` },
                            { name: `编辑${e.menuname}`, route: `/admin/${e.curdApi.replace("%", "edit")}` },
                            { name: `删除${e.menuname}`, route: `/admin/${e.curdApi.replace("%", "del")}` },
                          ];

                          apiMenu.forEach((menu) => {
                            fetch(Global.httpUrl + 'menu/addMenu', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'token': e.fetchToken
                              },
                              body: JSON.stringify({
                                level: e.parent.length,
                                icon: "icon-jibenguanli",
                                name: menu.name,
                                path: "",
                                route: menu.route,
                                sort: 1,
                                display: 0,
                                needLog: 1,
                                pid: items.id,
                              })
                            }).then((res: any) => res.json()).then((res: any) => {
                              if (res.code === 1) {
                                console.log('添加菜单成功')
                              }
                            })
                          });

                        }
                      }
                    })
                  }
                });
              }
            }
          })

          server.ws.send('generator:over', { success: true, data: e })
        }
        catch (error) {
          console.error(error)
          server.ws.send('generator:over', { error })
        }
      })
    },
  }
}
