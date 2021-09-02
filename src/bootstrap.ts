import chalk from 'chalk';
import { bootstrapSurfers } from './bootstrap/bootstrapSurfers';
import { bootstrapSandboxie } from './bootstrap/bootstrapSandboxie';
import { bootstrapProxyCap } from './bootstrap/bootstrapProxyCap';
import { bootstrapStartBat } from './bootstrap/bootstrapStartBat';
import { bootstrapAutoStart } from './bootstrap/bootstrapAutoStart';
import { parseProxies } from './utils/parseProxies';
import { scanSurfers } from './utils/scanSurfers';
import { config } from '../settings/config';

const bootstrap = async () => {
  const proxies = parseProxies();
  const surfers = await scanSurfers();
  const { autoStart, systemStartTimeout, surferStartTimeout } = config;

  try {
    await bootstrapSurfers(proxies, surfers);
    console.log(`Копирование автосерфингов - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Копирование автосерфингов - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await bootstrapSandboxie(proxies, surfers);
    console.log(`Настройка Sandboxie - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка Sandboxie - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await bootstrapProxyCap(proxies, surfers);
    console.log(`Настройка ProxyCap - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка ProxyCap - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await bootstrapStartBat(proxies, surfers, { autoStart, systemStartTimeout, surferStartTimeout });
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
