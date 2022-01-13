import path from 'path';
import fs from 'fs-extra';

export const resetProxyCap = async (): Promise<void> => {
  const config = await fs.readFile(path.join(__dirname, '../utils/machine.prs'));
  await fs.writeFile('C:/ProgramData/ProxyCap/machine.prs', config);
};
