// types
import type { ReactNode, FC } from 'react'
import { GameState, ReducerActions } from 'src/@types/types'

// config
import { INITIAL_GAME_STATE } from 'src/utils/config'

// helpers
import {
  initializeActivePlayer,
  toggleActivePlayer,
  getValidMoves,
  getOpenPoints,
  moveChecker,
  updateRemainingMoves,
  getDiceRoll
} from '../../utils/gameState'
import { reducer } from 'src/utils/reducer'

// hooks
import { useReducer, useRef } from 'react'

// components
import GameBoard from '../GameBoard/GameBoard'

interface GameProps {
  // children: ReactNode
}

const Game: FC<GameProps> = ({}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_GAME_STATE)

  const { board, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // TODO: avoid if possible?
  const diceRollRef = useRef(state.diceState.diceRoll)

  // useEffect(() => {
  //   // pass state updates to gameState.ts
  //   stateSubscriber(state, dispatch)
  //   // ensures current diceState
  //   diceRollRef.current = state.diceState
  // }, [state])

  const dragCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => {
    const valid = getValidMoves(
      dragItem,
      dropPoint,
      activePlayer,
      state.checkerPositions,
      state.movement
    )
    console.log(valid)

    return valid
  }

  const dropCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => {
    console.log('drop')

    moveChecker(dropPoint, dragItem, state.checkerPositions, dispatch)
    updateRemainingMoves(dropPoint, dragItem, state.movement, dispatch)
    getOpenPoints(activePlayer, state.checkerPositions.board, dispatch)
  }

  const endTurnHandler = () => {
    toggleActivePlayer(state.activePlayer, dispatch)
    // TODO:
    // push movesTaken
    // updateTurnHistory()
  }

  const initGame = () => {
    const roll = getDiceRoll(dispatch)
    if (!activePlayer) {
      const active = initializeActivePlayer(roll, dispatch)
      active === 'DOUBLES' && getDiceRoll(dispatch)
      console.log('ACTIVE', active)
    }
  }

  const startGameHandler = () => {
    initGame()
  }

  return (
    <div>
      <GameBoard
        activePlayer={activePlayer}
        checkerPositions={state.checkerPositions}
        roll={diceRoll}
        movesRemaining={state.movement.movesRemaining}
        dragCheckerHandler={dragCheckerHandler}
        dropCheckerHandler={dropCheckerHandler}
        endTurnHandler={endTurnHandler}
        dispatch={dispatch}
      />
      {/* <StartGameButton /> */}
    </div>
  )
}

export default Game
