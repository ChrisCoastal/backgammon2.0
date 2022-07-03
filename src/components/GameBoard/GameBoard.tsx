import { FC, useReducer, useEffect, useRef, Dispatch } from 'react'

// types
import {
  ActiveChecker,
  ActivePlayer,
  BoardPositions,
  CheckerPositionsState,
  DiceRoll,
  MovementState,
  ReducerActions
} from 'src/@types/types'

// config
import {
  BOARD_COLORS,
  PLAYER_1_BAR,
  PLAYER_1_BEAROFF,
  PLAYER_1_HOME_LIMIT,
  PLAYER_2_BAR,
  PLAYER_2_BEAROFF,
  PLAYER_2_HOME_LIMIT
} from '../../utils/config'

// helpers
import {
  playerTurnMoves,
  getOpenPoints,
  getDiceRoll,
  getValidMoves,
  moveChecker,
  updateRemainingMoves,
  // getMoves,
  // checkMoves,
  isPlayerWinner
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
  movement: MovementState
  dispatch: Dispatch<ReducerActions>
}

const GameBoard: FC<GameBoardProps> = ({
  activePlayer,
  checkerPositions,
  roll,
  movement,
  dispatch
}) => {
  const dragCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: ActiveChecker }
  ) => {
    const valid = getValidMoves(
      dragItem,
      dropPoint,
      activePlayer,
      checkerPositions,
      movement.movesRemaining
    )

    return valid
  }

  // make sure to pass relavent state down to the useDrop hook
  const dropCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: ActiveChecker }
  ) => {
    console.log('drop')
    const openPoints = getOpenPoints(activePlayer, checkerPositions.board)
    moveChecker(dropPoint, dragItem, checkerPositions, openPoints, dispatch)
    updateRemainingMoves(dropPoint, dragItem, movement, dispatch)
    isPlayerWinner(checkerPositions, dispatch) &&
      console.log(`Player ${activePlayer} wins!`)

    // getOpenPoints(activePlayer, state.checkerPositions.board, dispatch)
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
          movesRemaining={movement.movesRemaining}
          board={checkerPositions.board[i]}
        >
          <Checkers pointIndex={i} checkers={checkerPositions.board[i]} />
        </BoardPoint>
      )
    }
    return pointArr
  }
  const points = renderPoints()

  return (
    <div
      className={`flex ${BOARD_COLORS.bar} justify-center p-16 w-full h-full`}
    >
      {/* <div className={`flex flex-col`}>
        <BearOff
          pointIndex={PLAYER_1_BEAROFF}
          validMoves={dragCheckerHandler}
          dropHandler={dropCheckerHandler}
          activePlayer={activePlayer}
          movesRemaining={movement.movesRemaining}
          board={checkerPositions.board}
        >
          <Checkers
            pointIndex={PLAYER_1_BEAROFF}
            checkers={checkerPositions.bearOff1}
          />
        </BearOff>
        <BearOff
          pointIndex={PLAYER_2_BEAROFF}
          validMoves={dragCheckerHandler}
          dropHandler={dropCheckerHandler}
          activePlayer={activePlayer}
          movesRemaining={movement.movesRemaining}
          board={checkerPositions.board}
        >
          <Checkers
            pointIndex={PLAYER_2_BEAROFF}
            checkers={checkerPositions.bearOff2}
          />
        </BearOff>
      </div> */}
      <div
        className={`grid grid-cols-[repeat(13,1fr)] w-full mx-16 items-stretch`}
      >
        {points}
      </div>
    </div>
  )
}

export default GameBoard
