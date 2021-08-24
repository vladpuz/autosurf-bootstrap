import path from 'path';
import fs from 'fs-extra';
import colors from 'colors';
import { parseProxies } from './parseProxies';

export const createSandboxieConfig = async (): Promise<void> => {
  const proxiesList = parseProxies();

  let config = `
[GlobalSettings]

FileRootPath=\\??\\%SystemDrive%\\Sandbox\\%USER%\\%SANDBOX%
SeparateUserFolders=y
KeyRootPath=\\REGISTRY\\USER\\Sandbox_%USER%_%SANDBOX%
IpcRootPath=\\Sandbox\\%USER%\\%SANDBOX%\\Session_%SESSION%
NetworkEnableWFP=n
EditAdminOnly=n
ForceDisableAdminOnly=n
ForgetPassword=n
Template=WindowsRasMan
Template=WindowsLive
Template=RpcPortBindings
Template=ProxyCap
Template=OfficeLicensing

[UserSettings_25C603C7]

SbieCtrl_AutoStartAgent=SandMan.exe
SbieCtrl_EnableAutoStart=y

[DefaultBox]

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
`;

  proxiesList.forEach((proxy, i) => {
    const webisidaPath = path.join(__dirname, `../../webisidas/webisida_${i + 1}`);
    config += `
[webisida_${i + 1}]

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
ForceFolder=${webisidaPath}
`;
  });

  try {
    await fs.writeFile('C:/Windows/Sandboxie.ini', config);
    console.log(`Настройка Sandboxie - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка Sandboxie - ${colors.red('ошибка')}`, err);
  }
};
