import {DirectionI, PlayerControllerI, UnitInfoI} from 'src/types/raid-types/RaidTypes'
import { getPlayerController, inMovementHistory } from 'src/lib/state/getters'
import { addToMovementHistory, setPlayerController } from 'src/lib/state/setters'
import { getState, setState } from 'src/lib/state/state'
import { updateMap } from 'src/lib/map'
import { getBestAttack } from 'src/lib/attackSelector'
import { selectMove } from 'src/lib/movement'

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
      state.movementHistory = []
    })
  }

  act() {
    /***
     * TODO:
     * attack based on max damage calculation
     * left/right hand rule to minimize enemy exposure
     * notate defensible positions to retreat to
     * chase spawners and then retreat to last wall for main navigation pathing
     * run to exit after/before all enemies killed?
     * handle alerted monsters outside of ranged attack range
     * determine when to avoid alerting a monster
     ***/

    // update pc to immutable state
    setPlayerController(this.pc)
    updateMap()
    const pc = getPlayerController()
    const ourLoc = pc.getCurrentLocation()
    const enemies = pc.senseNearbyUnits()
    const player = pc.getMyInfo()
    const {movementHistory} = getState()
    // seed movementHistory with initial location
    if (!movementHistory.length) addToMovementHistory(player.location)

   const possibleAttack = getBestAttack()
    if (possibleAttack) {
      possibleAttack.attackFunc.bind(pc)(possibleAttack.location)
      return
    }

    if (pc.getDelay() > 1) {
      return
    }

    // heal
    if ((player.maxHp - player.hp) > (player.healPower / 2)) {
      // todo: consider getGameRound vs getGameRoundLimit and if worth doing when enemies visible
      pc.heal()
    }

    const didMove = selectMove()
    if (didMove) {
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
      done = done && !inMovementHistory(ourLoc.add(toMove))

      idx += 1
      if (idx > 10) {
        done = true
      }

      if (!done) {
        toMove = toMove.rotateLeft()
      }
    }

    if (pc.canMove(toMove)) {
      addToMovementHistory(ourLoc.add(toMove))
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

