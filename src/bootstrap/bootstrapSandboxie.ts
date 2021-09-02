import path from 'path';
import fs from 'fs-extra';
import { ProxyType } from '../types/ProxyType';
import { ConfigType } from '../types/ConfigType';

export const bootstrapSandboxie = async (proxies: ProxyType[], surfers: ConfigType['surfersOrder']): Promise<void> => {
  let config = await fs.readFile(path.join(__dirname, '../utils/Sandboxie.ini'), 'utf-16le');

  proxies.forEach((proxy, i) => {
    let forceFolders = '';

    surfers.forEach((surfer) => {
      forceFolders += `ForceFolder=${path.join(__dirname, `../../surfers/${surfer}/copy_${i + 1}`)}\n`;
    });

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
Template=Chrome_Phishing_DirectAccess
Template=Firefox_Phishing_DirectAccess
Template=AutoRecoverIgnore
ConfigLevel=9
${forceFolders}`;
  });

  await fs.writeFile('C:/Windows/Sandboxie.ini', config, { encoding: 'utf-16le' });
};
