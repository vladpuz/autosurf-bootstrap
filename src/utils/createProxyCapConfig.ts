import path from 'path';
import fs from 'fs-extra';
import xmlbuilder from 'xmlbuilder';
import colors from 'colors';
import { exec } from 'child_process';
import { parseProxies } from './parseProxies';
import { ProxyCapConfigType } from '../types/ProxyCapConfigType';

export const createProxyCapConfig = async (): Promise<void> => {
  const proxiesList = parseProxies();

  const config: ProxyCapConfigType = {
    proxycap_ruleset: {
      '@version': 535,
      proxy_servers: {
        proxy_server: [],
      },
      routing_rules: {
        routing_rule: [],
      },
    },
  };

  proxiesList.forEach((proxy, i) => {
    const { ip, port, username, password } = proxy;
    const name = `webisida_${i + 1}`;

    config.proxycap_ruleset.proxy_servers.proxy_server.push({
      '@name': name,
      '@type': 'socks5',
      '@hostname': ip,
      '@port': port,
      '@auth_method': (username || password) ? 'password' : 'none',
      '@username': username,
      '@password': password,
      '@is_default': i === 0,
    });

    config.proxycap_ruleset.routing_rules.routing_rule.push({
      '@name': name,
      '@action': 'proxy',
      '@remote_dns': false,
      '@transports': 'all',
      '@disabled': false,
      proxy_or_chain: {
        '@name': name,
      },
      programs: {
        program: [
          {
            '@path': path.join(__dirname, `../../webisidas/webisida_${i + 1}/Webisida.Browser.exe`),
            '@dir_included': true,
          },
          {
            '@path': path.join(__dirname, `../../webisidas/webisida_${i + 1}/gecko/SecureSurf.Browser.Client.exe`),
            '@dir_included': true,
          },
        ],
      },
      ports: {
        port_range: [
          {
            '@first': 80,
            '@last': 80,
          },
          {
            '@first': 443,
            '@last': 443,
          },
        ],
      },
    });
  });

  const xml = xmlbuilder.create(config).end({ pretty: true });
  const configPath = path.join(__dirname, 'proxyCapConfig.xml');

  try {
    await fs.writeFile(configPath, xml);
    exec('.\\xml2prs.exe .\\proxyCapConfig.xml C:\\ProgramData\\ProxyCap\\machine.prs', { cwd: __dirname }, () => {
      fs.remove(configPath)
        .catch((err) => {
          console.log(`Настройка ProxyCap - ${colors.red('ошибка')}`, err);
        });
    });
    console.log(`Настройка ProxyCap - ${colors.green('успешно')}`);
  } catch (err) {
    console.log(`Настройка ProxyCap - ${colors.red('ошибка')}`, err);
  }
};
