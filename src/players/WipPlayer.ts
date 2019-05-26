import {DirectionI, PlayerControllerI, UnitInfoI, MapLocationI} from 'src/types/raid-types/RaidTypes'
import { getPlayerContoller, inPathToStart } from 'src/lib/state/getters'
import { addToPathStart, setPlayerController } from 'src/lib/state/setters'
import {setState} from 'src/lib/state/state'

declare const Direction: DirectionI

interface RaidPlayerInterface {
  act: () => void;
}

export class WipPlayer implements RaidPlayerInterface {
  private readonly pc: PlayerControllerI

  constructor(playerController: PlayerControllerI) {
    // playerController is mutated by RAID, so we pretty much need to deal with this here.
    // we need to call setState on playerController at the beginning of very act() call.
    this.pc = playerController
    setState((state) => {
      state.playerController = playerController
      state.map = []
      state.pathToStart = []
    })
  }

  act() {
    setPlayerController(this.pc)
    const pc = getPlayerContoller()
    const ourLoc = pc.getCurrentLocation()
    const enemies = pc.senseNearbyUnits()

    const spawners = enemies.filter(function (enemy: UnitInfoI) {
      return enemy.spawnedUnitType
    })

    // handle spawners
    for (let i = 0; i < spawners.length; i++) {
      let enemy = spawners[i];
      if (enemy.hp > 1) {
        if (pc.canRangedAttack(enemy.location)) {
          pc.rangedAttack(enemy.location);
          return;
        }
      }
    }

    // melee range next
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i]
      if (enemy.location.isAdjacentTo(ourLoc) && enemy.hp > 1) {
        if (pc.canMeleeAttack(enemy.location)) {
          pc.meleeAttack(enemy.location)
          return
        }
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      if (pc.canMagicAttack(enemy.location)) {
        pc.magicAttack(enemy.location)
        return
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i]
      if (enemy.hp > 1) {
        if (pc.canRangedAttack(enemy.location)) {
          pc.rangedAttack(enemy.location);
          return;
        }
      }
    }

    if (pc.getDelay() > 1) {
      return
    }

    // run to exit
    let toMove = pc.senseDirectionToExit()
    if (enemies.length > 0) {
      toMove = ourLoc.directionTo(enemies[0].location)
    }

    let idx = 0
    let done = false
    while (!done) {
      done = pc.canMove(toMove)
      done = done && !inPathToStart(ourLoc.add(toMove))

      idx += 1
      if (idx > 10) {
        done = true
      }

      if (!done) {
        toMove = toMove.rotateLeft()
      }
    }

    if (pc.canMove(toMove)) {
      addToPathStart(ourLoc.add(toMove))
      pc.move(toMove)
    }

    if (pc.getDelay() > 1) {
      return
    }

    idx = 0
    while (pc.getDelay() < 1 && idx < 16) {
      idx++
      const d = Direction.randomDirection()
      if (pc.canMove(d)) {
        pc.move(d)
      }
    }
  }
}

