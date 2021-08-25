export type ProxyCapConfigType = {
  proxycap_ruleset: {
    '@version': number
    proxy_servers: {
      proxy_server: Array<{
        '@name': string
        '@type': 'socks5'
        '@hostname': string
        '@port': number
        '@auth_method': 'password' | 'none'
        '@username'?: string | null
        '@password'?: string | null
        '@is_default': boolean
      }>
    }
    routing_rules: {
      routing_rule: Array<{
        '@name': string
        '@action': 'proxy'
        '@remote_dns': boolean
        '@transports': 'all'
        '@disabled': boolean
        proxy_or_chain: {
          '@name': string
        }
        programs: {
          program: Array<{
            '@path': string
            '@dir_included': boolean
          }>
        }
        ports: {
          port_range: Array<{
            '@first': number
            '@last': number
          }>
        }
      }>
    }
  }
};
