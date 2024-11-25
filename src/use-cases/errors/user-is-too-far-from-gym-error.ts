export class UserIsTooFarFromGymError extends Error {
  constructor() {
    super('User is too far from gym')
  }
}
