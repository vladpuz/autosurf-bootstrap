import path from 'path';
import fs from 'fs-extra';
import { ProxiesType } from '../types/ProxiesType';
import { SurfersType } from '../types/SurfersType';

export const bootstrapSurfers = async (
  proxies: ProxiesType,
  surfers: SurfersType,
): Promise<void> => {
  const copyOperations = surfers.map((surfer) => {
    const surferPath = path.join(__dirname, `../../surfers/${surfer}/copy`);

    return proxies[surfer].map((proxy, i) => {
      return fs.copy(surferPath, `${surferPath}_${i + 1}`, { recursive: true, overwrite: true });
    });
  });

  await Promise.all(copyOperations.flat());
};
