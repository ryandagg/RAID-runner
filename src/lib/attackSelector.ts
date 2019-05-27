import { getState } from 'src/lib/state/state'
import {path} from 'ramda'
import { GameConstantsI, MapLocationI, UnitInfoI } from 'src/types/raid-types/RaidTypes'
import { MapType } from 'src/types/PlayerState'

declare const GameConstants: GameConstantsI

interface PossibleAttack {
  attackFunc: (m: MapLocationI) => void
  location: MapLocationI
  rank: number
}

interface Modifiers {
  enemy: UnitInfoI
  attackPower: number
  attackDelay: number
}

interface MagicProps extends Modifiers {
  map: MapType
}

const KILL_MULTIPLIER = 2
// todo: base this on a multiplier by enemy type
const SPAWNER_MULTIPLIER = 10

const applyModifiers = ({enemy, attackPower, attackDelay}: Modifiers) => {
  // todo: base this on monster dps, player hp
  let mod = attackPower / attackDelay

  if (attackPower >= enemy.hp) {
    mod *= KILL_MULTIPLIER
  }
  if (!!enemy.spawnedUnitType) {
    mod *= SPAWNER_MULTIPLIER
  }

  return mod
}

const calcMagicAttack = ({enemy, map, attackPower, attackDelay}: MagicProps) => {
  let splashedEnemies = []
  const {x, y} = enemy.location
  for (let rowIdx = y - 1; rowIdx <= y + 1; rowIdx++) {
    for (let columnIdx = x - 1; columnIdx <= x + 1; columnIdx++) {
      const enemy: UnitInfoI = path([rowIdx, columnIdx, 'enemy'], map)
      if (enemy && !(x === columnIdx && y === rowIdx)) {
        splashedEnemies.push(enemy)
      }
    }
  }

  const withoutSplash = applyModifiers({enemy, attackDelay, attackPower})

  return splashedEnemies.reduce((acc, splashedEnemy) => {
    // probably want something other than simple addition here, but good enough for now
    return acc + applyModifiers({
      enemy: splashedEnemy,
      attackDelay,
      attackPower: attackPower * GameConstants.MAGIC_ATTACK_SPLASH_PERCENTAGE,
    })
  }, withoutSplash)
}

export const getBestAttack = (): PossibleAttack | undefined => {
  const {playerController: pc, map} = getState()

  const enemies = pc.senseNearbyUnits()
  const player = pc.getMyInfo()
  const possibleAttacks: PossibleAttack[] = []

  // calculate base damage
  // base multiplier due to ability to kill or spawner or does a lot of damage
  enemies.forEach((enemy) => {
    const {location} = enemy
    if (pc.canMeleeAttack(location)) {
      possibleAttacks.push({
        location,
        attackFunc: pc.meleeAttack,
        rank: applyModifiers({
          enemy,
          attackPower: player.meleeAttackPower,
          attackDelay: player.meleeAttackDelay,
        })
      })
    }
    if (pc.canRangedAttack(location)) {
      possibleAttacks.push({
        location,
        attackFunc: pc.rangedAttack,
        rank: applyModifiers({
          enemy,
          attackPower: player.rangedAttackPower,
          attackDelay: player.rangedAttackDelay,
        })
      })
    }
    if (pc.canMagicAttack(location)) {
      possibleAttacks.push({
        location,
        attackFunc: pc.magicAttack,
        rank: calcMagicAttack({
          enemy,
          attackPower: player.magicAttackPower,
          attackDelay: player.magicAttackDelay,
          map,
        })
      })
    }
  })

  return possibleAttacks.sort((a, b) => b.rank - a.rank)[0]
}
