export function safeParseJson(value: string): any | undefined {
  try {
    return JSON.parse(value)
  } catch (err) {
    return undefined
  }
}
