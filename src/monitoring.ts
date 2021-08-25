import chalk from 'chalk';
import { cpu, mem } from 'node-os-utils';
import { config } from '../settings/config';

const { monitoring } = config;

const loadInfo = {
  cpu: [] as number[],
  ram: [] as number[],
};

let ending = false;
let firstInterval = true;

const getLoadInfo = async () => {
  const time = new Date().toLocaleTimeString();

  try {
    const cpuPercentage = await cpu.usage(firstInterval ? 0 : monitoring.interval * 1000);
    const { usedMemMb } = await mem.used();

    loadInfo.cpu.push(cpuPercentage);
    loadInfo.ram.push(usedMemMb);
    firstInterval = false;

    console.log(`${time} Загрузка процессора - ${chalk.cyan(`${cpuPercentage}%`)}`);
    console.log(`${time} Загрузка памяти - ${chalk.cyan(`${(usedMemMb / 1024).toFixed(2)}Gb`)}`);
    console.log();
  } catch (err) {
    console.log(`${time} Сбор данных - ${chalk.red('ошибка')}`, err);
    console.log();
  }

  if (ending) {
    const cpuAverageLoad = loadInfo.cpu.reduce((sum, load) => sum + load, 0) / loadInfo.cpu.length;
    const ramAverageLoad = loadInfo.ram.reduce((sum, load) => sum + load, 0) / loadInfo.ram.length;

    console.log(`${time} ${chalk.bgGreen('Мониторинг окончен')}`);
    console.log(`Средняя загрузка процессора - ${chalk.cyan(`${cpuAverageLoad.toFixed(2)}%`)}`);
    console.log(`Средняя загрузка памяти - ${chalk.cyan(`${(ramAverageLoad / 1024).toFixed(2)}Gb`)}`);
    return;
  }

  await getLoadInfo();
};

getLoadInfo()
  .catch((err) => {
    console.log(chalk.bgRed('Ошибка запуска мониторинга'), err);
  });

setTimeout(() => {
  ending = true;
}, monitoring.ending * 1000);
