import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })
    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })
    const { token } = authResponse.body
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.status).toBe(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'john.doe@example.com',
      }),
    )
  })
})
