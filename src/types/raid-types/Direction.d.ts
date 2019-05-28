import { TileI } from 'src/types/raid-types/MapLocation'

type NORTH_T = 'NORTH'
type SOUTH_T = 'SOUTH'
type EAST_T = 'EAST'
type WEST_T = 'WEST'
type NORTH_EAST_T = 'NORTH_EAST'
type NORTH_WEST_T = 'NORTH_WEST'
type SOUTH_WEST_T = 'SOUTH_WEST'
type SOUTH_EAST_T = 'SOUTH_EAST'
type OMNI_T = 'OMNI'

type DIRECTIONS = NORTH_T | SOUTH_T | EAST_T | WEST_T | NORTH_EAST_T | NORTH_WEST_T | SOUTH_EAST_T | SOUTH_WEST_T| OMNI_T

interface DirectionStaticI extends Function {
  new(x: number, y: number): DirectionI
  randomDirection: () => DirectionI

  NORTH: DirectionI
  SOUTH: DirectionI
  EAST: DirectionI
  WEST: DirectionI
  NORTH_EAST: DirectionI
  NORTH_WEST: DirectionI
  SOUTH_EAST: DirectionI
  OMNI: DirectionI
}

export interface DirectionI extends DirectionStaticI {
  equals: (l: DirectionI) => boolean
  isAdjacentTo: (d: DirectionI) => boolean
  x: number
  y: number
  rotateLeft: () => DirectionI
  rotateRight: () => DirectionI
  opposite: () => DirectionI
  toString: () => DIRECTIONS
}
