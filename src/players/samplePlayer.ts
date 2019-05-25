// export function SamplePlayer(playerController) {
//   this.pc = playerController;
//   const loc = this.pc.getCurrentLocation();
//   this.tail = [loc, loc, loc, loc];
//   this.tailIDX = 0;
// }
//
// SamplePlayer.prototype = {
//   act: function() {
//     let i, e;
//     const ourLoc = this.pc.getCurrentLocation();
//     const enemies = this.pc.senseNearbyUnits();
//
//     const spawners = enemies.filter(function (e) {
//       return e.spawnedUnitType;
//     });
//
//     for (i = 0; i < spawners.length; i++) {
//       e = spawners[i];
//       if (e.hp > 1) {
//         if (this.pc.canRangedAttack(e.location)) {
//           this.pc.rangedAttack(e.location);
//           return;
//         }
//       }
//
//     }
//
//
//     for (i = 0; i < enemies.length; i++) {
//       e = enemies[i];
//       if (e.location.isAdjacentTo(ourLoc) && e.hp > 1) {
//         if (this.pc.canMeleeAttack(e.location)) {
//           this.pc.meleeAttack(e.location);
//           return;
//         }
//       }
//     }
//
//
//     for (i = 0; i < enemies.length; i++) {
//       e = enemies[i];
//       if (e.hp > 1) {
//         if (this.pc.canRangedAttack(e.location)) {
//           this.pc.rangedAttack(e.location);
//           return;
//         }
//       }
//
//     }
//
//     for (i = 0; i < enemies.length; i++) {
//       e = enemies[i];
//       if (this.pc.canMagicAttack(e.location)) {
//         this.pc.magicAttack(e.location);
//         return;
//       }
//     }
//
//     if (this.pc.getDelay() > 1) {
//       return;
//     }
//
//
//     let toMove = this.pc.senseDirectionToExit();
//     if (enemies.length > 0) {
//       toMove = ourLoc.directionTo(enemies[0].location);
//     }
//
//
//
//     const idx = 0;
//     const done = false;
//     while (!done) {
//       done = this.pc.canMove(toMove);
//       done = done && !this.inTail(ourLoc.add(toMove));
//
//       idx += 1;
//       if (idx > 10) {
//         done = true;
//       }
//
//       if (!done) {
//         toMove = toMove.rotateLeft();
//       }
//     }
//
//
//     if (this.pc.canMove(toMove)) {
//       this.addToTail(ourLoc.add(toMove));
//       this.pc.move(toMove);
//     }
//
//
//     if (this.pc.getDelay() > 1) {
//       return;
//     }
//
//     idx = 0;
//     while (this.pc.getDelay() < 1 && idx < 16) {
//       idx++;
//       const d = Direction.randomDirection();
//       if (this.pc.canMove(d)) {
//         this.pc.move(d);
//       }
//     }
//   },
//   addToTail: function(loc) {
//     this.tail[this.tailIDX] = loc;
//     this.tailIDX += 1;
//     this.tailIDX = this.tailIDX % this.tail.length;
//   },
//   inTail: function(loc) {
//     return this.tail.filter(
//       function (l) {
//         return l.equals(loc);
//       }
//     ).length > 0;
//   }
// };
