import { getState } from 'src/lib/state/state'
import {last, findLast, propEq} from 'ramda'
import { PlayerControllerI } from 'src/types/raid-types/PlayerController'
import { DirectionI, DirectionStaticI } from 'src/types/raid-types/Direction'
import { MapLocationI, MapTileI } from 'src/types/raid-types/MapLocation'
import { addToMovementHistory } from 'src/lib/state/setters'
import { getPlayerInfo } from 'src/lib/state/getters'
import { MapT } from 'src/types/PlayerState'

declare const Direction: DirectionStaticI

interface DirectionToWallProps {
  // map: MapT
  // pLoc: MapLocationI
  pc: PlayerControllerI
}

const MIN_TO_CONSIDER_WALL = 9

const NORTH = 'NORTH'
const SOUTH = 'SOUTH'
const EAST = 'EAST'
const WEST = 'WEST'
const NORTH_EAST = 'NORTH_EAST'
const NORTH_WEST = 'NORTH_WEST'
const SOUTH_EAST = 'SOUTH_EAST'
const SOUTH_WEST = 'SOUTH_WEST'

const LEFT_HAND_ORDER: DirectionI[] = [
  Direction[WEST],
  Direction[NORTH_WEST],
  Direction[NORTH],
  Direction[NORTH_EAST],
  Direction[EAST],
  Direction[SOUTH_EAST],
  Direction[SOUTH],
  Direction[SOUTH_WEST],
]

const isWallColumn = (col: ReadonlyArray<MapTileI>) => {
  return col.reduce((acc, cell) => {
    return acc + (cell.sensed && !cell.passable ? 1 : 0)
  }, 0) >= MIN_TO_CONSIDER_WALL
}

const isWallRow = (map: MapT, index: number) => {
  return map.reduce((acc, row) => {
    const cell = row[index]
    if (!cell) return
    return acc + (cell.sensed && !cell.passable ? 1 : 0)
  }, 0) >= MIN_TO_CONSIDER_WALL
}

const getDirectionToWallFromStart = ({pc/*, pLoc, map*/}: DirectionToWallProps) => {
  return pc.senseDirectionToExit().opposite()
  // let radii = 1
  // while (radii < map.length) {
  //   const minX = pLoc.x - radii
  //   const minY = pLoc.y - radii
  //   const maxX = pLoc.x + radii
  //   const maxY = pLoc.y + radii
  //
  //   const minXWall = isWallColumn(map[minY] || [])
  //   if (minXWall) {
  //     return new Direction(-1, 0)
  //   }
  //   const maxXWall = isWallColumn(map[maxY] || [])
  //   if (maxXWall) {
  //     return new Direction(1, 0)
  //   }
  //   const minYWall = isWallRow(map, minX)
  //   if (minYWall) {
  //     return new Direction(0, -1)
  //   }
  //   const maxYWall = isWallRow(map, maxX)
  //   if (maxYWall) {
  //     return new Direction(0, 1)
  //   }
  //
  //   radii++
  // }
}

const getDirectionForLeftHand = (pc: PlayerControllerI, pLoc?: MapLocationI,  lastNormalMove?: MapLocationI) => {
  let startingIndex = 0
  if (lastNormalMove && pLoc) {
    startingIndex = LEFT_HAND_ORDER.findIndex(direction => {
      return direction === lastNormalMove.directionTo(pLoc).rotateLeft().rotateLeft()
    })
  }
  return [...LEFT_HAND_ORDER.slice(startingIndex), ...LEFT_HAND_ORDER.slice(0, startingIndex)]
    .find(direction => pc.canMove(direction))
}

const lastNormalMoveFinder = (movementHistory: Readonly<MapLocationI[]>) => {
  return findLast(propEq('followedPathFinding', true))(movementHistory.slice(0, movementHistory.length - 1))
}

export const selectMove = (): boolean => {
  // go to wall first (always walls at start?
  // right hand rule
  // run to exit maybe
  const {map, playerController, movementHistory} = getState()
  const player = getPlayerInfo()
  const {location: pLoc} = player
  const lastMove = last(movementHistory)
  const lastNormalMove: MapLocationI = lastNormalMoveFinder(movementHistory)
  const doNormalMove = !!(lastMove && lastMove.followedPathFinding)
    || !!(lastNormalMove && lastNormalMove.x === pLoc.x && lastNormalMove.y === pLoc.y)
  // debugger

  // continue pathFinding
  if (doNormalMove) {
    const dirForLeftHand = getDirectionForLeftHand(playerController, pLoc, lastNormalMove)
    if (dirForLeftHand) {
      playerController.move(dirForLeftHand)
      const moved = pLoc.add(dirForLeftHand)
      moved.followedPathFinding = true
      addToMovementHistory(moved)
      return true
    }
  }

  // get back on track
  if (lastNormalMove) {
    const nextDirToNormal = playerController.nextDirTo(map, pLoc, lastNormalMove)
    if (nextDirToNormal && playerController.canMove(nextDirToNormal)) {
      playerController.move(nextDirToNormal)
      addToMovementHistory(pLoc.add(nextDirToNormal))
      return true
    } else {
      // how could we get here?
      // backtrack?
      throw Error('Uncovered selectMove && lastNormalMove case')
    }
  }

  // get the party started
  if (!movementHistory.some(({followedPathFinding}) => followedPathFinding)) {
    const dirToWall = getDirectionToWallFromStart({pc: playerController/*, pLoc, map*/})
    if (playerController.canMove(dirToWall)) {
      playerController.move(dirToWall)
      addToMovementHistory(pLoc.add(dirToWall))
    } else {
      // on wall, start pathFinding
      const dirForLeftHand = getDirectionForLeftHand(playerController)
      if (dirForLeftHand) {
        playerController.move(dirForLeftHand)
        const moved = pLoc.add(dirForLeftHand)
        moved.followedPathFinding = true
        addToMovementHistory(moved)
        return true
      }
    }
  }

  return false
}
