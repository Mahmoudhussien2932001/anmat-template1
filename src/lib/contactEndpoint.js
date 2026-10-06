export function contactEndpoint(env = import.meta.env) {
  const value = env?.VITE_CONTACT_ENDPOINT
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}
