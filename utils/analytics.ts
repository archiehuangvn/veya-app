type EventPayload = Record<string, string | number | boolean | null | undefined>

/**
 * trackEvent — lightweight internal analytics
 * Logs to console in dev. In production, swap console.log
 * for your analytics provider (PostHog, Mixpanel, etc.)
 */
export function trackEvent(name: string, payload?: EventPayload): void {
  const event = {
    event: name,
    timestamp: new Date().toISOString(),
    ...payload,
  }

  if (typeof window !== 'undefined') {
    // Store events in session for debugging
    const key = '__veya_events'
    const existing = JSON.parse(sessionStorage.getItem(key) ?? '[]') as unknown[]
    existing.push(event)
    sessionStorage.setItem(key, JSON.stringify(existing.slice(-100))) // keep last 100
  }

  // Console output (always)
  console.log('[Veya Analytics]', name, payload ?? '')
}

// Predefined event helpers
export const Analytics = {
  pageView: (page: string) =>
    trackEvent('page_view', { page }),

  swipeRight: (userId: string) =>
    trackEvent('swipe_right', { userId }),

  swipeLeft: (userId: string) =>
    trackEvent('swipe_left', { userId }),

  audioPlay: (userId: string, src: string) =>
    trackEvent('audio_play', { userId, src }),

  matchCreated: (userId: string) =>
    trackEvent('match_created', { userId }),

  messageSent: (type: 'text' | 'voice', toUserId: string) =>
    trackEvent('message_sent', { type, toUserId }),
}
