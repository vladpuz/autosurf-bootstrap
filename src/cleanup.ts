import isAdmin from 'is-admin';
import chalk from 'chalk';
import { cleanupSurfers } from './cleanup/cleanupSurfers';
import { cleanupSandboxie } from './cleanup/cleanupSandboxie';
import { cleanupProxyCap } from './cleanup/cleanupProxyCap';
import { cleanupStartBat } from './cleanup/cleanupStartBat';
import { cleanupAutoStart } from './cleanup/cleanupAutoStart';
import { config } from '../config';

const cleanup = async () => {
  const { autoStart, surfersOrder } = config;

  try {
    await cleanupSurfers(surfersOrder);
    console.log(`Удаление автосерфингов - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Удаление автосерфингов - ${chalk.red('ошибка')}`, err);
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

  if (autoStart) {
    try {
      await cleanupAutoStart();
      console.log(`Удаление автозапуска - ${chalk.green('успешно')}`);
    } catch (err) {
      console.log(`Удаление автозапуска - ${chalk.red('ошибка')}`, err);
    }
  }
};

isAdmin()
  .then((admin) => {
    if (!admin) {
      console.log(chalk.bgRed('Запустите консоль от имени администратора'));
      return;
    }

    cleanup()
      .then(() => {
        console.log();
        console.log(chalk.bgGreen('Очистка произведена'));
      })
      .catch(() => {
        console.log();
        console.log(chalk.bgRed('Произошла непредвиденная ошибка'));
      });
  })
  .catch(() => {
    console.log(chalk.bgRed('Ошибка проверки прав администратора'));
  });
