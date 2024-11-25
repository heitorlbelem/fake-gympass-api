import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let checkInsRepository: InMemoryCheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date('2024-11-25T10:00:00'))
    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })
    vi.setSystemTime(new Date('2024-11-26T10:00:00'))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2024-11-25T10:00:00'))
    await checkInUseCase.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    })
    await expect(() =>
      checkInUseCase.execute({ gymId: 'gym-id', userId: 'user-id' }),
    ).rejects.toBeInstanceOf(Error)
  })
})
