import { MapTileI, TileI } from 'src/types/raid-types/MapLocation'

// todo: figure out how to infer from when function is called
export const transpose2dArrays = (map: any[][]) => {
  const result: any[][] = []
  map.forEach((row, rowIdx) => {
    row.forEach((cell, columnIdx) => {
      result[columnIdx] = result[columnIdx] || []
      result[columnIdx][rowIdx] = cell
    })
  })

  return result
}
