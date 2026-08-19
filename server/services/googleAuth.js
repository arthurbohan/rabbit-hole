const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

function redirectUri() {
  return `${process.env.PUBLIC_URL}/api/auth/google/callback`
}

export function getAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state
  })
  return `${AUTH_URL}?${params.toString()}`
}

export async function exchangeCode(code) {
  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code'
    })
  })
  if (!tokenResponse.ok) {
    throw new Error(`Google token exchange failed: ${tokenResponse.status}`)
  }
  const { access_token: accessToken } = await tokenResponse.json()

  const userResponse = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  if (!userResponse.ok) {
    throw new Error(`Google userinfo fetch failed: ${userResponse.status}`)
  }
  const profile = await userResponse.json()

  return { sub: profile.sub, email: profile.email, name: profile.name }
}
