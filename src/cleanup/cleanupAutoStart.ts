import fs from 'fs-extra';
import os from 'os';

export const cleanupAutoStart = async (): Promise<void> => {
  const { username } = os.userInfo();
  await fs.remove(`C:/Users/${username}/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/autosurf.lnk`);
};
