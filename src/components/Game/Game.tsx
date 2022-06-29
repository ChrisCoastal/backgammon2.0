// Types
import type { ReactNode, FC } from 'react'
import { TableState, ReducerActions } from 'src/@types/types'

// Config
import { INITIAL_TABLE_STATE } from 'src/utils/config'

// Helpers
import { toggleActivePlayer } from '../../utils/gameState'

// Hooks
import { useReducer } from 'react'

// Components
import GameBoard from '../GameBoard/GameBoard'

interface GameProps {
  // children: ReactNode
}

const Game: FC<GameProps> = ({}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE)

  // Reducer function
  function reducer(state: TableState, action: ReducerActions): TableState {
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
        return INITIAL_TABLE_STATE
      default:
        return state
    }
  }

  const { table, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // TODO: avoid if possible?
  const diceRollRef = useRef(state.diceState)

  useEffect(() => {
    // pass state updates to gameState.ts
    stateSubscriber(state, dispatch)
    // ensures current diceState
    diceRollRef.current = state.diceState
  }, [state])

  const rollDiceHandler = () => {
    const roll = getDiceRoll()
    const moves = initialMoves(roll)
    // TODO: must check if there are any valid moves available
    // pass every activePlayer occupied point through getValidMoves
    if (!activePlayer) {
      const active = toggleActivePlayer(roll)
      active === 'doubles' && rollDiceHandler()
      console.log('ACTIVE', active)
    }
    const openPoints = getOpenPoints()
    const allPossibleMoves = getMoves(moves)
    //
    const valid = checkMoves(openPoints, roll as [number, number])
    // TODO: if valid returns no moves possible call endTurnHandler
    // const possible = possibleMoves(activePlayer, roll)
  }

  const dragCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => {
    const valid = getValidMoves(dragItem, dropPoint)
    return valid
  }

  const dropCheckerHandler = (
    dropPoint: number,
    item: { fromPoint: number; checkerColor: any }
  ) => {
    moveChecker(dropPoint, item)
    updateRemainingMoves(dropPoint, item)
    getOpenPoints()
  }

  const endTurnHandler = () => {
    toggleActivePlayer()
    // TODO:
    // push movesTaken
    // updateTurnHistory()
  }

  return (
    <div>
      <GameBoard />
    </div>
  )
}

export default Game
