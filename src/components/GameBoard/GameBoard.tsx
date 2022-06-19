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
    getDiceRoll,
    initialMoves,
    getValidMoves,
    updateRemainingMoves,
    moveChecker,
    toggleActivePlayer
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

  const rollDiceHandler = () => {
    const roll = getDiceRoll()
    const moves = initialMoves(roll)
    if (!activePlayer) {
      const active = toggleActivePlayer(roll)
      active === 'doubles' && rollDiceHandler()
      console.log('ACTIVE', active)
    }
    // const possible = possibleMoves(activePlayer, roll)
    console.log(state.activePlayer)
  }

  const dropCheckerHandler = (
    dropPoint: number,
    item: { fromPoint: number; checkerColor: any }
  ) => {
    moveChecker(dropPoint, item)
    updateRemainingMoves(dropPoint, item.fromPoint)
  }

  const endTurnHandler = () => {
    toggleActivePlayer()
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
          dropHandler={dropCheckerHandler}
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

  const disable = state.movement.movesRemaining.length !== 0
  const rollButtonColor = disable
    ? 'bg-gray-300'
    : 'bg-blue-600 hover:bg-blue-700'
  const buttonColor = disable ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div>
      <div className={`flex`}>{points}</div>
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
