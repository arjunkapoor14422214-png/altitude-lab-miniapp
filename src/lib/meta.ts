interface CompleteRegistrationPayload {
  eventId: string;
  verificationId: string;
  language: string;
  telegramUserId?: number | null;
}

export function trackCompleteRegistration(payload: CompleteRegistrationPayload) {
  if (typeof window === 'undefined') {
    return;
  }

  const body = JSON.stringify({
    ...payload,
    eventSourceUrl: window.location.href,
  });

  void fetch('/api/meta/complete-registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
    keepalive: true,
  }).catch(() => {
    // Activation flow should not break if Meta tracking is unavailable.
  });
}
