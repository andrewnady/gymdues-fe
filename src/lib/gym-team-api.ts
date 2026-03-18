import { getApiBaseUrl } from './api-config'

export interface TeamMember {
  id: number
  email: string
  name: string | null
  role: 'manager' | 'staff'
  status: 'pending' | 'accepted' | 'revoked'
  invited_at: string | null
  accepted_at: string | null
}

export interface TeamListResponse {
  success: boolean
  gym_id?: number
  members?: TeamMember[]
  message?: string
}

export interface TeamInviteResponse {
  success: boolean
  message?: string
  member?: TeamMember
}

export interface TeamRevokeResponse {
  success: boolean
  message?: string
}

export interface AcceptInviteResponse {
  success: boolean
  access_token?: string
  token_type?: string
  expires_in?: number
  must_set_password?: boolean
  user?: { id: number; name: string; email: string }
  gym?: { id: number; name: string; slug: string } | null
  message?: string
}

export async function apiListTeamMembers(sessionToken: string): Promise<TeamListResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/team`, {
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  if (!res.ok) return { success: false, message: 'Failed to load team members.' }
  return res.json()
}

export async function apiInviteTeamMember(
  sessionToken: string,
  email: string,
  name: string,
  role: 'manager' | 'staff' | 'trainer',
): Promise<TeamInviteResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/team/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ email, name: name || undefined, role }),
  })
  return res.json()
}

export async function apiRevokeTeamMember(
  sessionToken: string,
  memberId: number,
): Promise<TeamRevokeResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/team/${memberId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${sessionToken}` },
  })
  return res.json()
}

export async function apiAcceptTeamInvite(token: string): Promise<AcceptInviteResponse> {
  const res = await fetch(`${getApiBaseUrl()}/api/v1/gym-owner/team/accept-invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  return res.json()
}
