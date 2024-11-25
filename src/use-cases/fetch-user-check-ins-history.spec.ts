import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-In History Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
    )

    await gymsRepository.create({
      id: 'gym-01',
      name: 'Gym Name',
      latitude: 0,
      longitude: 0,
      description: 'Gym Description',
      phone: '123456789',
    })
  })

  it('should be able to fetch user check ins history', async () => {
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
      created_at: new Date(),
    })
    await checkInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
      created_at: new Date(),
    })

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: `user-01`,
        gym_id: `gym-${i}`,
        created_at: new Date(),
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
