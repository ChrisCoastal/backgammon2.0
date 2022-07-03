// types
import type { ReactNode, FC } from 'react'
import {
  GameState,
  ReducerActions,
  ActivePlayer,
  CheckerPositionsState
} from 'src/@types/types'

// config
import { INITIAL_GAME_STATE } from 'src/utils/config'

// helpers
import { reducer } from 'src/utils/reducer'
import {
  initializeActivePlayer,
  toggleActivePlayer,
  playerTurnMoves,
  // checkMoves,
  getValidMoves,
  getOpenPoints,
  moveChecker,
  updateRemainingMoves,
  getDiceRoll,
  resetDiceRoll
} from '../../utils/gameState'

// hooks
import { useReducer } from 'react'

// components
import GameBoard from '../GameBoard/GameBoard'
import Dice from '../Dice/Dice'
import GameControls from '../GameControls/GameControls'

const Game: FC = ({}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_GAME_STATE)

  const { board, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // const diceRollRef = useRef(roll)

  const rollDiceHandler = () => {
    const roll = getDiceRoll(dispatch)
    const moves = playerTurnMoves(roll, dispatch)
    // TODO: must check if there are any valid moves available
    // pass every activePlayer occupied point through getValidMoves

    // const openPoints = getOpenPoints(
    //   activePlayer,
    //   state.checkerPositions.board,
    //   dispatch
    // )
    // const allPossibleMoves = getMoves(
    //   moves,
    //   checkerPositions.board,
    //   activePlayer
    // )
    //
    // const valid = checkMoves(
    //   openPoints,
    //   state.checkerPositions.board,
    //   activePlayer,
    //   roll,
    //   dispatch
    // )
    // TODO: if valid returns no moves possible call endTurnHandler
    // const possible = possibleMoves(activePlayer, roll)
    // console.log(valid)
  }

  const endTurnHandler = () => {
    console.log('endturn')

    resetDiceRoll(dispatch)
    toggleActivePlayer(state.activePlayer, dispatch)

    // TODO:
    // push movesTaken
    // updateTurnHistory()
  }

  const startGameHandler: any = () => {
    const roll = getDiceRoll(dispatch)
    const player = initializeActivePlayer(roll, dispatch)
    console.log(activePlayer)

    // const openPoints = getOpenPoints(
    //   player,
    //   state.checkerPositions.board,
    //   dispatch
    // )

    if (!player) {
      return startGameHandler()
    }
    console.log('ACTIVE', player)

    const moves = playerTurnMoves(roll, dispatch)
  }

  return (
    <div className={``}>
      <div className={`flex justify-center h-screen`}>
        <GameBoard
          activePlayer={activePlayer}
          checkerPositions={state.checkerPositions}
          roll={diceRoll}
          movement={state.movement}
          dispatch={dispatch}
        />
        <GameControls
          activePlayer={activePlayer}
          diceRoll={diceRoll}
          movesRemaining={state.movement.movesRemaining}
          rollDiceHandler={rollDiceHandler}
          startGameHandler={startGameHandler}
          endTurnHandler={endTurnHandler}
        />
      </div>
    </div>
  )
}

export default Game
