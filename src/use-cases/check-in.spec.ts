import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { DuplicatedCheckInOnADayError } from './errors/duplicated-check-in-on-a-day'
import { UserIsTooFarFromGymError } from './errors/user-is-too-far-from-gym-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)
    vi.useFakeTimers()

    await gymsRepository.create({
      id: 'gym-1',
      name: 'Gym Name',
      latitude: 0,
      longitude: 0,
      description: 'Gym Description',
      phone: '123456789',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date('2024-11-25T10:00:00'))
    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })
    vi.setSystemTime(new Date('2024-11-26T10:00:00'))
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2024-11-25T10:00:00'))
    await checkInUseCase.execute({
      gymId: 'gym-1',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    })
    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-1',
        userId: 'user-id',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(DuplicatedCheckInOnADayError)
  })

  it('should not be able to check in a distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-2',
      name: 'JS Gym',
      latitude: -23.5505,
      longitude: -46.6333,
      description: '',
      phone: '',
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-2',
        userId: 'user-id',
        userLatitude: -23.5415,
        userLongitude: -46.6333,
      }),
    ).rejects.toBeInstanceOf(UserIsTooFarFromGymError)
  })
})
