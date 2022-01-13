import path from 'path';
import fs from 'fs-extra';
import { ConfigType } from '../types/ConfigType';

export const removeSurfers = async (surfers: ConfigType['surfersOrder']): Promise<void> => {
  const removeOperations = surfers.map((surfer) => {
    return fs.readdir(path.join(__dirname, `../../surfers/${surfer}`))
      .then((files) => {
        files
          .filter((file) => file !== 'copy' && file !== 'proxies.txt')
          .map((file) => {
            return fs.remove(path.join(__dirname, `../../surfers/${surfer}/${file}`));
          });
      })
      .catch((err) => {
        throw err;
      });
  });

  await Promise.all(removeOperations.flat());
};
