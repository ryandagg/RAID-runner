import { DirectionI } from './Direction'
import { UnitInfoI } from 'src/types/raid-types/UnitInfo'
import { MapLocationI, MapTileI, TileI } from 'src/types/raid-types/MapLocation'
import { MapT } from 'src/types/PlayerState'

export interface PlayerControllerI {
  /*** QUERIES ***/
  canMove: (d: DirectionI) => boolean
  getCurrentLocation: () => MapLocationI
  senseNearbyUnits: () => UnitInfoI[]
  senseDirectionToExit: () => DirectionI
  getDelay: () => number
  getMyInfo: () => UnitInfoI
  senseIfPassable: (l: TileI) => boolean
  senseUnitAtLocation: (l: TileI) => UnitInfoI | null
  canSense: (l: TileI) => boolean

  // path finding
  findPath: (map: MapT, start: MapLocationI, end: MapLocationI) => DirectionI[]
  nextDirTo: (map: MapT, start: MapLocationI, end: MapLocationI) => DirectionI | null

  // combat
  canRangedAttack: (d: MapLocationI) => boolean
  canMeleeAttack: (d: MapLocationI) => boolean
  canMagicAttack: (d: MapLocationI) => boolean

  /*** MUTATIONS ***/
  move: (d: DirectionI) => void
  heal: () => void

  // combat
  rangedAttack: (d: MapLocationI) => void
  meleeAttack: (d: MapLocationI) => void
  magicAttack: (d: MapLocationI) => void
}
