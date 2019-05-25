import { DirectionInterface, PlayerControllerInterface} from './types/raid-types'

declare const Direction: DirectionInterface

function RaidPlayer(playerController: PlayerControllerInterface) {
  this.pc = playerController;
}

RaidPlayer.prototype = {
  act: function() {
    const direction = Direction.randomDirection()
    if (this.pc.canMove(direction)) {
      this.pc.move(direction);
      return;
    }
  }
};

