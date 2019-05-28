import { DirectionI } from 'src/types/raid-types/Direction'
import { UnitInfoI } from 'src/types/raid-types/UnitInfo'

export interface TileI {
  readonly x: number
  readonly y: number
}

export interface MapTileI extends TileI {
  sensed: boolean
  passable: boolean
  enemy?: UnitInfoI
}

export interface MapLocationI extends TileI {
  add: (d: DirectionI) => MapLocationI | undefined
  directionTo: (l: MapLocationI) => DirectionI
  isAdjacentTo: (l: MapLocationI) => boolean
  equals: (l: MapLocationI) => boolean
  followedPathFinding?: boolean
}
