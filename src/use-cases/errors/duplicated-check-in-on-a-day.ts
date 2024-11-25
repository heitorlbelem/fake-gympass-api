export class DuplicatedCheckInOnADayError extends Error {
  constructor() {
    super('User already checked in today')
  }
}
