import { config } from '../../config';

const { surfersOrder } = config;

export type SurfersType = typeof surfersOrder[number][];
