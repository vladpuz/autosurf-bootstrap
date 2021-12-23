import isAdmin from 'is-admin';
import chalk from 'chalk';
import { cpu, mem } from 'node-os-utils';
import { config } from '../config';

const { monitoringInterval } = config;

const loadInfo = {
  cpu: {
    all: [] as number[],
    sum: 0,
    max: 0,
    min: 0,
  },
  ram: {
    all: [] as number[],
    sum: 0,
    max: 0,
    min: 0,
  },
};

const getLoadInfo = async () => {
  try {
    const cpuInfo = await cpu.usage(0);
    const memInfo = await mem.used();
    const usedCpuPercent = +cpuInfo.toFixed(2);
    const userMemGb = +(memInfo.usedMemMb / 1024).toFixed(2);

    if (!loadInfo.cpu.all.length) {
      loadInfo.cpu.max = usedCpuPercent;
      loadInfo.cpu.min = usedCpuPercent;
    }

    if (!loadInfo.ram.all.length) {
      loadInfo.ram.max = userMemGb;
      loadInfo.ram.min = userMemGb;
    }

    loadInfo.cpu.all = [...loadInfo.cpu.all, usedCpuPercent].sort((a, b) => b - a);
    loadInfo.ram.all = [...loadInfo.ram.all, userMemGb].sort((a, b) => b - a);

    loadInfo.cpu.sum += usedCpuPercent;
    loadInfo.ram.sum += userMemGb;

    loadInfo.cpu.max = usedCpuPercent > loadInfo.cpu.max ? usedCpuPercent : loadInfo.cpu.max;
    loadInfo.ram.max = userMemGb > loadInfo.ram.max ? userMemGb : loadInfo.ram.max;

    loadInfo.cpu.min = usedCpuPercent < loadInfo.cpu.min ? usedCpuPercent : loadInfo.cpu.min;
    loadInfo.ram.min = userMemGb < loadInfo.ram.min ? userMemGb : loadInfo.ram.min;

    const cpuAverageLoad = (loadInfo.cpu.sum / loadInfo.cpu.all.length).toFixed(2);
    const ramAverageLoad = (loadInfo.ram.sum / loadInfo.ram.all.length).toFixed(2);

    const cpuMinLoad = loadInfo.cpu.min.toFixed(2);
    const ramMinLoad = loadInfo.ram.min.toFixed(2);

    const cpuMaxLoad = loadInfo.cpu.max.toFixed(2);
    const ramMaxLoad = loadInfo.ram.max.toFixed(2);

    const cpuOnePercent = loadInfo.cpu.all.slice(0, Math.ceil(loadInfo.cpu.all.length / 100));
    const cpuMaxPercentLoad = (cpuOnePercent.reduce((sum, load) => sum + load, 0) / cpuOnePercent.length).toFixed(2);

    const ramOnePercent = loadInfo.ram.all.slice(0, Math.ceil(loadInfo.ram.all.length / 100));
    const ramMaxPercentLoad = (ramOnePercent.reduce((sum, load) => sum + load, 0) / ramOnePercent.length).toFixed(2);

    const time = new Date().toLocaleTimeString();

    console.log(chalk.bgGreen(`${time} Получены данные`));
    console.log(`Нагрузка процессора - ${chalk.cyan(`${usedCpuPercent}%`)}`);
    console.log(`Нагрузка памяти - ${chalk.cyan(`${userMemGb}gb`)}`);
    console.log();
    console.log(`Минимальная нагрузка процессора - ${chalk.cyan(`${cpuMinLoad}%`)}`);
    console.log(`Минимальная нагрузка памяти - ${chalk.cyan(`${ramMinLoad}gb`)}`);
    console.log();
    console.log(`Максимальная нагрузка процессора - ${chalk.cyan(`${cpuMaxLoad}%`)}`);
    console.log(`Максимальная нагрузка памяти - ${chalk.cyan(`${ramMaxLoad}gb`)}`);
    console.log();
    console.log(`Максимально нагруженный 1% процессора - ${chalk.cyan(`${cpuMaxPercentLoad}%`)}`);
    console.log(`Максимально нагруженный 1% памяти - ${chalk.cyan(`${ramMaxPercentLoad}gb`)}`);
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

isAdmin()
  .then((admin) => {
    if (!admin) {
      console.log(chalk.bgRed('Запустите консоль от имени администратора'));
      return;
    }

    getLoadInfo()
      .then(() => {
        setInterval(() => {
          getLoadInfo()
            .catch((err) => {
              console.log(chalk.bgRed('Ошибка запуска мониторинга'), err);
            });
        }, monitoringInterval * 1000);
      })
      .catch((err) => {
        console.log(chalk.bgRed('Ошибка запуска мониторинга'), err);
      });
  })
  .catch(() => {
    console.log(chalk.bgRed('Ошибка проверки прав администратора'));
  });
