import path from 'path';
import fs from 'fs-extra';
import { config } from '../../config';
import { ProxiesType } from '../types/ProxiesType';

export const parseProxies = async (): Promise<ProxiesType> => {
  const { surfersOrder } = config;

  const readOperations = surfersOrder.map((surfer) => {
    return fs.readFile(path.join(__dirname, `../../surfers/${surfer}/proxies.txt`), 'utf-8');
  });

  const readData = await Promise.all(readOperations);
  const entries = readData.map((list, i) => {
    const proxyList = list
      .split('\n')
      .filter((proxy) => proxy)
      .map((proxy) => {
        const split = proxy.split('@');

        if (split.length === 1) {
          return {
            ip: split[0].split(':')[0],
            port: +split[0].split(':')[1] || 80,
          };
        }

        const [login, password] = split[0].split(':');
        const [ip, port] = split[1].split(':');

        return {
          ip,
          port: +port || 80,
          login,
          password,
        };
      });

    return [surfersOrder[i], proxyList];
  });

  return Object.fromEntries(entries) as ProxiesType;
};
