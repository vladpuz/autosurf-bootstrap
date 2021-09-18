import os from 'os';
import fs from 'fs-extra';

export const cleanupAutoStart = async (): Promise<void> => {
  const { username } = os.userInfo();
  await fs.remove(`C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/Autosurf.lnk`);
};
