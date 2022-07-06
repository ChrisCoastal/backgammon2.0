import { FC, Dispatch } from 'react'

// types
import {
  ActiveChecker,
  ActivePlayer,
  CheckerPositionsState,
  MovementState,
  ReducerActions
} from 'src/@types/types'

// config
import {
  BOARD_COLORS,
  PLAYER_1_BEAROFF,
  PLAYER_2_BEAROFF
} from '../../utils/config'

// helpers
import {
  getOpenPoints,
  isCheckersHome,
  getValidMoves,
  getValidHomeMoves,
  moveChecker,
  updateRemainingMoves,
  isPlayerWinner
} from 'src/utils/gameState'

//components
import BoardPoint from '../BoardPoint/BoardPoint'
import BearOff from '../BearOff/BearOff'
import Checkers from '../Checkers/Checkers'

interface GameBoardProps {
  activePlayer: ActivePlayer
  checkerPositions: CheckerPositionsState
  movement: MovementState
  dispatch: Dispatch<ReducerActions>
}

const GameBoard: FC<GameBoardProps> = ({
  activePlayer,
  checkerPositions,
  movement,
  dispatch
}) => {
  const dragCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: ActiveChecker }
  ) => {
    // all checkers in homeboard
    const home = isCheckersHome(activePlayer, checkerPositions.board)

    const valid = !home
      ? getValidMoves(
          dragItem,
          dropPoint,
          activePlayer,
          checkerPositions,
          movement.movesRemaining
        )
      : getValidHomeMoves(
          dragItem,
          dropPoint,
          activePlayer,
          checkerPositions,
          movement.movesRemaining
        )

    return valid
  }

  // pass ALL relevant state dependencies down to the useDrop hook
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
  }

  const renderPoints = () => {
    const pointArr = []
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
    <div className={`flex ${BOARD_COLORS.bar} justify-center w-3/4`}>
      <div className={` grid grid-cols-[repeat(14,1fr)] `}>
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
        {points}
      </div>
    </div>
  )
}

export default GameBoard
