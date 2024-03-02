import { getProxyConfig } from '../../src/settings'

export function createViteProxy(isUseProxy = true, proxyType: string) {
  if (!isUseProxy) {
    return undefined
  }

  const proxyConfig = getProxyConfig(proxyType)
  // console.log(proxyConfig)
  const proxy = {
    [proxyConfig.prefix]: {
      target: proxyConfig.target,
      changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  }
  return proxy
}
