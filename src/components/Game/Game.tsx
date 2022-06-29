// types
import type { ReactNode, FC } from 'react'
import { GameState, ReducerActions } from 'src/@types/types'

// config
import { INITIAL_TABLE_STATE } from 'src/utils/config'

// helpers
import {
  initializeActivePlayer,
  toggleActivePlayer,
  getDiceRoll
} from '../../utils/gameState'
import { reducer } from 'src/utils/reducer'

// hooks
import { useReducer } from 'react'

// components
import GameBoard from '../GameBoard/GameBoard'
import { getDialogUtilityClass } from '@mui/material'

interface GameProps {
  // children: ReactNode
}

const Game: FC<GameProps> = ({}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE)

  const { table, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // TODO: avoid if possible?
  const diceRollRef = useRef(state.diceState)

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

  const initGame = () => {
    if (!activePlayer) {
      const active = initializeActivePlayer(roll)
      active === 'DOUBLES' && getDiceRoll(dispatch)
      console.log('ACTIVE', active)
    }
  }

  const startGameHandler = () => {
    initGame()
  }

  return (
    <div>
      <GameBoard />
      {/* <StartGameButton /> */}
    </div>
  )
}

export default Game
