export interface DirectionI {
  randomDirection: () => DirectionI
  equals: (l: DirectionI) => boolean
  isAdjacentTo: (d: DirectionI) => boolean
  x: number
  y: number
  rotateLeft: () => DirectionI
}
