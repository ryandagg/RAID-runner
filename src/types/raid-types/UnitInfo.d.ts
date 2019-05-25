import { DirectionI } from 'src/types/raid-types/Direction'
import { MapLocationI } from 'src/types/raid-types/MapLocation'

export interface UnitInfoI {
  spawnedUnitType: string;
  location: MapLocationI
  hp: number
}
