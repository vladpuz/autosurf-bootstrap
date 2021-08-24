import path from 'path';
import fs from 'fs-extra';
import colors from 'colors';
import { parseProxies } from './parseProxies';

export const createWebisidaCopies = async (): Promise<void> => {
  const webisidaPath = path.join(__dirname, '../../webisidas/webisida');
  const webisidaExist = await fs.pathExists(webisidaPath);

  if (!webisidaExist) {
    console.log(`Копирование Webisida - ${colors.red('папка отсутствует')}`);
    return;
  }

  const proxiesList = parseProxies();
  const files = await fs.readdir(path.join(__dirname, '../../webisidas'));

  files.forEach((file, i) => {
    if (file !== 'webisida') {
      fs.removeSync(`${webisidaPath}_${i + 1}`);
    }
  });

  const copyList = proxiesList.map((proxy, i) => {
    return fs.copy(webisidaPath, `${webisidaPath}_${i + 1}`, { recursive: true, overwrite: true });
  });

  try {
    await Promise.all(copyList);
    console.log(`Копирование Webisida - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Копирование Webisida - ${colors.red('ошибка')}`, err);
  }
};
