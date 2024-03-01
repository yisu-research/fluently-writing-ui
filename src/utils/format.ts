export function prettyObject(msg: any) {
  const obj = msg
  if (typeof msg !== 'string') {
    msg = JSON.stringify(msg, null, '  ')
  }
  if (msg === '{}') {
    return obj.toString()
  }
  if (msg.startsWith('```json')) {
    return msg
  }
  return ['```json', msg, '```'].join('\n')
}

export function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidPassword(val: string) {
  const regex = /^(?!([^(0-9a-zA-Z)])+$).{8,32}$/
  return regex.test(val)
}

export function isValidCode(code: string) {
  const regex = /^\d{6}$/
  return regex.test(code)
}
