import { access } from 'fs'
import { useDrop } from 'react-dnd'
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
          movesRemaining: payload
        }
      }
    // case 'setMovesPossible':
    //   return {
    //     ...state,
    //     movement: {
    //       ...state.movement,
    //       movesPossible: payload
    //     }
    //   }
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

const initialMoves = (diceRoll: number[]) => {
  const moves = diceRoll
  // doubles get 4 moves of the rolled number
  if (moves[0] === moves[1]) moves.push(...moves)

  dispatch({ type: 'setMovesRemaining', payload: moves })
  console.log([moves])
  return moves
}

// TODO: remove params
const moveDirection = (activePlayer: ActivePlayer) =>
  gameState.activePlayer === 1 ? -1 : 1

const getOpenPoints = () => {
  const { activePlayer, checkerPositions } = gameState

  const openPoints = checkerPositions.table.map((point, i) => {
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

// TODO: should only be called once a drag starts
const possibleMoves = (
  activePlayer: ActivePlayer,
  remainingMoves: number[],
  // dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
) => {
  if (!activePlayer || !remainingMoves) return []

  // console.log(activePlayer, remainingMoves, dropPoint, dragItem)

  const { fromPoint, checkerColor } = dragItem
  const direction = moveDirection(activePlayer)
  const directionalMoves = remainingMoves.map((move) => move * direction)
  const openPoints = getOpenPoints()

  const getMoves = (moves: number[]) => {
    let moveAcc = 0
    const moveCombos = moves.map((move) => (moveAcc += move))
    const isMoveValid = moveCombos.map((move) =>
      fromPoint + move >= 0 && fromPoint + move <= 23
        ? openPoints[fromPoint + move]
        : 'closed'
    )
    const invalidIndex = isMoveValid.indexOf('closed')
    const validMoves =
      invalidIndex !== -1 ? moveCombos.slice(0, invalidIndex) : moveCombos
    const validCurrentMoves = validMoves.map((move) => fromPoint + move)

    return validCurrentMoves
  }

  const validForward = getMoves(directionalMoves)
  const validReverse = getMoves([...directionalMoves].reverse())

  const validMoves = new Set([...validForward, ...validReverse])

  return [...validMoves]
}

const getValidMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
) => {
  console.log(dragItem)

  const { activePlayer, movement } = gameState

  const { fromPoint } = dragItem
  const direction = moveDirection(activePlayer)
  const directionalMoves = movement.movesRemaining.map(
    (move) => move * direction
  )
  const openPoints = getOpenPoints()

  const getMoves = (moves: number[]) => {
    let moveAcc = 0
    const moveCombos = moves.map((move) => (moveAcc += move))
    const isMoveValid = moveCombos.map((move) =>
      fromPoint + move >= 0 && fromPoint + move <= 23
        ? openPoints[fromPoint + move]
        : 'closed'
    )
    const invalidIndex = isMoveValid.indexOf('closed')
    const validMoves =
      invalidIndex !== -1 ? moveCombos.slice(0, invalidIndex) : moveCombos
    const validCurrentMoves = validMoves.map((move) => fromPoint + move)

    return validCurrentMoves
  }

  const validForward = getMoves(directionalMoves)
  const validReverse = getMoves([...directionalMoves].reverse())

  const validMoves = new Set([...validForward, ...validReverse])

  return [...validMoves].includes(dropPoint)
}

// const validMoves = (
//   openPoints: ('open' | 'blot' | 'closed' | 'anchor')[],
//   dragItem: { fromPoint: number; checkerColor: any },
//   // dropPoint: number,
//   movesPossible: number[],
//   activePlayer: ActivePlayer
// ) => {
//   if (!activePlayer) return

//   const { fromPoint, checkerColor } = dragItem
//   // TODO: checkers on the bar must be moved first
//   // if (bar.includes(activePlayer)) console.log('bar')

//   const validMovesArr = movesPossible.map((move, i) => {
//     const moveToPoint = fromPoint + move
//     if (
//       moveToPoint > 23 ||
//       moveToPoint < 0 ||
//       openPoints[moveToPoint] === 'closed'
//     )
//       return {
//         dice: i,
//         roll: move,
//         point: moveToPoint,
//         action: 'closed'
//       }
//     else
//       return {
//         dice: i,
//         roll: move,
//         point: moveToPoint,
//         action: openPoints[moveToPoint]
//       }
//   })

//   return validMovesArr
// }

// TODO: check movesRemaining for the moveDistance
// FIXME: function reaching the error
// const updateRemainingMoves = (
//   // dispatch: React.Dispatch<ReducerActions>,
//   dropPoint: number,
//   fromPoint: number
// ) => {
//   const moveDistance = Math.abs(fromPoint - dropPoint)
//   console.log('moveDist', moveDistance)
//   const { movesRemaining, movesPossible } = gameState.movement

//   const moves = movesRemaining.at(-1)

//   // TODO: refactor? both if statements into single reduce() (see below)
//   if (moves && moves.includes(moveDistance)) {
//     const taken = moves.splice(moves.indexOf(moveDistance), 1)
//     movesPossible.map((dice) => dice - moveDistance)
//     // return dispatch({
//     //   type: 'setMovesRemaining',
//     //   payload: {
//     //     movesRemaining: { movesRemaining, movesPossible }, // TODO: just recalc movesPossible?
//     //     movesTaken: { fromPoint: fromPoint, toPoint: dropPoint, moves: taken }
//     //   }
//     // })
//   }
//   if (movesPossible.includes(moveDistance)) {
//     movesPossible.splice(movesPossible.indexOf(moveDistance), 1)
//     if (moves) {
//       const remove = moves.reduce(
//         (acc, cur, i) => {
//           if (acc.acc === moveDistance) return acc
//           // can maybe refactor for both cases (move single or combo)
//           // if (cur === moveDistance) return { acc: cur, i: i }; // something like this?
//           return { acc: acc.acc + cur, i: i }
//         },
//         { acc: 0, i: 0 }
//       )

//       // removing constituent single moves
//       const taken = moves.splice(0, remove.i + 1)
//       // return dispatch({
//       //   type: 'setMovesRemaining',
//       //   payload: {
//       //     movesRemaining: { movesRemaining, movesPossible }, // TODO: just recalc movesPossible?
//       //     movesTaken: { fromPoint: fromPoint, toPoint: dropPoint, moves: taken }
//       //   }
//       // })
//     }
//   }
//   // dispatch({ type: 'setMovesRemaining', payload: newState })
//   console.error('MOVE NOT FOUND')

//   return
// }

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
  getOpenPoints,
  getValidMoves,
  // validMoves,
  // updateRemainingMoves,
  moveChecker
}
