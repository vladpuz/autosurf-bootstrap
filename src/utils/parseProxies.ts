import path from 'path'
import fs from 'fs-extra'
import { config } from '../../config'
import { ProxiesType } from '../types/ProxiesType'

export const parseProxies = async (): Promise<ProxiesType> => {
  const { surfersOrder } = config

  const readOperations = surfersOrder.map(async (surfer) => {
    return await fs.readFile(path.join(__dirname, `../../surfers/${surfer}/proxies.txt`), 'utf-8')
  })

  const readData = await Promise.all(readOperations)
  const entries = readData.map((list, i) => {
    const proxyList = list.split('\n').filter((proxy) => proxy).map((proxy) => {
      const split = proxy.split('@')

      if (split.length === 1) {
        const ip = split[0].split(':')[0]
        const port = +split[0].split(':')[1]

        return {
          ip,
          port
        }
      }

      const [login, password] = split[0].split(':')
      const ip = split[1].split(':')[0]
      const port = +split[1].split(':')[1]

      return {
        ip,
        port,
        login,
        password
      }
    })

    return [surfersOrder[i], proxyList]
  })

  return Object.fromEntries(entries) as ProxiesType
}
