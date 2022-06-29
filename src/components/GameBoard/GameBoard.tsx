import React, { FC, useReducer, useEffect, useRef } from 'react'

// types
import { TableState, ReducerActions, ActivePlayer } from 'src/@types/types'

// utils
import { INITIAL_POSITIONS, INITIAL_TABLE_STATE } from '../../utils/config'
import { gameLogic } from 'src/utils/gameState'

//components
import BoardPoint from '../BoardPoint/BoardPoint'
import Bar from '../Bar/Bar'
import Checkers from '../Checkers/Checkers'
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
    getDiceRoll,
    getOpenPoints,
    initialMoves,
    checkMoves,
    getMoves,
    isValidMoves,
    getValidMoves,
    updateRemainingMoves,
    moveChecker,
    toggleActivePlayer
  } = gameLogic

  const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE)

  const { table, bearOff1, bearOff2 } = state.checkerPositions
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

  const rollDiceHandler = () => {
    const roll = getDiceRoll()
    const moves = initialMoves(roll)
    // TODO: must check if there are any valid moves available
    // pass every activePlayer occupied point through getValidMoves
    if (!activePlayer) {
      const active = toggleActivePlayer(roll)
      active === 'doubles' && rollDiceHandler()
      console.log('ACTIVE', active)
    }
    const openPoints = getOpenPoints()
    const allPossibleMoves = getMoves(moves)
    //
    const valid = checkMoves(openPoints, roll as [number, number])
    // TODO: if valid returns no moves possible call endTurnHandler
    // const possible = possibleMoves(activePlayer, roll)
  }

  const dragCheckerHandler = (
    dropPoint: number,
    dragItem: { fromPoint: number; checkerColor: any }
  ) => {
    const valid = getValidMoves(dragItem, dropPoint)
    return valid
  }

  const dropCheckerHandler = (
    dropPoint: number,
    item: { fromPoint: number; checkerColor: any }
  ) => {
    moveChecker(dropPoint, item)
    updateRemainingMoves(dropPoint, item)
    getOpenPoints()
  }

  const endTurnHandler = () => {
    toggleActivePlayer()
    // TODO:
    // push movesTaken
    // updateTurnHistory()
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
          table={table}
        >
          <Checkers pointIndex={i} checkers={table[i]} />
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

  const disable = state.movement.movesRemaining.length !== 0
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
        {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />}
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
