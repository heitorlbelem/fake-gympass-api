import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    return prisma.gym.findUnique({ where: { id } })
  }

  async create(data: Prisma.GymCreateInput) {
    return prisma.gym.create({ data })
  }

  async searchMany(query: string, page: number) {
    return prisma.gym.findMany({
      where: { name: { contains: query } },
      skip: (page - 1) * 20,
      take: 20,
    })
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    return await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
  }
}
