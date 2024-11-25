import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'
import { Decimal } from '@prisma/client/runtime/library'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      name: 'JS Gym',
      description: 'The best gym for JavaScript developers',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })
    await gymsRepository.create({
      name: 'TS Gym',
      description: 'The best gym for TypeScript developers',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    })

    const { gyms } = await searchGymsUseCase.execute({
      query: 'JS',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ name: 'JS Gym' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `JS Gym ${i}`,
        description: 'The best gym for JavaScript developers',
        latitude: new Decimal(0),
        longitude: new Decimal(0),
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      query: 'JS Gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'JS Gym 21' }),
      expect.objectContaining({ name: 'JS Gym 22' }),
    ])
  })
})
