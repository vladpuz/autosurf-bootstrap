import chalk from 'chalk';
import { cleanupWebisidas } from './cleanup/cleanupWebisidas';
import { cleanupSandboxie } from './cleanup/cleanupSandboxie';
import { cleanupProxyCap } from './cleanup/cleanupProxyCap';
import { cleanupStartBat } from './cleanup/cleanupStartBat';

const cleanup = async () => {
  try {
    await cleanupWebisidas();
    console.log(`Удаление копий Webisida - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Удаление копий Webisida - ${chalk.red('ошибка')}`, err);
  }

  try {
    await cleanupSandboxie();
    console.log(`Сброс Sandboxie - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Сброс Sandboxie - ${chalk.red('ошибка')}`, err);
  }

  try {
    await cleanupProxyCap();
    console.log(`Сброс ProxyCap - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Сброс ProxyCap - ${chalk.red('ошибка')}`, err);
  }

  try {
    await cleanupStartBat();
    console.log(`Удаление start.bat - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Удаление start.bat - ${chalk.red('ошибка')}`, err);
  }
};

cleanup()
  .then(() => {
    console.log();
    console.log(chalk.bgGreen('Очистка произведена'));
  })
  .catch(() => {
    console.log();
    console.log(chalk.bgRed('Произошла непредвиденная ошибка'));
  });
