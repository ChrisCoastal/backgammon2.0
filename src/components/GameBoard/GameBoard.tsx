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

interface ValidMoveState {
  dice: number
  roll: number
  point: number
  action: string
}

const GameBoard: FC = () => {
  const {
    stateSubscriber,
    reducer,
    // rollDiceHandler,
    getDiceRoll,
    initialMoves,
    possibleMoves,
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

  const rollDiceHandler = (activePlayer: ActivePlayer) => {
    const roll = getDiceRoll()
    const moves = initialMoves(roll)
    const possible = possibleMoves(activePlayer, roll)
  }

  const moveCheckerHandler = (
    dropPoint: number,
    item: { fromPoint: number; checkerColor: any }
  ) => {
    moveChecker(dropPoint, item)
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
