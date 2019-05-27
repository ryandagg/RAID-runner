
type NORTH = 'NORTH'
type SOUTH = 'SOUTH'
type EAST = 'EAST'
type WEST = 'WEST'
type NORTH_EAST = 'NORTH_EAST'
type NORTH_WEST = 'NORTH_WEST'
type SOUTH_EAST = 'SOUTH_WEST'
type OMNI = 'OMNI'

type DIRECTIONS = NORTH | SOUTH | EAST | WEST | NORTH_EAST | NORTH_WEST | SOUTH_EAST | OMNI

export interface DirectionI {
  randomDirection: () => DirectionI
  equals: (l: DirectionI) => boolean
  isAdjacentTo: (d: DirectionI) => boolean
  x: number
  y: number
  rotateLeft: () => DirectionI
  toString: () => DIRECTIONS

  NORTH: DirectionI
  SOUTH: DirectionI
  EAST: DirectionI
  WEST: DirectionI
  NORTH_EAST: DirectionI
  NORTH_WEST: DirectionI
  SOUTH_EAST: DirectionI
  OMNI: DirectionI
}
