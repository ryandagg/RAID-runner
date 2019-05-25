import { DirectionI } from 'src/types/raid-types/Direction'

export interface MapLocationI {
  add: (d: DirectionI) => MapLocationI | undefined
  directionTo: (l: MapLocationI) => DirectionI
  isAdjacentTo: (l: MapLocationI) => boolean
  equals: (l: MapLocationI) => boolean
}
