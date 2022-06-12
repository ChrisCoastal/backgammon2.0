import { TableState, ReducerActions } from '../@types/types'

import { INITIAL_TABLE_STATE } from './config'

export function reducer(state: TableState, action: ReducerActions): TableState {
  const { type, payload } = action

  switch (type) {
    case 'setActivePlayer':
      return { ...state, activePlayer: payload }
    case 'setDiceRoll':
      return {
        ...state,
        diceState: { ...state.diceState, diceRoll: payload }
      }
    case 'showValidMoves':
      return {
        ...state,
        movement: {
          ...state.movement,
          validMoves: payload ? payload : null
        }
      }

    case 'setMove':
      return { ...state, checkerPositions: payload }
    case 'setDoublingCube':
      return {
        ...state,
        diceState: {
          ...state.diceState,
          doublingCube: state.diceState.doublingCube * 2
        }
      }

    case 'reset':
      return INITIAL_TABLE_STATE
    default:
      return state
  }
}
