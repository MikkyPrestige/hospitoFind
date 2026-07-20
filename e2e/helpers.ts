import { APIRequestContext } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173'

export async function registerTestUser(request: APIRequestContext) {
  const suffix = Date.now()
  const email = `e2e-${suffix}@test.com`
  const password = 'password123'

  const res = await request.post(`${BASE_URL}/auth/register`, {
    data: {
      name: 'E2E User',
      username: `e2euser-${suffix}`,
      email,
      password,
    },
  })

  if (!res.ok()) {
    throw new Error(`Failed to register user: status ${res.status()}`)
  }

  return { email, password }
}

export async function createPendingHospital(
  request: APIRequestContext,
  token: string
) {
  const res = await request.post(`${BASE_URL}/api/v1/hospitals`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: {
      name: `E2E-Pending-${Date.now()}`,
      address: { city: 'Lagos', state: 'Nigeria' },
      type: 'General',
      longitude: 3.3792,
      latitude: 6.5244,
    },
  })

  if (!res.ok()) {
    const errorBody = await res.text()
    console.error('Create hospital failed:', res.status(), errorBody)
    throw new Error(`Failed to create pending hospital: status ${res.status()}`)
  }

  const body = await res.json()
  return body.hospital._id
}

export async function loginAsAdmin(request: APIRequestContext) {
  const res = await request.post('/auth', {
    data: {
      email: 'zero@hospitofind.com',
      password: '1234567',
    },
  })
  if (res.status() !== 201) {
    throw new Error(`Admin login failed: ${await res.text()}`)
  }
  const body = await res.json()
  return body.accessToken
}
