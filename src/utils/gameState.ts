import { access } from 'fs'
import {
  TableState,
  ReducerActions,
  ActivePlayer,
  ActiveChecker,
  CheckerPositionsState
} from '../@types/types'

import { INITIAL_TABLE_STATE } from './config'

// useReducer
let gameState: TableState = INITIAL_TABLE_STATE
let dispatch: React.Dispatch<ReducerActions>

// triggered to update via useEffect in GameBoard
function stateSubscriber(
  state: TableState,
  reducerDispatch: React.Dispatch<ReducerActions>
) {
  console.log('setting state', state)
  // TODO:
  gameState = state
  dispatch = reducerDispatch
}

function reducer(state: TableState, action: ReducerActions): TableState {
  const { type, payload } = action

  switch (type) {
    case 'setActivePlayer':
      return { ...state, activePlayer: payload }
    case 'setDice':
      return {
        ...state,
        diceState: {
          ...state.diceState,
          diceRoll: payload.roll
        }
      }
    case 'setMovesRemaining':
      return {
        ...state,
        movement: {
          ...state.movement,
          movesRemaining: payload.movesRemaining
        }
      }
    // case 'showValidMoves':
    //   return {
    //     ...state,
    //     movement: {
    //       ...state.movement,
    //       validMoves: payload ? payload : null
    //     }
    //   }

    case 'setCheckerPosition':
      return { ...state, checkerPositions: payload }
    case 'setDoublingCube':
      return {
        ...state,
        diceState: {
          ...state.diceState,
          doublingCube: state.diceState.doublingCube * 2
        }
      }

    case 'reset':
      return INITIAL_TABLE_STATE
    default:
      return state
  }
}

// Player Turn
// const toggleActivePlayer = (dice?: number[]) => {
//   // rollDiceHandler()

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
//       possibleMoves()
//     }
//     if (!activePlayer && dice[0] < dice[1]) {
//       dispatch({ type: 'setActivePlayer', payload: 2 })
//       possibleMoves()
//     }
//     if (!activePlayer && dice[0] !== 0 && dice[0] === dice[1]) {
//       startGameHandler(dice)
//     }
//   }
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

// Table Position
const isCheckersBar = () => {}
const isCheckersHome = (checkerPos: CheckerPositionsState) => checkerPos

// Dice and Movement
const dice = () => Math.floor(Math.random() * 6) + 1

const getDiceRoll = () => {
  const [die1, die2] = [dice(), dice()]

  const roll = !gameState.activePlayer
    ? [die1, 0, 0, die2]
    : gameState.activePlayer === 1
    ? [die1, die2, 0, 0]
    : [0, 0, die1, die2] // ∴ activePlayer === 2

  dispatch({
    type: 'setDice',
    payload: { roll: roll }
  })

  return [die1, die2]
}
// const diceRoll = () => [dice(), dice()]

// const rollDiceHandler = (
//   activePlayer: ActivePlayer
//   // dispatch: React.Dispatch<ReducerActions>
// ) => {
//   const [die1, die2] = diceRoll()
//   const roll = !activePlayer
//     ? [die1, 0, 0, die2]
//     : activePlayer === 1
//     ? [die1, die2, 0, 0]
//     : [0, 0, die1, die2] // ∴ activePlayer === 2

//   const moves = possibleMoves([die1, die2], activePlayer)

//   dispatch({
//     type: 'setDice',
//     payload: { roll: roll }
//   })
//   // FIXME: need to correct the payload object
//   dispatch({ type: 'setMovesRemaining', payload: moves })

//   // if (!activePlayer) {
//   //   dispatch({ type: 'setDice', payload: roll })
//   // }
//   // if (activePlayer === 1)
//   //   dispatch({
//   //     type: 'setDice',
//   //     payload: { roll: [die1, die2, 0, 0], moves: moves }
//   //   })
//   // dispatch({ type: 'setMovesRemaining', payload: moves })
//   // if (activePlayer === 2)
//   //   dispatch({
//   //     type: 'setDice',
//   //     payload: { roll: [0, 0, die1, die2], moves: moves }
//   //   })
//   // dispatch({ type: 'setMovesRemaining', payload: moves })
// }

const initialMoves = (diceRoll: number[]) => {
  // set moves in a + or - direction
  // const direction = moveDirection(gameState.activePlayer)
  const moves = gameState.diceState.diceRoll
  // .filter((die) => die !== 0) // TODO: can remove if only passing 2 nums
  // .map((die) => die * direction)
  // doubles get 4 moves of the rolled number
  if (moves[0] === moves[1]) moves.push(...moves)

  const initialMoves = moves.map((move) => ({ move: move, remains: true }))
  dispatch({ type: 'setMovesRemaining', payload: initialMoves })

  return moves
}

// TODO: remove params
const moveDirection = (activePlayer: ActivePlayer) =>
  gameState.activePlayer === 1 ? -1 : 1

