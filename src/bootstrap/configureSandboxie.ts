import path from 'path'
import fs from 'fs-extra'
import { ProxiesType } from '../types/ProxiesType'
import { SurfersType } from '../types/SurfersType'

export const configureSandboxie = async (
  proxies: ProxiesType,
  surfers: SurfersType
): Promise<void> => {
  let config = await fs.readFile(path.join(__dirname, '../utils/Sandboxie.ini'), 'utf-16le')

  let maxCopiesName: SurfersType[number] = surfers[0]
  let maxCopiesLength = 0

  Object.entries(proxies).forEach(([key, value]) => {
    if (value.length > maxCopiesLength) {
      maxCopiesName = key as SurfersType[number]
      maxCopiesLength = value.length
    }
  })

  proxies[maxCopiesName].forEach((proxy, i) => {
    let forceFolders = ''

    surfers.forEach((surfer) => {
      const folder = path.join(__dirname, `../../surfers/${surfer}/copy_${i + 1}`)
      forceFolders += `ForceFolder=${folder}\n`
    })

    config += `
[sandbox_${i + 1}]
Enabled=y
AutoRecover=n
BlockNetworkFiles=y
RecoverFolder=%{374DE290-123F-4565-9164-39C4925E467B}%
RecoverFolder=%Personal%
RecoverFolder=%Desktop%
BorderColor=#00FFFF,ttl
Template=OpenBluetooth
Template=SkipHook
Template=FileCopy
Template=qWave
Template=BlockPorts
Template=LingerPrograms
Template=AutoRecoverIgnore
ConfigLevel=9
UsePrivacyMode=n
${forceFolders}`
  })

  await fs.writeFile('C:/Windows/Sandboxie.ini', config, { encoding: 'utf-16le' })
}
