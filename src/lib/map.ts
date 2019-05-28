import {getState} from 'src/lib/state/state'
import {clone} from 'ramda'
import { getPlayerInfo } from 'src/lib/state/getters'
import { MapTileI, TileI } from 'src/types/raid-types/MapLocation'
import { setMap } from 'src/lib/state/setters'


export const isPlayerLocation = (loc: TileI) => {
  const {location} = getPlayerInfo()
  return loc.x === location.x && loc.y === location.y
}

const drawMap = (map: MapTileI[][]) => {
  let result = ''
  const {location} = getPlayerInfo()
  map.forEach((row) => {
    row.forEach((cell) => {
      if (cell.x === location.x && cell.y === location.y) {
        result += '@'
      } else if (cell.enemy) {
        result += 'X'
      } else if (!cell.sensed) {
        result += '?'
      } else if (!cell.passable) {
        result += '#'
      } else {
        result += ' '
      }
    })
    result += '\n'
  })
  console.log(result)
  return result
}

// row is y, column is x
export const updateMap = () => {
  const {map, playerController} = getState()
  const player = getPlayerInfo()
  const {location, sensorRadiusSquared} = player
  const visionMax = Math.sqrt(sensorRadiusSquared)
  const rowLength = map.length
  const columnLength = (map[0] || []).length
  const maxX = Math.max(columnLength, visionMax + location.x + 1)
  const maxY = Math.max(rowLength, visionMax + location.y + 1)

  let newMap = clone(map) as MapTileI[][]

  for (let rowIdx = 0; rowIdx < maxY; rowIdx++) {

    const row = newMap[rowIdx] || []
    for (let columnIdx = 0; columnIdx < maxX; columnIdx++) {

      const coordinates = {y: rowIdx, x: columnIdx}
      const tile = row[columnIdx] || {...coordinates, passable: false, sensed: false}
      // delete tile.enemy // remove enemy because it might have moved

      if (playerController.canSense(coordinates)) {
        tile.sensed = true
        tile.passable = playerController.senseIfPassable(coordinates)
        if (!isPlayerLocation(coordinates)) {
          tile.enemy = playerController.senseUnitAtLocation(coordinates)
        } else {
          tile.enemy = undefined
        }
      }
      row[columnIdx] = tile
    }
    newMap[rowIdx] = row
  }

  console.log('newMap: ')
  drawMap(newMap)

  // const wrongLength = newMap.find(row => row.length !== newMap[0].length)
  // if (wrongLength) {
  //   console.log('wrongLength: ', wrongLength)
  //   throw new Error(' expandMap is fucked')
  // }
  setMap(newMap)
}
