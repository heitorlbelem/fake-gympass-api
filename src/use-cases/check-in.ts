import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceInKilometersBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { UserIsTooFarFromGymError } from './errors/user-is-too-far-from-gym-error'
import { DuplicatedCheckInOnADayError } from './errors/duplicated-check-in-on-a-day'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) throw new ResourceNotFoundError()

    const distanceBetweenUserAndGym = getDistanceInKilometersBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    const MAX_DISTANCE_TO_CHECK_IN = 0.1 // 100 meters
    if (distanceBetweenUserAndGym > MAX_DISTANCE_TO_CHECK_IN) {
      throw new UserIsTooFarFromGymError()
    }

    const existingCheckIn = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (existingCheckIn) throw new DuplicatedCheckInOnADayError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return { checkIn }
  }
}
