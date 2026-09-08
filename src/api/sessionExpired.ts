type SessionExpiredListener = () => void

const listeners = new Set<SessionExpiredListener>()
let notified = false

/** Subscribe to forced logout when access+refresh are no longer usable. */
export function onSessionExpired(listener: SessionExpiredListener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Call after login so a later expiry can notify again. */
export function resetSessionExpiredState() {
  notified = false
}

/**
 * Clear tokens and notify AuthProvider once per expiry wave.
 * Safe to call from the API client (no React imports).
 */
export function notifySessionExpired() {
  if (notified) {
    return
  }
  notified = true

  for (const listener of listeners) {
    try {
      listener()
    } catch {
      // Listener errors must not break the request path.
    }
  }
}
