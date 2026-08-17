export function parseJSON<T>(content?: string): T | null {
  try {
    return content ? JSON.parse(content) : null;
  } catch {
    return null;
  }
}