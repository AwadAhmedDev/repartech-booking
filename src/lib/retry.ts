/**
 * Transient network failures (Wi-Fi hiccup, DNS blip, cold TLS handshake, a
 * CORS preflight dropped before it reaches Supabase) surface in the browser as
 * a bare `TypeError: Failed to fetch`. They are indistinguishable from a real
 * outage at the call site, yet they almost always succeed on a second attempt —
 * so public page loads retry them instead of dead-ending on an error panel.
 */
const TRANSIENT_PATTERNS = [
  'failed to fetch',
  'networkerror',
  'network request failed',
  'load failed',
  'fetch failed',
  'err_network',
  'err_connection',
  'timeout',
]

export function isTransientNetworkError(error: unknown): boolean {
  if (!error) return false
  const message =
    typeof error === 'string' ? error : ((error as { message?: string }).message ?? String(error))
  const normalized = message.toLowerCase()
  return TRANSIENT_PATTERNS.some((pattern) => normalized.includes(pattern))
}

interface RetryOptions {
  attempts?: number
  baseDelayMs?: number
}

/**
 * Runs `operation`, retrying only on transient network errors with exponential
 * backoff. Any other failure (RLS denial, bad request, unique violation) is
 * rethrown immediately — retrying those would only delay the error message.
 *
 * Read-only by contract: never wrap an insert/update with this, or a dropped
 * response could produce a duplicate write.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  { attempts = 3, baseDelayMs = 400 }: RetryOptions = {},
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (attempt === attempts || !isTransientNetworkError(error)) throw error
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** (attempt - 1)))
    }
  }

  throw lastError
}
