import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a new gym', async () => {
    const { gym } = await createGymUseCase.execute({
      name: 'JS Academy',
      description: 'The best gym in the world',
      phone: '123456789',
      latitude: -23.5489,
      longitude: -46.6388,
    })
    expect(gym.id).toEqual(expect.any(String))
  })
})
