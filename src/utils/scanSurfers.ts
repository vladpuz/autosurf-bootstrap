import path from 'path';
import fs from 'fs-extra';
import { config } from '../../settings/config';

export const scanSurfers = async (): Promise<typeof config.surfersOrder> => {
  const { surfersOrder } = config;

  const [webisida, simple] = await Promise.all([
    fs.pathExists(path.join(__dirname, '../../surfers/webisida/copy')),
    fs.pathExists(path.join(__dirname, '../../surfers/simple/copy')),
  ]);

  const surfers = {
    webisida,
    simple,
  };

  return surfersOrder.filter((surfer) => surfers[surfer]);
};
