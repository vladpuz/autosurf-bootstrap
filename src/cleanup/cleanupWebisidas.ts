import path from 'path';
import fs from 'fs-extra';
import { parseProxies } from '../utils/parseProxies';

export const cleanupWebisidas = async (): Promise<void> => {
  const proxiesList = parseProxies();

  await Promise.all(proxiesList.map((proxy, i) => {
    return fs.remove(path.join(__dirname, `../../webisidas/webisida_${i + 1}`));
  }));
};
