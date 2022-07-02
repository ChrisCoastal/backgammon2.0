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

    const openPoints = getOpenPoints(
      activePlayer,
      state.checkerPositions.board,
      dispatch
    )
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

    const openPoints = getOpenPoints(
      player,
      state.checkerPositions.board,
      dispatch
    )

    if (!player) {
      return startGameHandler()
    }
    console.log('ACTIVE', player)

    const moves = playerTurnMoves(roll, dispatch)
  }

  // TODO: add condition so end turn is required before roll
  const disable = state.movement.movesRemaining.length !== 0
  const rollButtonColor = disable
    ? 'bg-gray-300'
    : 'bg-blue-600 hover:bg-blue-700'
  const buttonColor = disable ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div>
      <GameBoard
        activePlayer={activePlayer}
        checkerPositions={state.checkerPositions}
        roll={diceRoll}
        movement={state.movement}
        endTurnHandler={endTurnHandler}
        dispatch={dispatch}
      />
      {/* <StartGameButton /> */}
      <div>
        <div>
          {/* {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />} */}
          <Dice
            diceRoll={state.diceState.diceRoll}
            activePlayer={activePlayer}
          />
          <button
            disabled={disable}
            onClick={rollDiceHandler}
            className={`py-2 px-6 m-2 rounded ${rollButtonColor} bg-g`}
          >
            ROLL
          </button>
        </div>
        <button
          disabled={disable}
          onClick={endTurnHandler}
          className={`py-2 px-6 m-2 rounded ${buttonColor}`}
        >
          END TURN
        </button>
        <button
          onClick={() => console.log('undo')}
          className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
        >
          UNDO
        </button>
        <button
          onClick={() => startGameHandler()}
          disabled={!!activePlayer}
          className={`py-2 px-6 m-2 rounded ${buttonColor}`}
        >
          START GAME
        </button>
        {/* <button
        onClick={() => endGameHandler}
        disabled={!!activePlayer}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        END GAME
      </button> */}
        {/* <GameOptions optionsHandler={optionsHandler} /> */}
      </div>
    </div>
  )
}

export default Game
