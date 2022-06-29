// Types
import { GameState, ReducerActions } from 'src/@types/types'

// Config
import { INITIAL_GAME_STATE } from 'src/utils/config'

export function reducer(state: GameState, action: ReducerActions): GameState {
  const { type, payload } = action

  switch (type) {
    case 'setActivePlayer':
      return { ...state, activePlayer: payload }
    case 'setDice':
      return {
        ...state,
        diceState: {
          ...state.diceState,
          diceRoll: payload.roll
        }
      }
    case 'setOpenPoints':
      return {
        ...state,
        checkerPositions: {
          ...state.checkerPositions,
          openPoints: payload
        }
      }
    case 'setValidMoves':
      return {
        ...state,
        movement: {
          ...state.movement,
          validMoves: payload
        }
      }
    case 'setMovesRemaining':
      return {
        ...state,
        movement: {
          ...state.movement,
          movesRemaining: payload.movesRemaining,
          // FIXME: spreads to undefined on first pass
          movesTaken: [...state.movement.movesTaken, payload.movesTaken]
        }
      }
    // case 'setMovesPossible':
    //   return {
    //     ...state,
    //     movement: {
    //       ...state.movement,
    //       movesPossible: payload
    //     }
    //   }
    // case 'showValidMoves':
    //   return {
    //     ...state,
    //     movement: {
    //       ...state.movement,
    //       validMoves: payload ? payload : null
    //     }
    //   }

    case 'setCheckerPosition':
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
      return INITIAL_GAME_STATE
    default:
      return state
  }
}
