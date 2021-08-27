import path from 'path';
import os from 'os';
import windowsShortcuts from 'windows-shortcuts';

export const bootstrapAutoStart = (): void => {
  const { username } = os.userInfo();
  const startBatPath = path.join(__dirname, '../../start.bat');

  windowsShortcuts.create(
    `C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/autosurf.lnk`,
    startBatPath,
  );
};
