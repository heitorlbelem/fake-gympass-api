import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInUseCase = makeValidateCheckInUseCase()
  await validateCheckInUseCase.execute({ checkInId: id })

  return reply.status(204).send()
}
