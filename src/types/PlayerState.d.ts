import { MapLocationI } from 'src/types/raid-types/MapLocation'
import { PlayerControllerI } from 'src/types/raid-types/PlayerController'

export interface PlayerStateI {
  readonly map: ReadonlyArray<ReadonlyArray<MapLocationI>>
  readonly pathToStart: ReadonlyArray<MapLocationI>
  readonly playerController: PlayerControllerI
}
