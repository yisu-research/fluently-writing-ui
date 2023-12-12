interface ProxyConfig {
  prefix: string
  target: string
}

// q: 如何类型注解 proxyConfigMappings，请写出你的答案
// a: Record<string, ProxyConfig>
// q: Record 是什么？
// a: Record<K extends keyof any, T> 是一个泛型，它的作用是将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
const proxyConfigMappings: Record<string, ProxyConfig> = {
  dev: {
    prefix: '/api',
    target: 'http://8.142.167.132:3001',
  },
  test: {
    prefix: '/api',
    target: 'http://localhost:8080',
  },
  prod: {
    prefix: '/api',
    target: 'https://ai.yisukeyan.com',
  },
}

export function getProxyConfig(envType = 'dev') {
  return proxyConfigMappings[envType]
}
