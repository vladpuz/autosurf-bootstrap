import path from 'path';
import fs from 'fs-extra';

export const cleanupSandboxie = async (): Promise<void> => {
  const config = await fs.readFile(path.join(__dirname, '../utils/Sandboxie.ini'));
  await fs.writeFile('C:/Windows/Sandboxie.ini', config);
  fs.removeSync('C:/Sandbox');
};
