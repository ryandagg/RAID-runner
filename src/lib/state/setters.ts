import { MapLocationI } from 'src/types/raid-types/MapLocation'
import { setState } from 'src/lib/state/state'
import { PlayerControllerI } from 'src/types/raid-types/RaidTypes'

export const addToPathStart = (loc: MapLocationI): void => {
  setState((state) => {
    state.pathToStart.push(loc)
  })
}

export const setPlayerController = (playerController: PlayerControllerI): void => {
  setState((draft) => {
    draft.playerController = playerController
  })
}
