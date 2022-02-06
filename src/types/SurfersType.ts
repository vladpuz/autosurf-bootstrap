import { config } from '../../config'

const { surfersOrder } = config

export type SurfersType = Array<typeof surfersOrder[number]>
