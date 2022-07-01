import { FC, useReducer, useEffect, useRef, Dispatch } from 'react'

// types
import {
  ActivePlayer,
  BoardPositions,
  CheckerPositionsState,
  DiceRoll,
  ReducerActions
} from 'src/@types/types'

// config
import {
  PLAYER_1_BAR,
  PLAYER_1_HOME_LIMIT,
  PLAYER_2_BAR,
  PLAYER_2_HOME_LIMIT
} from '../../utils/config'

// helpers
import {
  playerTurnMoves,
  getOpenPoints,
  getDiceRoll,
  // getMoves,
  checkMoves
} from 'src/utils/gameState'

//components
import BoardPoint from '../BoardPoint/BoardPoint'
import BearOff from '../BearOff/BearOff'
import Checkers from '../Checkers/Checkers'
import Checker from '../Checker/Checker'
import Dice from '../Dice/Dice'

interface GameBoardProps {
  activePlayer: ActivePlayer
  checkerPositions: CheckerPositionsState
  roll: DiceRoll
  movesRemaining: number[]
  dragCheckerHandler: (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => boolean
  dropCheckerHandler: (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => void
  endTurnHandler: () => void
  dispatch: Dispatch<ReducerActions>
}

const GameBoard: FC<GameBoardProps> = ({
  activePlayer,
  checkerPositions,
  roll,
  movesRemaining,
  dragCheckerHandler,
  dropCheckerHandler,
  endTurnHandler,
  dispatch
}) => {
  const diceRollRef = useRef(roll)

  const rollDiceHandler = () => {
    const roll = getDiceRoll(dispatch)
    const moves = playerTurnMoves(roll, dispatch)
    // TODO: must check if there are any valid moves available
    // pass every activePlayer occupied point through getValidMoves

    const openPoints = getOpenPoints(
      activePlayer,
      checkerPositions.board,
      dispatch
    )
    // const allPossibleMoves = getMoves(
    //   moves,
    //   checkerPositions.board,
    //   activePlayer
    // )
    //
    const valid = checkMoves(
      openPoints,
      checkerPositions.board,
      activePlayer,
      roll,
      dispatch
    )
    // TODO: if valid returns no moves possible call endTurnHandler
    // const possible = possibleMoves(activePlayer, roll)
    console.log(valid)
  }

  // {/* <div className={`h-full w-full flex flex-wrap`}>{points}</div> */}

  const renderPoints = () => {
    const pointArr = []
    // TODO: change to render bar
    for (let i = 0; i < 26; i++) {
      pointArr.push(
        <BoardPoint
          key={i}
          pointIndex={i}
          validMoves={dragCheckerHandler}
          dropHandler={dropCheckerHandler}
          activePlayer={activePlayer}
          movesRemaining={movesRemaining}
          board={checkerPositions.board}
        >
          <Checkers pointIndex={i} checkers={checkerPositions.board[i]} />
          {/* {table[i].map((checker, checkerIndex) => {
            return (
              checker && (
                <Checker
                  key={`checker ${i + Math.random()}`}
                  point={i}
                  checkerColor={checker}
                />
              )
            )
          })} */}
        </BoardPoint>
      )
    }
    return pointArr
  }
  const points = renderPoints()

  const disable = movesRemaining.length !== 0
  const rollButtonColor = disable
    ? 'bg-gray-300'
    : 'bg-blue-600 hover:bg-blue-700'
  const buttonColor = disable ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div>
      <div className={`flex`}>
        <BearOff
          pointIndex={1}
          validMoves={dragCheckerHandler}
          dropHandler={dropCheckerHandler}
          activePlayer={activePlayer}
          movesRemaining={movesRemaining}
          board={checkerPositions.board}
        ></BearOff>
        <div className={`flex`}>{points}</div>
        <BearOff
          pointIndex={2}
          validMoves={dragCheckerHandler}
          dropHandler={dropCheckerHandler}
          activePlayer={activePlayer}
          movesRemaining={movesRemaining}
          board={checkerPositions.board}
        ></BearOff>
      </div>
      <div>
        {/* {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />} */}
        <Dice diceRoll={roll} activePlayer={activePlayer} />
        <button
          disabled={disable}
          onClick={() => rollDiceHandler()}
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
      {/* <button
        onClick={() => console.log('undo')}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        UNDO
      </button>
      <button
        onClick={() => startGameHandler()}
        disabled={!!activePlayer}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        START GAME
      </button>
      <button
        onClick={() => endGameHandler}
        disabled={!!activePlayer}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        END GAME
      </button> */}
      {/* <GameOptions optionsHandler={optionsHandler} /> */}
    </div>
  )
}

export default GameBoard
