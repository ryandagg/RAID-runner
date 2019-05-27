import {getState, setState} from 'src/lib/state/state'
import {clone} from 'ramda'
import { getMapMaxX, getMapMaxY, getPlayerInfo } from 'src/lib/state/getters'
import { MapTileI, TileI } from 'src/types/raid-types/MapLocation'
import { setMap } from 'src/lib/state/setters'


export const isPlayerLocation = (loc: TileI) => {
  const {location} = getPlayerInfo()
  return loc.x === location.x && loc.y === location.y
}

// todo: this is fucked and I don't see how
const expandMap = (map: MapTileI[][], maxX: number, maxY: number): MapTileI[][] => {
  let newMap = clone(map)
  for (let y = 0; y <= maxY; y++) {
    const row = map[y] || []
    for (let x = 0; x <= maxX; x++) {
      const tile = row[y] || {x, y, passable: true}
      row.push(tile)
    }
    newMap.push(row)
  }
  return newMap
}

// row is y, column is x
export const updateMap = () => {
  const {map, playerController} = getState()
  console.log('oldMap: ', map)
  const player = getPlayerInfo()
  const {location, sensorRadiusSquared} = player
  const visionMax = Math.sqrt(sensorRadiusSquared)
  let newMap = clone(map) as MapTileI[][]
  const maxX = Math.max(getMapMaxX(), visionMax + location.x + 1)
  const maxY = Math.max(getMapMaxY(), visionMax + location.y + 1)
  const minX = maxX - visionMax - 1
  const minY = maxY - visionMax - 1

  if (maxX > getMapMaxX() || maxY > getMapMaxY()) {
    newMap = expandMap(newMap, maxX, maxY)
  }

  for (let y = minY; y <= maxY; y++) {
    const row = newMap[y] || []
    for (let x = minX; x <= maxX; x++) {
      if (playerController.canSense({x, y})) {
        const tile = row[y] || {x, y, passable: true}
        tile.passable = playerController.senseIfPassable({x, y})
        if (!isPlayerLocation({x, y})) {
          tile.enemy = playerController.senseUnitAtLocation({x, y})
        } else {
          tile.enemy = undefined
        }
        row[y] = tile
      }
    }
    newMap[y] = row
  }

  console.log('newMap: ', newMap)
  setMap(newMap)
}
