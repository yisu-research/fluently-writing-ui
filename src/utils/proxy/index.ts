import { getProxyConfig } from '@/settings/proxy-config'

export function createViteProxy(isUseProxy = true, proxyType: string) {
  if (!isUseProxy) {
    return undefined
  }
  const proxyConfig = getProxyConfig(proxyType)
  const proxy = {
    [proxyConfig.prefix]: {
      target: proxyConfig.target,
      changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  }
  return proxy
}
