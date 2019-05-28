import { MapLocationI } from 'src/types/raid-types/MapLocation'
import {getState} from 'src/lib/state/state'

export const inMovementHistory = (loc: MapLocationI): boolean =>  getState().movementHistory
  .filter((l: MapLocationI) =>  l.equals(loc))
  .length > 0

export const getPlayerController = () => getState().playerController

export const getMap = () => getState().map

// row is y, column is x
export const getMapMaxX = () => getMap().length
export const getMapMaxY = () => (getMap()[0] || []).length

export const getPlayerInfo = () => getPlayerController().getMyInfo()
