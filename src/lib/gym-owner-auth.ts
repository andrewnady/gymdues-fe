import { getApiBaseUrl } from './api-config'

export interface GymOwnerUser {
  id: number
  name: string
  email: string
}

export interface GymInfo {
  id: number
  name: string
}

export interface AuthResponse {
  success: boolean
  access_token?: string
  token_type?: string
  expires_in?: number
  must_set_password?: boolean
  user?: GymOwnerUser
  gym?: GymInfo | null
  message?: string
}

export interface MeResponse {
  success: boolean
  user?: GymOwnerUser
  gym?: GymInfo | null
}

export interface SimpleResponse {
  success: boolean
  message: string
}

const TOKEN_KEY = 'gym_owner_token'

export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export async function apiMagicLogin(token: string): Promise<AuthResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/magic-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return res.json()
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function apiSetPassword(
  sessionToken: string,
  password: string,
  passwordConfirmation: string,
): Promise<SimpleResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/set-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ password, password_confirmation: passwordConfirmation }),
  })
  return res.json()
}

export async function apiForgotPassword(email: string): Promise<SimpleResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export async function apiResetPassword(
  token: string,
  password: string,
  passwordConfirmation: string,
): Promise<SimpleResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password, password_confirmation: passwordConfirmation }),
  })
  return res.json()
}

export async function apiGetMe(sessionToken: string): Promise<MeResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/me`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) return { success: false }
  return res.json()
}

export async function apiLogout(sessionToken: string): Promise<void> {
  await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
}
