import path from 'path';
import fs from 'fs-extra';
import xmlbuilder from 'xmlbuilder';
import { exec } from 'child_process';
import { ProxyCapConfigType } from '../types/ProxyCapConfigType';
import { ProxyType } from '../types/ProxyType';
import { ConfigType } from '../types/ConfigType';

export const bootstrapProxyCap = async (proxies: ProxyType[], surfers: ConfigType['surfersOrder']): Promise<void> => {
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

  proxies.forEach((proxy, i) => {
    const { ip, port, login, password } = proxy;
    const authMethod = (login && password) ? 'password' : 'none';
    const proxyName = `proxy_${i + 1}`;

    config.proxycap_ruleset.proxy_servers.proxy_server.push({
      '@name': proxyName,
      '@type': 'socks5',
      '@hostname': ip,
      '@port': port,
      '@auth_method': authMethod,
      '@username': authMethod === 'password' ? login : null,
      '@password': authMethod === 'password' ? password : null,
      '@is_default': i === 0,
    });

    surfers.forEach((surfer) => {
      const ruleName = `${surfer}_${i + 1}`;
      let program: ProxyCapConfigType['proxycap_ruleset']['routing_rules']['routing_rule'][number]['programs']['program'] = [];

      switch (surfer) {
        case 'webisida':
          program = [
            {
              '@path': path.join(__dirname, `../../surfers/webisida/copy_${i + 1}/Webisida.Browser.exe`),
              '@dir_included': true,
            },
            {
              '@path': path.join(__dirname, `../../surfers/webisida/copy_${i + 1}/gecko/SecureSurf.Browser.Client.exe`),
              '@dir_included': true,
            },
          ];
          break;
        case 'simple':
          program = [
            {
              '@path': path.join(__dirname, `../../surfers/simple/copy_${i + 1}/SimpleSurfing.Client.exe`),
              '@dir_included': true,
            },
          ];
          break;
        default:
          return;
      }

      config.proxycap_ruleset.routing_rules.routing_rule.push({
        '@name': ruleName,
        '@action': 'proxy',
        '@remote_dns': false,
        '@transports': 'all',
        '@disabled': false,
        proxy_or_chain: {
          '@name': proxyName,
        },
        programs: {
          program,
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
  });

  const configXml = xmlbuilder.create(config).end({ pretty: true });
  const configPath = path.join(__dirname, '../utils/machine.xml');

  await fs.writeFile(configPath, configXml);
  exec(
    '.\\xml2prs.exe .\\machine.xml C:\\ProgramData\\ProxyCap\\machine.prs',
    { cwd: path.join(__dirname, '../utils') },
    () => fs.removeSync(configPath),
  );
};
