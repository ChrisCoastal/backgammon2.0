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
import Header from '../Header'

const Game: FC = ({}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_GAME_STATE)
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
    toggleActivePlayer(activePlayer, dispatch)

    // TODO:
    // push movesTaken
    // updateTurnHistory()
  }

  const startGameHandler: any = () => {
    const roll = getDiceRoll(dispatch)
    const player = initializeActivePlayer(roll, dispatch)
    console.log(activePlayer)

    if (!player) {
      return startGameHandler()
    }
    console.log('ACTIVE', player)

    const moves = playerTurnMoves(roll, dispatch)
  }

  const screenOrientation = `@media screen and (min-width: 200px) and (max-width: 780px) and (orientation: portrait) {
    h-[100vw]
  } max-h-screen
  `

  return (
    <div className={`w-full mx-auto`}>
      {/* <Header /> */}
      <div
        className={`flex ${screenOrientation} bg-gradient-to-tr from-[#1a065b] to-red-300`}
      >
        <GameBoard
          activePlayer={activePlayer}
          checkerPositions={state.checkerPositions}
          movement={state.movement}
          dispatch={dispatch}
        />
        <GameControls
          activePlayer={activePlayer}
          diceState={state.diceState}
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
