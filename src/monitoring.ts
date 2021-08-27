import chalk from 'chalk';
import { cpu, mem } from 'node-os-utils';
import { config } from '../settings/config';

const { timeouts } = config;

const loadInfo = {
  cpu: [] as number[],
  ram: [] as number[],
};

const getLoadInfo = async () => {
  try {
    const usedCpuPercent = await cpu.usage(0);
    const memInfo = await mem.used();
    const userMemGb = +(memInfo.usedMemMb / 1024).toFixed(2);

    loadInfo.cpu.push(usedCpuPercent);
    loadInfo.ram.push(userMemGb);

    const cpuAverageLoad = (loadInfo.cpu.reduce((sum, load) => sum + load, 0) / loadInfo.cpu.length).toFixed(2);
    const ramAverageLoad = (loadInfo.ram.reduce((sum, load) => sum + load, 0) / loadInfo.ram.length).toFixed(2);

    const cpuMaxLoad = (loadInfo.cpu.reduce((max, load) => (load > max ? load : max), loadInfo.cpu[0])).toFixed(2);
    const ramMaxLoad = (loadInfo.ram.reduce((max, load) => (load > max ? load : max), loadInfo.ram[0])).toFixed(2);

    const cpuDesc = [...loadInfo.cpu].sort((a, b) => b - a);
    const cpuDescPercent = cpuDesc.slice(0, Math.ceil(cpuDesc.length / 100));
    const cpuMaxPercentLoad = (cpuDescPercent.reduce((sum, load) => sum + load, 0) / cpuDescPercent.length).toFixed(2);

    const ramDesc = [...loadInfo.ram].sort((a, b) => b - a);
    const ramDescPercent = ramDesc.slice(0, Math.ceil(ramDesc.length / 100));
    const ramMaxPercentLoad = (ramDescPercent.reduce((sum, load) => sum + load, 0) / ramDescPercent.length).toFixed(2);

    const cpuMinLoad = (loadInfo.cpu.reduce((min, load) => (load < min ? load : min), loadInfo.cpu[0])).toFixed(2);
    const ramMinLoad = (loadInfo.ram.reduce((min, load) => (load < min ? load : min), loadInfo.ram[0])).toFixed(2);

    const time = new Date().toLocaleTimeString();

    console.log(chalk.bgGreen(`${time} Получены данные`));
    console.log(`Нагрузка процессора - ${chalk.cyan(`${usedCpuPercent}%`)}`);
    console.log(`Нагрузка памяти - ${chalk.cyan(`${userMemGb}gb`)}`);
    console.log();
    console.log(`Максимальная нагрузка процессора - ${chalk.cyan(`${cpuMaxLoad}%`)}`);
    console.log(`Максимальная нагрузка памяти - ${chalk.cyan(`${ramMaxLoad}gb`)}`);
    console.log();
    console.log(`Максимально нагруженный 1% процессора - ${chalk.cyan(`${cpuMaxPercentLoad}%`)}`);
    console.log(`Максимально нагруженный 1% памяти - ${chalk.cyan(`${ramMaxPercentLoad}gb`)}`);
    console.log();
    console.log(`Минимальная нагрузка процессора - ${chalk.cyan(`${cpuMinLoad}%`)}`);
    console.log(`Минимальная нагрузка памяти - ${chalk.cyan(`${ramMinLoad}gb`)}`);
    console.log();
    console.log(`Средняя нагрузка процессора - ${chalk.cyan(`${cpuAverageLoad}%`)}`);
    console.log(`Средняя нагрузка памяти - ${chalk.cyan(`${ramAverageLoad}gb`)}`);
    console.log();
  } catch (err) {
    const time = new Date().toLocaleTimeString();
    console.log(`${time} Сбор данных - ${chalk.red('ошибка')}`, err);
    console.log();
  }
};

getLoadInfo()
  .then(() => {
    setInterval(() => {
      getLoadInfo()
        .catch((err) => {
          console.log(chalk.bgRed('Ошибка запуска мониторинга'), err);
        });
    }, timeouts.monitoring * 1000);
  })
  .catch((err) => {
    console.log(chalk.bgRed('Ошибка запуска мониторинга'), err);
  });
