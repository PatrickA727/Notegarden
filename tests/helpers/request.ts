export function getRequest(url = 'http://localhost/api/me/state'): Request {
  return new Request(url, { method: 'GET' })
}

export function postJson(body: unknown, url = 'http://localhost/api/me/sync'): Request {
  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
    },
    body: JSON.stringify(body),
  })
}

export function postRaw(body: string, url = 'http://localhost/api/me/sync'): Request {
  return new Request(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: process.env.NEXT_PUBLIC_BETTER_AUTH_URL!,
    },
    body,
  })
}
