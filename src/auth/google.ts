// ============================================================================
// Google OAuth 2.0 (OpenID Connect) Integration for جسم و اندیشه
// ============================================================================

import { Env } from '../types';

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export function getGoogleAuthUrl(env: Env, state: string, requestRedirectUri?: string): string {
  const clientId = env.GOOGLE_CLIENT_ID || '';
  const redirectUri = requestRedirectUri || env.REDIRECT_URI || 'https://chth.gym/api/auth/google/callback';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state: state
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  env: Env,
  code: string,
  requestRedirectUri?: string
): Promise<{ access_token: string; id_token?: string } | null> {
  const clientId = env.GOOGLE_CLIENT_ID || '';
  const clientSecret = env.GOOGLE_CLIENT_SECRET || '';
  const redirectUri = requestRedirectUri || env.REDIRECT_URI || 'https://chth.gym/api/auth/google/callback';

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Token Exchange Failed:', errorText);
    return null;
  }

  return response.json();
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    console.error('Failed to fetch Google user info');
    return null;
  }

  return response.json();
}
