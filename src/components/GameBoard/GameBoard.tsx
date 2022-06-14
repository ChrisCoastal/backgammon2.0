import React, { FC, useReducer, useEffect } from 'react'

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
    moveCheckerHandler
  } = gameLogic
  const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE)

  const { table, bar, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  useEffect(() => {
    stateSubscriber(state, dispatch)
  })
  // const [state, dispatch] = useReducer(reducer, INITIAL_TABLE_STATE, init)

  // function reducer(state: TableState, action: ReducerActions): TableState {
  //   const { type, payload } = action

  //   switch (type) {
  //     case 'setActivePlayer':
  //       return { ...state, activePlayer: payload }
  //     case 'setDiceRoll':
  //       return {
  //         ...state,
  //         diceState: { ...state.diceState, diceRoll: payload }
  //       }
  //     case 'showValidMoves':
  //       return {
  //         ...state,
  //         movement: {
  //           ...state.movement,
  //           validMoves: payload ? payload : null
  //         }
  //       }

  //     case 'setMove':
  //       return { ...state, checkerPositions: payload }
  //     case 'setDoublingCube':
  //       return {
  //         ...state,
  //         diceState: {
  //           ...state.diceState,
  //           doublingCube: state.diceState.doublingCube * 2
  //         }
  //       }

  //     case 'reset':
  //       return INITIAL_TABLE_STATE
  //     default:
  //       return state
  //   }
  // }

  // function init(statePayload: CheckerPositionsState): tableState {
  //   return statePayload
  // }

  // console.log(state)
  // console.log(state.checkerPositions.table)

  // const diceRollHandler = () => {
  //   const dice = () => Math.floor(Math.random() * 6) + 1
  //   const die1 = dice()
  //   const die2 = dice()
  //   if (!activePlayer) {
  //     dispatch({ type: 'setDiceRoll', payload: [die1, 0, 0, die2] })

  //     // TODO: passing the dice values here to startGameHandler
  //     // handler was running w/o waiting for state update; this is a workaround
  //     return [die1, die2]
  //   }
  //   if (activePlayer === 1)
  //     dispatch({ type: 'setDiceRoll', payload: [die1, die2, 0, 0] })
  //   if (activePlayer === 2)
  //     dispatch({ type: 'setDiceRoll', payload: [0, 0, die1, die2] })
  //   // if (!activePlayer) setDiceRoll((prev) => [die1, 0, 0, die2])
  //   // if (activePlayer === 1) setDiceRoll((prev) => [die1, die2, 0, 0])
  //   // if (activePlayer === 2) setDiceRoll((prev) => [0, 0, die1, die2])
  // }

  // const isCheckersBar = () => {}
  // const isCheckersHome = (checkerPos: Array<1 | 2>[]) => checkerPos

  // const OpenPoints = () => {
  //   const openPoints = table.map((point, i) => {
  //     return point.length === 0
  //       ? `open`
  //       : point.length === 1 && point[0] !== activePlayer
  //       ? `blot`
  //       : point.length > 1 && point[0] !== activePlayer
  //       ? `closed`
  //       : `anchor`
  //   })

  //   return openPoints
  // }

  // const diceCombinations = () => {
  //   const direction = activePlayer === 1 ? -1 : 1

  //   const playerRoll = diceRoll
  //     .filter((die) => die !== 0)
  //     .map((die) => die * direction)

  //   // doubles get 4 moves of the rolled number
  //   if (playerRoll[0] === playerRoll[1]) playerRoll.push(...playerRoll)

  //   const movesArr: number[] = []
  //   const combinations = playerRoll.reduce((pV, cV, i) => {
  //     const moves = [...pV, i > 0 ? pV[i - 1] + cV : cV]
  //     return moves
  //   }, movesArr)
  //   combinations.shift()

  //   // nested array of the available individual rolls, and their combinations
  //   const moves = [playerRoll, combinations]
  //   // const moves = [...playerRoll, ...combinations]

  //   return moves
  // }

  // const ValidMoves = (
  //   openPoints: ('open' | 'blot' | 'closed' | 'anchor')[],
  //   startPoint: number,
  //   movesArr: number[][]
  // ) => {
  //   if (!activePlayer) return

  //   // checkers on the bar must be moved first
  //   if (bar.includes(activePlayer)) console.log('bar')

  //   // player 1 moves higher point to lower; player 2 vice-versa
  //   // const direction = activePlayer === 1 ? -1 : 1

  //   // const playerRoll = diceRoll
  //   //   .filter((die) => die !== 0)
  //   //   .map((die) => die * direction)
  //   // // doubles get 4 roll
  //   // if (playerRoll[0] === playerRoll[1]) playerRoll.push(...playerRoll)

  //   // const movesArr: number[] = []
  //   // const combinations = playerRoll.reduce((pV, cV, i) => {
  //   //   const moves = [...pV, i > 0 ? pV[i - 1] + cV : cV]
  //   //   return moves
  //   // }, movesArr)
  //   // combinations.shift()

  //   const moves = [...movesArr[0], ...movesArr[1]]

  //   const validMoves = moves.map((move, i) => {
  //     const moveToPoint = startPoint + move
  //     if (
  //       moveToPoint > 23 ||
  //       moveToPoint < 0 ||
  //       openPoints[moveToPoint] === 'closed'
  //     )
  //       return {
  //         dice: i,
  //         roll: move,
  //         point: moveToPoint + 1,
  //         action: 'closed'
  //       }
  //     else
  //       return {
  //         dice: i,
  //         roll: move,
  //         point: moveToPoint + 1,
  //         action: openPoints[moveToPoint]
  //       }
  //   })

  //   console.log(validMoves)
  //   return validMoves
  // }

  // const moveCheckerHandler = () => {
  //   'moved'
  // }

  // const moveHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
  //   const checker = event.currentTarget.innerText
  //   console.log('click', checker, event.target)
  //   if (checker === activePlayer?.toString()) {
  //     console.log()
  //   }
  //   // if (event.target === activePlayer)
  // }

  // const toggleActivePlayer = (dice?: number[]) => {
  //   // diceRollHandler()

  //   // console.log(state.diceState)
  //   // console.log(diceRoll)

  //   if (activePlayer === 1)
  //     return dispatch({ type: 'setActivePlayer', payload: 2 })
  //   if (activePlayer === 2)
  //     return dispatch({ type: 'setActivePlayer', payload: 1 })

  //   // initialize activePLayer
  //   if (dice) {
  //     if (!activePlayer && dice[0] > dice[1]) {
  //       dispatch({ type: 'setActivePlayer', payload: 1 })
  //       diceCombinations()
  //     }
  //     if (!activePlayer && dice[0] < dice[1]) {
  //       dispatch({ type: 'setActivePlayer', payload: 2 })
  //       diceCombinations()
  //     }
  //     if (!activePlayer && dice[0] !== 0 && dice[0] === dice[1]) {
  //       startGameHandler(dice)
  //     }
  //   }
  // }

  // useEffect(() => game.observe(setKnightPos))

  // const renderPoints = (i: number) => {
  //   const x = i % 8
  //   const y = Math.floor(i / 8)

  //   return (
  //     <div key={i} className={`w-1/12 h-1/2`}>
  //       <BoardPoint pointIndex={i} game={game}>
  //       {checkerPosition.map((checkerArr) => <Checker isRender={i === checkerPosition[i] && y === knight)}  />
  //       </BoardPoint>
  //     </div>
  //   )
  // }

  // const points = []
  // for (let i = 0; i < 24; i += 1) {
  //   points.push(renderPoints(i))
  // }

  // const endTurnHandler = () => {
  //   dispatch({
  //     type: 'setActivePlayer',
  //     payload: {
  //       roll: diceRoll
  //     }
  //   })
  //   if (activePlayer === 1) dispatch({ type: 'setActivePlayer', payload: 2 })
  //   if (activePlayer === 2) dispatch({ type: 'setActivePlayer', payload: 1 })
  // }

  // const startGameHandler = (diceRoll?: number[]) => {
  //   if (activePlayer) return
  //   if (diceRoll) {
  //     alert(`Both players rolled a ${diceRoll[0]}! Doubling!`)
  //     dispatch({ type: 'setDoublingCube', payload: 2 })
  //   }
  //   const dice = diceRollHandler()
  //   toggleActivePlayer(dice)
  // }

  // const endGameHandler = () => {
  //   return dispatch({ type: 'reset' })
  // }

  // const validDropPoints: string[] = []
  // // const validDropPoints: Array<undefined | string> =
  // //   state.movement.validMoves.map((moveObj) => {
  // //     if (moveObj.point !== null)
  // //       return (validDropPoints[moveObj.point] = 'bg-green-200')
  // //   })

  // const tablePoints = !state.movement.validMoves ? (
  //   <>
  //     {table.map((point, pointIndex) => (
  //       <div key={pointIndex}>
  //         <div className={`bg-orange-300 w-48 h-8 mt-4`}>{pointIndex + 1}</div>
  //         <div>
  //           {point.map((checker) =>
  //             checker > 0 ? (
  //               <Checker
  //                 key={1 + Math.random()}
  //                 // activeChecker={activeChecker1}
  //                 activeChecker={activePlayer}
  //                 dragHandler={checkerDragHandler}
  //                 dropHandler={checkerDropHandler}
  //                 checkerPosition={pointIndex}
  //                 checkerColor={checker}
  //               />
  //             ) : null
  //           )}
  //         </div>
  //       </div>
  //     ))}
  //   </>
  // ) : (
  //   <>
  //     {table.map((point, pointIndex) => (
  //       <div key={pointIndex}>
  //         <div
  //           className={`bg-orange-300 w-48 h-8 mt-4 ${validDropPoints[pointIndex]}`}
  //         >
  //           {pointIndex + 1}
  //         </div>
  //         <div>
  //           {point.map((checker) =>
  //             checker > 0 ? (
  //               <Checker
  //                 key={1 + Math.random()}
  //                 // activeChecker={activeChecker1}
  //                 activeChecker={activePlayer}
  //                 dragHandler={checkerDragHandler}
  //                 dropHandler={checkerDropHandler}
  //                 checkerPosition={pointIndex}
  //                 checkerColor={checker}
  //               />
  //             ) : null
  //           )}
  //         </div>
  //       </div>
  //     ))}
  //   </>
  // )

  // // const validPointHighlight = dropPoints'bg-green-200'

  // useEffect(() => {
  //   state.movement.validMoves.map((moveObj) => {
  //     if (moveObj.point !== null)
  //       validDropPoints[moveObj.point] = 'bg-green-200'
  //   })
  // }, state.movement.validMoves)

  const checkerDragHandler = (startPoint: number, event: React.DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    // console.log(event)

    const points = openPoints(table, activePlayer)
    const availableMoves = diceCombinations(diceRoll, activePlayer)
    // const valid = validMoves(points, startPoint, availableMoves)
    // dispatch({ type: 'showValidMoves', payload: valid })

    // console.log(points, availableMoves)
    // console.log(state.movement.validMoves)
  }

  // const checkerDragEndHandler = (
  //   startPoint: number,
  //   event: React.DragEvent
  // ) => {
  //   console.log('DRAG ENDED')
  //   event.preventDefault()
  //   event.stopPropagation()
  //   dispatch({ type: 'showValidMoves' })
  // }

  // const checkerDragEnterHandler = (event: React.DragEvent) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   // dispatch({ type: 'showValidMoves' })
  //   console.log('DRAG ENTER!!!!!')
  // }

  // const checkerDropHandler = (event: React.DragEvent) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   // const home = isCheckersHome(table)
  //   console.log('DRAG ENDED', event)
  //   dispatch({ type: 'showValidMoves' })
  // }

  // JSX board render
  // {table.map((point, pointIndex) => (
  //   <div key={pointIndex}>
  //     <div
  //       onDragEnter={checkerDragEnterHandler}
  //       // onDrop={checkerDropHandler}
  //       className={`bg-orange-300 w-48 h-8 mt-4 ${
  //         state.movement.validMoves ? 'bg-green-200' : ''
  //       }`}
  //     >
  //       {pointIndex + 1}
  //     </div>
  //     <div>
  //       {point.map((checker) =>
  //         checker > 0 ? (
  //           <Checker
  //             key={1 + Math.random()}
  //             // activeChecker={activeChecker1}
  //             activeChecker={activePlayer}
  //             dragHandler={checkerDragHandler}
  //             dragEndHandler={checkerDragEndHandler}
  //             dropHandler={checkerDropHandler}
  //             checkerPosition={pointIndex}
  //             checkerColor={checker}
  //           />
  //         ) : null
  //       )}
  //     </div>
  //   </div>
  // ))}

  // {/* <div className={`h-full w-full flex flex-wrap`}>{points}</div> */}

  const renderPoints = () => {
    const pointArr = []
    for (let i = 0; i < 24; i++) {
      pointArr.push(
        <BoardPoint key={i} pointIndex={i} moveHandler={moveCheckerHandler}>
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
