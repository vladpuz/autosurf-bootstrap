import path from 'path';
import fs from 'fs-extra';
import xmlbuilder from 'xmlbuilder';
import { execSync } from 'child_process';
import { ProxyCapConfigType } from '../types/ProxyCapConfigType';
import { ProxiesType } from '../types/ProxiesType';
import { SurfersType } from '../types/SurfersType';

export const bootstrapProxyCap = async (proxies: ProxiesType, surfers: SurfersType): Promise<void> => {
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

  surfers.forEach((surfer) => {
    proxies[surfer].forEach((proxy, i) => {
      const { ip, port, login, password } = proxy;
      const authMethod = (login && password) ? 'password' : 'none';
      const proxyName = `proxy_${surfer}_${i + 1}`;

      config.proxycap_ruleset.proxy_servers.proxy_server.push({
        '@name': proxyName,
        '@type': 'socks5',
        '@hostname': ip,
        '@port': port,
        '@auth_method': authMethod,
        '@username': authMethod === 'password' ? login : null,
        '@password': authMethod === 'password' ? password : null,
        '@is_default': surfer === surfers[0] && i === 0,
      });

      const ruleName = `${surfer}_${i + 1}`;
      const basePath = path.join(__dirname, `../../surfers/${surfer}/copy_${i + 1}`);
      let program: Array<{ '@path': string, '@dir_included': boolean }> = [];

      switch (surfer) {
        case 'webisida':
          program = [
            {
              '@path': path.join(basePath, 'Webisida.Browser.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'gecko/SecureSurf.Browser.Client.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'gecko/plugin-container.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'gecko/FlashPlayerPlugin_32_0_0_142.exe'),
              '@dir_included': true,
            },
          ];
          break;
        case 'simple':
          program = [
            {
              '@path': path.join(basePath, 'SimpleSurfing.Client.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'SimpleSurfing.Restarter.exe'),
              '@dir_included': true,
            },
          ];
          break;
        case 'vipip':
          program = [
            {
              '@path': path.join(basePath, 'VipIpClnt.exe'),
              '@dir_included': true,
            },
          ];
          break;
        case 'waspace':
          program = [
            {
              '@path': path.join(basePath, 'waspwing.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'wahiver64.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'WAScribe.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'launcher.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'wasp.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'wahiver.exe'),
              '@dir_included': true,
            },
          ];
          break;
        case 'jetswap':
          program = [
            {
              '@path': path.join(basePath, 'safesurf.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'SurfGuard.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'prtest.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'f/cg.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'f/jet.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'f/1/plugin-container.exe'),
              '@dir_included': true,
            },
            {
              '@path': path.join(basePath, 'f/1/plugin-hang-ui.exe'),
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
        '@remote_dns': true,
        '@transports': 'all',
        '@disabled': false,
        proxy_or_chain: {
          '@name': proxyName,
        },
        programs: {
          program,
        },
      });
    });
  });

  const configXml = xmlbuilder.create(config).end({ pretty: true });
  const configPath = path.join(__dirname, '../utils/machine.xml');

  await fs.writeFile(configPath, configXml);

  try {
    execSync(
      '.\\xml2prs.exe .\\machine.xml C:\\ProgramData\\ProxyCap\\machine.prs',
      { cwd: path.join(__dirname, '../utils') },
    );
  } catch (err) {
    if (err instanceof Error) {
      if (!err.message.includes('Command failed')) {
        throw err;
      }
    }
  } finally {
    fs.removeSync(configPath);
  }
};
