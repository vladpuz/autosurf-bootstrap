import { config } from '../../config'
import { ProxyType } from './ProxyType'

const { surfersOrder } = config

export type ProxiesType = { [key in typeof surfersOrder[number]]: ProxyType[] }
