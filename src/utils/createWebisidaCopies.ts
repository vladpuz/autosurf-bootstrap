import path from 'path';
import fs from 'fs-extra';
import colors from 'colors';
import { parseProxies } from './parseProxies';

export const createWebisidaCopies = async (): Promise<void> => {
  const proxiesList = parseProxies();

  const promiseList = proxiesList.map((proxy, i) => {
    const webisidaPath = path.join(__dirname, '../../webisidas/webisida');
    return fs.copy(webisidaPath, `${webisidaPath}_${i + 1}`, { recursive: true, overwrite: true });
  });

  try {
    await Promise.all(promiseList);
    console.log(`Копирование Webisida - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Копирование Webisida - ${colors.red('ошибка')}`, err);
  }
};
