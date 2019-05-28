import { MapLocationI, MapTileI } from 'src/types/raid-types/MapLocation'
import { PlayerControllerI } from 'src/types/raid-types/PlayerController'

export type MapT = ReadonlyArray<ReadonlyArray<MapTileI>>
export interface PlayerStateI {
  readonly map: ReadonlyArray<ReadonlyArray<MapTileI>>
  readonly movementHistory: ReadonlyArray<MapLocationI>
  readonly playerController: PlayerControllerI

}
