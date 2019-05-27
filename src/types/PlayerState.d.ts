import { MapLocationI, MapTileI } from 'src/types/raid-types/MapLocation'
import { PlayerControllerI } from 'src/types/raid-types/PlayerController'

export type MapType = ReadonlyArray<ReadonlyArray<MapTileI>>
export interface PlayerStateI {
  readonly map: ReadonlyArray<ReadonlyArray<MapTileI>>
  readonly pathToStart: ReadonlyArray<MapLocationI>
  readonly playerController: PlayerControllerI
}
