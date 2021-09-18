import path from 'path';
import fs from 'fs-extra';
import { config } from '../../config';
import { SurfersType } from '../types/SurfersType';

export const scanSurfers = async (): Promise<SurfersType> => {
  const { surfersOrder } = config;

  const readOperations = surfersOrder.map((surfer) => {
    return fs.readdir(path.join(__dirname, `../../surfers/${surfer}/copy`));
  });

  const readData = await Promise.all(readOperations);

  return readData
    .filter((data) => data.length > 1)
    .map((data, i) => surfersOrder[i]);
};
