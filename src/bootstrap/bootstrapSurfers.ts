import path from 'path';
import fs from 'fs-extra';
import { ProxyType } from '../types/ProxyType';
import { ConfigType } from '../types/ConfigType';

export const bootstrapSurfers = async (proxies: ProxyType[], surfers: ConfigType['surfersOrder']): Promise<void> => {
  const copyOperations = surfers.map((surfer) => {
    const surferPath = path.join(__dirname, `../../surfers/${surfer}/copy`);

    return proxies.map((proxy, i) => {
      return fs.copy(surferPath, `${surferPath}_${i + 1}`, { recursive: true, overwrite: true });
    });
  });

  await Promise.all(copyOperations.flat());
};
