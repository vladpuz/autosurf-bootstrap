import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import windowsShortcuts from 'windows-shortcuts';
import { config } from '../../settings/config';
import { parseProxies } from '../utils/parseProxies';

export const bootstrapStartBat = async (): Promise<void> => {
  const proxiesList = parseProxies();
  const { autoStart, timeouts } = config;
  const { username } = os.userInfo();
  const startBatPath = path.join(__dirname, '../../start.bat');

  await fs.writeFile(startBatPath, `
@echo off

${autoStart ? `
echo Waiting for the system to be ready
timeout ${timeouts.systemStart}
` : ''}

echo Launch Webisida
start ${path.join(__dirname, '../../webisidas/webisida/Webisida.Browser.exe')}
timeout ${timeouts.autosurfStart}

for /l %%i in (1, 1, ${proxiesList.length}) do (
  echo Launch Webisida_%%i
  start ${path.join(__dirname, '../../webisidas/webisida_%%i/Webisida.Browser.exe')}
  timeout ${timeouts.autosurfStart}
)

exit
`);

  if (autoStart) {
    windowsShortcuts.create(
      `C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/autosurf.lnk`,
      startBatPath,
    );
  }
};
