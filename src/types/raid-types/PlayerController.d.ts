import { DirectionI } from './Direction'
import { UnitInfoI } from 'src/types/raid-types/UnitInfo'
import { MapLocationI } from 'src/types/raid-types/MapLocation'

export interface PlayerControllerI {
  canMove: (d: DirectionI) => boolean
  getCurrentLocation: () => MapLocationI
  senseNearbyUnits: () => UnitInfoI[]
  canRangedAttack: (d: MapLocationI) => boolean
  canMeleeAttack: (d: MapLocationI) => boolean
  canMagicAttack: (d: MapLocationI) => boolean
  rangedAttack: (d: MapLocationI) => void
  meleeAttack: (d: MapLocationI) => void
  magicAttack: (d: MapLocationI) => void
  senseDirectionToExit: () => DirectionI
  getDelay: () => number
  move: (d: DirectionI) => void
}
