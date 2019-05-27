import { DirectionI } from 'src/types/raid-types/Direction'
import { UnitInfoI } from 'src/types/raid-types/UnitInfo'

export interface TileI {
  x: number
  y: number
}

export interface MapTileI extends TileI {
  passable: boolean
  enemy?: UnitInfoI
}

export interface MapLocationI extends TileI {
  add: (d: DirectionI) => MapLocationI | undefined
  directionTo: (l: MapLocationI) => DirectionI
  isAdjacentTo: (l: MapLocationI) => boolean
  equals: (l: MapLocationI) => boolean
  x: number
  y: number
}
