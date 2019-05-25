import { DirectionInterface } from './Direction'

export interface PlayerControllerInterface {
  canMove: (d: DirectionInterface) => boolean
}
