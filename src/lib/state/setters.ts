import { MapLocationI, MapTileI } from 'src/types/raid-types/MapLocation'
import { setState } from 'src/lib/state/state'
import { PlayerControllerI } from 'src/types/raid-types/RaidTypes'

export const addToPathStart = (loc: MapLocationI): void => {
  setState((state) => {
    // @ts-ignore // this should be working and is everywhere else...
    state.pathToStart.push(loc)
  })
}

export const setPlayerController = (playerController: PlayerControllerI): void => {
  setState((state) => {
    state.playerController = playerController
  })
}

export const setMap = (map: MapTileI[][]): void => {
  setState((state) => {
    state.map = map
  })
}
