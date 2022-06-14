import React, { FC, useReducer, useEffect, useRef } from 'react'

// types
import { TableState, ReducerActions } from 'src/@types/types'

// utils
import { INITIAL_POSITIONS, INITIAL_TABLE_STATE } from '../../utils/config'
import { gameLogic } from 'src/utils/gameState'

//components
import BoardPoint from '../BoardPoint/BoardPoint'
import Checker from '../Checker/Checker'
import Dice from '../Dice/Dice'
import GameOptions from '../GameOptions/GameOptions'

// interface tableState {
//   gameHistory: {}[]
//   checkerPositions: CheckerPositionsState
//   activePlayer: 1 | 2 | null
//   diceState: { diceRoll: number[]; doublingCube: number }
//   movement: {
//     validMoves: ValidMoveState[] | null
//     takenMoves: number[]
//   }
// }

// const INITIAL_TABLE_STATE: TableState = {
//   gameHistory: [],
//   checkerPositions: {
//     table: INITIAL_POSITIONS,
//     bar: [],
//     bearOff1: [],
//     bearOff2: []
//   },
//   activePlayer: null,
//   diceState: {
//     diceRoll: [0, 0, 0, 0],
//     doublingCube: 1
//   },
//   movement: {
//     validMoves: null,
//     takenMoves: []
//   }
// }

interface ValidMoveState {
  dice: number
  roll: number
  point: number
  action: string
}

type DropState = ValidMoveState[]

// interface ReducerActions {
//   type:
//     | 'setActivePlayer'
//     | 'setDiceRoll'
//     | 'setMove'
//     | 'showValidMoves'
//     | 'setDoublingCube'
//     | 'reset'
//   payload?: any
// }

const GameBoard: FC = () => {
  const {
    stateSubscriber,
    reducer,
    diceRollHandler,
    diceCombinations,
    openPoints,
    validMoves,
    moveChecker
  } = gameLogic

  const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE)

  const { table, bar, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // TODO: avoid if possible
  const diceRollRef = useRef(state.diceState)

  useEffect(() => {
    // pass state updates to gameState.ts
    stateSubscriber(state)
    // ensures current diceState
    diceRollRef.current = state.diceState
  }, [state])

  const getValidMoves = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => {
    const points = openPoints(table, activePlayer)
    const availableMoves = diceCombinations(
      diceRollRef.current.diceRoll,
      activePlayer
    )
    console.log(availableMoves)

    const valid = validMoves(points, dragItem, availableMoves, activePlayer)

    console.log(valid)

    // TODO:
    return !!valid
      ?.map((move) => move.action !== 'closed' && move.point)
      .includes(dropPoint)
    // return valid?.point.includes(dropPoint)
  }

  const moveCheckerHandler = (
    dropPoint: number,
    item: { fromPoint: number; checkerColor: any }
  ) => {
    // event.preventDefault()
    // event.stopPropagation()
    // console.log(event)

    moveChecker(dispatch, dropPoint, item)
  }

  // {/* <div className={`h-full w-full flex flex-wrap`}>{points}</div> */}

  const renderPoints = () => {
    const pointArr = []
    for (let i = 0; i < 24; i++) {
      pointArr.push(
        <BoardPoint
          key={i}
          pointIndex={i}
          validMoves={getValidMoves}
          dropHandler={moveCheckerHandler}
        >
          {table[i].map(
            (checker) =>
              checker && (
                <Checker
                  key={`checker ${i + Math.random()}`}
                  point={i}
                  checkerColor={checker}
                  activePlayer={activePlayer}
                />
              )
          )}
        </BoardPoint>
      )
    }
    return pointArr
  }
  const points = renderPoints()

  return (
    <div>
      <div className={`flex`}>{points}</div>
      <div>
        {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />}
        <button
          onClick={() => diceRollHandler(activePlayer, dispatch)}
          className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
        >
          ROLL
        </button>
      </div>
      {/* <button
        onClick={() => console.log('undo')}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        UNDO
      </button>
      <button
        onClick={endTurnHandler}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        END TURN
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
