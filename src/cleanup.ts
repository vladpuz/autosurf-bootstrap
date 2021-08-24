import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import colors from 'colors';

const cleanup = async () => {
  const { username } = os.userInfo();

  try {
    await Promise.all([
      fs.remove(path.join(__dirname, '../webisidas')),
      fs.remove(`C:/Users/${username}/AppData/Local/Webisida`),
    ]);
    console.log(`Удаление копий Webisida - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Удаление копий Webisida - ${colors.red('ошибка')}`, err);
  }

  try {
    await fs.writeFile('C:/Windows/Sandboxie.ini', `
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
`);
    console.log(`Очистка Sandboxie - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Очистка Sandboxie - ${colors.red('ошибка')}`, err);
  }

  try {
    await fs.remove('C:/ProgramData/ProxyCap/machine.prs');
    console.log(`Очистка ProxyCap - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Очистка ProxyCap - ${colors.red('ошибка')}`, err);
  }

  try {
    await fs.remove(path.join(__dirname, '../start.bat'));
    console.log(`Удаление start.bat - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Удаление start.bat - ${colors.red('ошибка')}`, err);
  }

  try {
    await fs.remove(`C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/webisidas.lnk`);
    console.log(`Очистка автозагрузки - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Очистка автозагрузки - ${colors.red('ошибка')}`, err);
  }
};

cleanup()
  .then(() => {
    console.log(colors.green('\nОчистка выполнена успешно'));
  })
  .catch(() => {
    console.log(colors.red('\nПроизошла непредвиденная ошибка'));
  });
