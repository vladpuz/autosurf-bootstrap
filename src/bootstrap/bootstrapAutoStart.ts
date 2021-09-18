import path from 'path';
import os from 'os';
import windowsShortcuts from 'windows-shortcuts';

export const bootstrapAutoStart = (): void => {
  const { username } = os.userInfo();

  windowsShortcuts.create(
    `C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/Autosurf.lnk`,
    path.join(__dirname, '../../start.bat'),
  );
};
