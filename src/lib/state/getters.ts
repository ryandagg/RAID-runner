import { MapLocationI } from 'src/types/raid-types/MapLocation'
import {getState} from 'src/lib/state/state'

export const inPathToStart = (loc: MapLocationI): boolean =>  getState().pathToStart
  .filter((l: MapLocationI) =>  l.equals(loc))
  .length > 0

export const getPlayerContoller = () => getState().playerController
