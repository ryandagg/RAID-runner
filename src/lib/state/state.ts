import { PlayerStateI } from 'src/types/PlayerState'
import produce, {Draft} from 'immer'

let state: PlayerStateI

export const getState = () => state

export const setState = (setter: (draft: Draft<PlayerStateI>) => void) => {
  state = produce(
    getState() || ({} as PlayerStateI),
    draft => setter(draft),
  )
}
