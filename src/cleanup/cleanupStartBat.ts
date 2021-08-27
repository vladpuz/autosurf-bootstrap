import path from 'path';
import fs from 'fs-extra';

export const cleanupStartBat = async (): Promise<void> => {
  await fs.remove(path.join(__dirname, '../../start.bat'));
};
