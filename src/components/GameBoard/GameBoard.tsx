import React, { FC, useReducer, useEffect, useRef } from 'react'

// types
import { TableState, ReducerActions, ActivePlayer } from 'src/@types/types'

// utils
import { INITIAL_POSITIONS, INITIAL_TABLE_STATE } from '../../utils/config'
import { gameLogic } from 'src/utils/gameState'

//components
import BoardPoint from '../BoardPoint/BoardPoint'
import Checker from '../Checker/Checker'
import Dice from '../Dice/Dice'
// import GameOptions from '../GameOptions/GameOptions'

// interface tableState {
//   gameHistory: {}[]
//   checkerPositions: CheckerPositionsState
//   activePlayer: 1 | 2 | null
//   diceState: { diceRoll: number[]; doublingCube: number }
//   movement: {
//     validMoves: ValidMoveState[] | null
//     movesTaken: number[]
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
//     movesTaken: []
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
    // rollDiceHandler,
    getDiceRoll,
    moveCombinations,
    openPoints,
    getValidMoves,
    validMoves,
    updateRemainingMoves,
    moveChecker
  } = gameLogic

  const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE)

  const { table, bar, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // TODO: avoid if possible?
  const diceRollRef = useRef(state.diceState)

  useEffect(() => {
    // pass state updates to gameState.ts
    stateSubscriber(state, dispatch)
    // ensures current diceState
    diceRollRef.current = state.diceState
  }, [state])

  // const getValidMoves = (
  //   dropPoint: number,
  //   dragItem: { fromPoint: number; checkerColor: any }
  // ) => {
  //   console.log('MOVEMENT', state.movement)

  //   const points = openPoints(table, activePlayer)
  //   const { diceRoll } = diceRollRef.current
  //   const availableMoves = moveCombinations(diceRoll, activePlayer)
  //   // console.log(availableMoves, state.movement.movesRemaining)
  //   // TODO: pass availableRoll
  //   const valid = validMoves(points, dragItem, availableMoves, activePlayer)

  //   console.log(valid)

  //   // TODO:
  //   console.log(
  //     !!valid
  //       ?.map((move) => move.action !== 'closed' && move.point)
  //       .includes(dropPoint)
  //   )

  //   return !!valid
  //     ?.map((move) => move.action !== 'closed' && move.point)
  //     .includes(dropPoint)
  //   // return valid?.point.includes(dropPoint)
  // }

  const rollDiceHandler = (
    activePlayer: ActivePlayer
    // dispatch: React.Dispatch<ReducerActions>
  ) => {
    const [die1, die2] = getDiceRoll()
    const roll = !activePlayer
      ? [die1, 0, 0, die2]
      : activePlayer === 1
      ? [die1, die2, 0, 0]
      : [0, 0, die1, die2] // ∴ activePlayer === 2

    const moves = moveCombinations([die1, die2], activePlayer)

    dispatch({
      type: 'setDice',
      payload: { roll: roll }
    })
    // FIXME: need to correct the payload object
    dispatch({ type: 'setMovesRemaining', payload: moves })
  }

  const moveCheckerHandler = (
    dropPoint: number,
    item: { fromPoint: number; checkerColor: any }
  ) => {
    // event.preventDefault()
    // event.stopPropagation()
    // console.log(event)

    moveChecker(dropPoint, item)
    // FIXME:
    updateRemainingMoves(dropPoint, item.fromPoint)
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
          activePlayer={activePlayer}
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
          onClick={() => rollDiceHandler(activePlayer)}
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
