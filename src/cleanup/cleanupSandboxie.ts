import path from 'path';
import fs from 'fs-extra';

export const cleanupSandboxie = async (): Promise<void> => {
  const config = await fs.readFile(path.join(__dirname, '../utils/Sandboxie.ini'), 'utf-16le');
  await fs.writeFile('C:/Windows/Sandboxie.ini', config, { encoding: 'utf-16le' });
  fs.removeSync('C:/Sandbox');
};
