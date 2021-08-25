import { proxies } from '../../settings/proxies';
import { ProxyType } from '../types/ProxyType';

export const parseProxies = (): ProxyType[] => {
  return proxies
    .split('\n')
    .filter((proxy) => proxy)
    .map((proxy) => {
      const split = proxy.split('@');

      if (split.length === 1) {
        return {
          ip: split[0].split(':')[0],
          port: +split[0].split(':')[1],
        };
      }

      const [login, password] = split[0].split(':');
      const [ip, port] = split[1].split(':');

      return {
        ip,
        port: +port || 8080,
        login,
        password,
      };
    });
};
