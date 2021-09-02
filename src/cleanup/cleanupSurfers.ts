import path from 'path';
import fs from 'fs-extra';
import { ConfigType } from '../types/ConfigType';

export const cleanupSurfers = async (surfers: ConfigType['surfersOrder']): Promise<void> => {
  const removeOperations = surfers.map((surfer) => {
    return fs.readdir(path.join(__dirname, `../../surfers/${surfer}`))
      .then((files) => {
        files
          .filter((file) => file !== 'copy')
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
