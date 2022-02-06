import path from 'path'
import fs from 'fs-extra'
import { ProxiesType } from '../types/ProxiesType'
import { SurfersType } from '../types/SurfersType'

export const createStartBat = async (
  proxies: ProxiesType,
  surfers: SurfersType,
  config: {
    autoStart: boolean
    systemStartTimeout: number
    surferStartTimeout: number
  }
): Promise<void> => {
  const { autoStart, systemStartTimeout, surferStartTimeout } = config
  let launching = ''

  surfers.forEach((surfer) => {
    let originalPath = ''
    let copyPath = ''

    switch (surfer) {
      case 'webisida':
        originalPath = `"${path.join(__dirname, '../../surfers/webisida/copy/')}" Webisida.Browser.exe`
        copyPath = `"${path.join(__dirname, '../../surfers/webisida/copy_%%i')}" Webisida.Browser.exe`
        break
      case 'simple':
        originalPath = `"${path.join(__dirname, '../../surfers/simple/copy')}" SimpleSurfing.Client.exe`
        copyPath = `"${path.join(__dirname, '../../surfers/simple/copy_%%i')}" SimpleSurfing.Client.exe`
        break
      default:
        return
    }

    launching += `
echo Launch ${surfer}
start /d ${originalPath}
timeout ${surferStartTimeout}
`

    if (proxies[surfer].length > 0) {
      launching += `
for /l %%i in (1, 1, ${proxies[surfer].length}) do (
  echo Launch ${surfer}_%%i
  start /d ${copyPath}
  timeout ${surferStartTimeout}
)
`
    }
  })

  const delay = (autoStart && (systemStartTimeout !== 0))
    ? `
echo Waiting for the system to be ready
timeout ${systemStartTimeout}`
    : ''

  await fs.writeFile(path.join(__dirname, '../../start.bat'), `@echo off
${delay}
${launching}
exit
`)
}
