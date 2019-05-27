import { MapLocationI, MapTileI } from 'src/types/raid-types/MapLocation'
import { PlayerControllerI } from 'src/types/raid-types/PlayerController'

export interface PlayerStateI {
  readonly map: ReadonlyArray<ReadonlyArray<MapTileI>>
  readonly pathToStart: ReadonlyArray<MapLocationI>
  readonly playerController: PlayerControllerI
}
