import path from 'path';
import fs from 'fs-extra';
import { ProxiesType } from '../types/ProxiesType';
import { SurfersType } from '../types/SurfersType';

export const bootstrapStartBat = async (
  proxies: ProxiesType,
  surfers: SurfersType,
  config: {
    autoStart: boolean,
    systemStartTimeout: number,
    surferStartTimeout: number,
  },
): Promise<void> => {
  const { autoStart, systemStartTimeout, surferStartTimeout } = config;
  let launching = '';

  surfers.forEach((surfer) => {
    let originalPath = '';
    let copyPath = '';

    switch (surfer) {
      case 'webisida':
        originalPath = `${path.join(__dirname, '../../surfers/webisida/copy/')} Webisida.Browser.exe`;
        copyPath = `${path.join(__dirname, '../../surfers/webisida/copy_%%i')} Webisida.Browser.exe`;
        break;
      case 'simple':
        originalPath = `${path.join(__dirname, '../../surfers/simple/copy')} SimpleSurfing.Client.exe`;
        copyPath = `${path.join(__dirname, '../../surfers/simple/copy_%%i')} SimpleSurfing.Client.exe`;
        break;
      case 'vipip':
        originalPath = `${path.join(__dirname, '../../surfers/vipip/copy')} VipIpClnt.exe`;
        copyPath = `${path.join(__dirname, '../../surfers/vipip/copy_%%i')} VipIpClnt.exe`;
        break;
      case 'waspace':
        originalPath = `${path.join(__dirname, '../../surfers/waspace/copy')} wahiver64.exe`;
        copyPath = `${path.join(__dirname, '../../surfers/waspace/copy_%%i')} wahiver64.exe`;
        break;
      case 'jetswap':
        originalPath = `${path.join(__dirname, '../../surfers/jetswap/copy')} safesurf.exe`;
        copyPath = `${path.join(__dirname, '../../surfers/jetswap/copy_%%i')} safesurf.exe`;
        break;
      default:
        return;
    }

    launching += `
echo Launch ${surfer}
start /d ${originalPath}
timeout ${surferStartTimeout}
`;

    if (proxies[surfer].length) {
      launching += `
for /l %%i in (1, 1, ${proxies[surfer].length}) do (
  echo Launch ${surfer}_%%i
  start /d ${copyPath}
  timeout ${surferStartTimeout}
)
`;
    }
  });

  const delay = (autoStart && systemStartTimeout) ? `
echo Waiting for the system to be ready
timeout ${systemStartTimeout}` : '';

  await fs.writeFile(path.join(__dirname, '../../start.bat'), `@echo off
${delay}
${launching}
exit
`);
};