// TODO: should only be called from rollDiceHandler
const possibleMoves = (
  activePlayer: ActivePlayer,
  remainingMoves: number[]
) => {
  if (!activePlayer) console.error('diceCombination')
  const direction = moveDirection(activePlayer)

  const combos: number[] = []
  const moveCombinations = new Set(
    remainingMoves
      .concat(
        remainingMoves.reduce((acc, cur, i) => {
          const moves = [...acc, i > 0 ? acc[i - 1] + cur : cur]
          return moves
        }, combos)
      )
      .map((move) => move * direction)
  )

  return [...moveCombinations]
}

const openPoints = (table: Array<1 | 2>[], activePlayer: ActivePlayer) => {
  const openPoints = table.map((point, i) => {
    return point.length === 0
      ? `open`
      : point.length === 1 && point[0] !== activePlayer
      ? `blot`
      : point.length > 1 && point[0] !== activePlayer
      ? `closed`
      : `anchor`
  })

  return openPoints
}

const getValidMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
) => {
  console.log('MOVEMENT', gameState.movement)

  const points = openPoints(
    gameState.checkerPositions.table,
    gameState.activePlayer
  )
  const { diceRoll } = gameState.diceState
  const possible = possibleMoves(gameState.activePlayer, diceRoll)
  // console.log(possible, state.movement.movesRemaining)
  // TODO: pass availableRoll
  const valid = validMoves(points, dragItem, possible, gameState.activePlayer)

  console.log(valid)

  // TODO:
  console.log(
    !!valid
      ?.map((move) => move.action !== 'closed' && move.point)
      .includes(dropPoint)
  )

  return !!valid
    ?.map((move) => move.action !== 'closed' && move.point)
    .includes(dropPoint)
  // return valid?.point.includes(dropPoint)
}

const validMoves = (
  openPoints: ('open' | 'blot' | 'closed' | 'anchor')[],
  dragItem: { fromPoint: number; checkerColor: any },
  // dropPoint: number,
  movesPossible: number[],
  activePlayer: ActivePlayer
) => {
  if (!activePlayer) return

  const { fromPoint, checkerColor } = dragItem
  // TODO: checkers on the bar must be moved first
  // if (bar.includes(activePlayer)) console.log('bar')

  // const moveArr = [...moves.singleDice, ...moves.comboDice]

  // moves.singleDice

  const validMovesArr = movesPossible.map((move, i) => {
    const moveToPoint = fromPoint + move
    if (
      moveToPoint > 23 ||
      moveToPoint < 0 ||
      openPoints[moveToPoint] === 'closed'
    )
      return {
        dice: i,
        roll: move,
        point: moveToPoint,
        action: 'closed'
      }
    else
      return {
        dice: i,
        roll: move,
        point: moveToPoint,
        action: openPoints[moveToPoint]
      }
  })

  return validMovesArr
}

// TODO: check movesRemaining for the moveDistance
const updateRemainingMoves = (
  // dispatch: React.Dispatch<ReducerActions>,
  dropPoint: number,
  fromPoint: number
) => {
  const moveDistance = Math.abs(fromPoint - dropPoint)
  console.log('moveDist', moveDistance)
  const { movesRemaining, movesPossible } = gameState.movement

  // TODO: refactor? both if statements into single reduce() (see below)
  if (singleDice.includes(moveDistance)) {
    const taken = singleDice.splice(singleDice.indexOf(moveDistance), 1)
    comboDice.map((dice) => dice - moveDistance)
    return dispatch({
      type: 'setMovesRemaining',
      payload: {
        movesRemaining: { singleDice, comboDice }, // TODO: just recalc comboDice?
        movesTaken: { fromPoint: fromPoint, toPoint: dropPoint, moves: taken }
      }
    })
  }
  if (comboDice.includes(moveDistance)) {
    comboDice.splice(comboDice.indexOf(moveDistance), 1)
    const remove = singleDice.reduce(
      (acc, cur, i) => {
        if (acc.acc === moveDistance) return acc
        // can maybe refactor for both cases (move single or combo)
        // if (cur === moveDistance) return { acc: cur, i: i }; // something like this?
        return { acc: acc.acc + cur, i: i }
      },
      { acc: 0, i: 0 }
    )

    // removing constituent single moves
    const taken = singleDice.splice(0, remove.i + 1)
    return dispatch({
      type: 'setMovesRemaining',
      payload: {
        movesRemaining: { singleDice, comboDice }, // TODO: just recalc comboDice?
        movesTaken: { fromPoint: fromPoint, toPoint: dropPoint, moves: taken }
      }
    })
  }
  // dispatch({ type: 'setMovesRemaining', payload: newState })
  console.error('MOVE NOT FOUND')

  return
}

const moveChecker = (
  // dispatch: React.Dispatch<ReducerActions>,
  dropPoint: number,
  item: { fromPoint: number; checkerColor: ActiveChecker }
) => {
  const { fromPoint, checkerColor } = item

  const newState = gameState.checkerPositions
  newState.table[fromPoint].pop()
  newState.table[dropPoint].push(checkerColor)

  dispatch({ type: 'setCheckerPosition', payload: newState })
}

export const gameLogic = {
  stateSubscriber,
  reducer,
  getDiceRoll,
  // rollDiceHandler,
  initialMoves,
  possibleMoves, // TODO: remove
  openPoints,
  getValidMoves,
  validMoves,
  updateRemainingMoves,
  moveChecker
}
