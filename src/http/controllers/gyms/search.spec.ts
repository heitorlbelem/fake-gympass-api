import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to search for gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'JS Gym',
        description: 'The best JS gym in the world',
        phone: '123456789',
        latitude: 0,
        longitude: 0,
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TS Gym',
        description: 'The best TS gym in the world',
        phone: '123456789',
        latitude: 90,
        longitude: 180,
      })
    const response = await request(app.server)
      .get('/gyms/search')
      .query({ q: 'JS' })
      .set('Authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'JS Gym',
      }),
    ])
  })
})
