import chalk from 'chalk';
import { copySurfers } from './bootstrap/copySurfers';
import { configureSandboxie } from './bootstrap/configureSandboxie';
import { configureProxyCap } from './bootstrap/configureProxyCap';
import { createStartBat } from './bootstrap/createStartBat';
import { createAutoStart } from './bootstrap/createAutoStart';
import { parseProxies } from './utils/parseProxies';
import { scanSurfers } from './utils/scanSurfers';
import { config } from '../config';

const bootstrap = async () => {
  const { autoStart, systemStartTimeout, surferStartTimeout } = config;
  const proxies = await parseProxies();
  const surfers = await scanSurfers();

  try {
    await copySurfers(proxies, surfers);
    console.log(`Копирование автосерфингов - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Копирование автосерфингов - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await configureSandboxie(proxies, surfers);
    console.log(`Настройка Sandboxie - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка Sandboxie - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await configureProxyCap(proxies, surfers);
    console.log(`Настройка ProxyCap - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка ProxyCap - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  try {
    await createStartBat(proxies, surfers, {
      autoStart,
      systemStartTimeout,
      surferStartTimeout,
    });
    console.log(`Создание start.bat - ${chalk.green('успешно')}`);
  } catch (err) {
    console.log(`Создание start.bat - ${chalk.red('ошибка')}`, err);
    throw err;
  }

  if (autoStart) {
    try {
      createAutoStart();
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
