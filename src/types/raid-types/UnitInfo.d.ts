import { MapLocationI } from 'src/types/raid-types/MapLocation'

export interface UnitInfoI {
  /*** QUERIES ***/
  spawnedUnitType: string
  location: MapLocationI
  sensorRadiusSquared: number
  hp: number
  healPower: number
  maxHp: number
  meleeAttackPower: number
  meleeAttackDelay: number
  magicAttackPower: number
  magicAttackDelay: number
  rangedAttackPower: number
  rangedAttackDelay: number
}
