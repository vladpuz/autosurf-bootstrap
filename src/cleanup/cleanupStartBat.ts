import path from 'path';
import fs from 'fs-extra';
import os from 'os';

export const cleanupStartBat = async (): Promise<void> => {
  const { username } = os.userInfo();

  await Promise.all([
    fs.remove(path.join(__dirname, '../start.bat')),
    fs.remove(`C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/autosurf.lnk`),
  ]);
};
