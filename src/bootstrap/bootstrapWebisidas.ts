import path from 'path';
import fs from 'fs-extra';
import { parseProxies } from '../utils/parseProxies';

export const bootstrapWebisidas = async (): Promise<void> => {
  const proxiesList = parseProxies();
  const webisidaPath = path.join(__dirname, '../../webisidas/webisida');

  const copyList = proxiesList.map((proxy, i) => {
    return fs.copy(webisidaPath, `${webisidaPath}_${i + 1}`, { recursive: true, overwrite: true });
  });

  await Promise.all(copyList);
};
