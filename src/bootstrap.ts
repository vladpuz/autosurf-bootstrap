import chalk from 'chalk';
import { bootstrapWebisidas } from './bootstrap/bootstrapWebisidas';
import { bootstrapSandboxie } from './bootstrap/bootstrapSandboxie';
import { bootstrapProxyCap } from './bootstrap/bootstrapProxyCap';
import { bootstrapStartBat } from './bootstrap/bootstrapStartBat';
import { bootstrapAutoStart } from './bootstrap/bootstrapAutoStart';
import { config } from '../settings/config';

const bootstrap = async () => {
  const { autoStart } = config;

  try {
    await bootstrapWebisidas();
    console.log(`Копирование Webisida - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Копирование Webisida - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await bootstrapSandboxie();
    console.log(`Настройка Sandboxie - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка Sandboxie - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await bootstrapProxyCap();
    console.log(`Настройка ProxyCap - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка ProxyCap - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await bootstrapStartBat();
    console.log(`Создание start.bat - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Создание start.bat - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  if (autoStart) {
    try {
      bootstrapAutoStart();
      console.log(`Создание автозапуска - ${chalk.green('успешно')}`);
    } catch (err) {
      console.log(`Создание автозапуска - ${chalk.red('ошибка')}`, err);
      throw err;
    }
  }
};

bootstrap()
  .then(() => {
    console.log();
    console.log(chalk.bgGreen('Все операции выполнены успешно'));
  })
  .catch(() => {
    console.log();
    console.log(chalk.bgRed('На одном из этапов произошла ошибка'));
  });
