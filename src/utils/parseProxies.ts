import { proxies } from '../../settings/proxies';
import { ProxyType } from '../types/ProxyType';

export const parseProxies = (): ProxyType[] => {
  return proxies
    .split('\n')
    .filter((proxy) => proxy)
    .map((proxy) => {
      const [username, password] = proxy.split('@')[0].split(':');
      const [ip, port] = proxy.split('@')[1].split(':');

      return {
        ip,
        port: +port || 8080,
        username,
        password,
      };
    });
};
