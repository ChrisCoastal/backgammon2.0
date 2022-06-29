import { FC, useReducer, useEffect, useRef, Dispatch } from 'react'

// types
import {
  ActivePlayer,
  CheckerPositions,
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
  initialMoves,
  getOpenPoints,
  getDiceRoll,
  getMoves,
  checkMoves
} from 'src/utils/gameState'

//components
import BoardPoint from '../BoardPoint/BoardPoint'
import Bar from '../Bar/Bar'
import Checkers from '../Checkers/Checkers'
import Checker from '../Checker/Checker'
import Dice from '../Dice/Dice'

interface GameBoardProps {
  activePlayer: ActivePlayer
  boardPositions: CheckerPositions
  roll: [number, number]
  movesRemaining: number[]
  dragCheckerHandler: () => boolean
  dropCheckerHandler: () => void
  endTurnHandler: () => void
  dispatch: Dispatch<ReducerActions>
}

const GameBoard: FC<GameBoardProps> = ({
  activePlayer,
  boardPositions,
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
    const moves = initialMoves(roll, dispatch)
    // TODO: must check if there are any valid moves available
    // pass every activePlayer occupied point through getValidMoves

    const openPoints = getOpenPoints(activePlayer, boardPositions, dispatch)
    const allPossibleMoves = getMoves(moves)
    //
    const valid = checkMoves(openPoints, roll as [number, number])
    // TODO: if valid returns no moves possible call endTurnHandler
    // const possible = possibleMoves(activePlayer, roll)
  }

  const isCheckersBar = () => {
    const bar = activePlayer === 1 ? PLAYER_1_BAR : PLAYER_2_BAR
    // check for checkers on bar
    if (boardPositions[bar].length === 0)
      return { isCheckers: false, point: bar }
    return { isCheckers: true, point: bar }
  }

  const isCheckersHome = () => {
    const home = activePlayer === 1 ? PLAYER_1_HOME_LIMIT : PLAYER_2_HOME_LIMIT
    return (
      boardPositions.filter((point, i) =>
        activePlayer === 1
          ? i > PLAYER_1_HOME_LIMIT && !point.includes(1)
          : i > PLAYER_2_HOME_LIMIT && !point.includes(2)
      ).length > 0
    )
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
          board={boardPositions}
        >
          <Checkers pointIndex={i} checkers={boardPositions[i]} />
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
      <div>
        <div className={`flex`}>{points}</div>
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
