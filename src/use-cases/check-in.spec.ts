import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    gymsRepository.items.push({
      id: 'gym-id',
      name: 'Gym Name',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      description: 'Gym Description',
      phone: '123456789',
    })
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
