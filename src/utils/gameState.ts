import { access } from 'fs'
import { Dispatch } from 'react'
import { useDrop } from 'react-dnd'
import {
  ReducerActions,
  ActivePlayer,
  ActiveChecker,
  CheckerPositionsState,
  OpenPoint,
  DiceRoll,
  BoardPositions,
  MovementState
} from '../@types/types'

import {
  INITIAL_GAME_STATE,
  PLAYER_1_BAR,
  PLAYER_2_BAR,
  PLAYER_1_HOME_LIMIT,
  PLAYER_2_HOME_LIMIT
} from './config'

////////////////////
// Dice
const dice = () => Math.floor(Math.random() * 6) + 1

export const getDiceRoll = (dispatch: Dispatch<ReducerActions>) => {
  // const [die1, die2] = [dice(), dice()]
  const [die1, die2] = [1, 1]

  dispatch({
    type: 'setDice',
    payload: { roll: [die1, die2] }
  })

  return [die1, die2] as DiceRoll
}

////////////////////
// Player Turn
export const initializeActivePlayer = (
  dice: DiceRoll,
  dispatch: Dispatch<ReducerActions>
) => {
  let action
  if (dice[0] === null || dice[1] === null) return
  if (dice[0] > dice[1]) {
    dispatch({ type: 'setActivePlayer', payload: 1 })
    action = 'PLAYER_1'
  }
  if (dice[0] < dice[1]) {
    dispatch({ type: 'setActivePlayer', payload: 2 })
    action = 'PLAYER_2'
  }
  if (dice[0] === dice[1]) {
    alert('DOUBLES ROLLED')
    dispatch({ type: 'setDoublingCube' })
    action = 'DOUBLES'
    // TODO: dispatch doubling cube
  }
  return action
}

export const toggleActivePlayer = (
  activePlayer: ActivePlayer,
  dispatch: Dispatch<ReducerActions>
) => {
  activePlayer === 1
    ? dispatch({ type: 'setActivePlayer', payload: 2 })
    : dispatch({ type: 'setActivePlayer', payload: 1 })
}

////////////////////
// Table Position
// const isCheckersBar = () => {
//   const { activePlayer, checkerPositions } = gameState
//   const bar = activePlayer === 1 ? PLAYER_1_BAR : PLAYER_2_BAR
//   // check for checkers on bar
//   if (checkerPositions.board[bar].length === 0)
//     return { isCheckers: false, point: bar }
//   return { isCheckers: true, point: bar }
// }
// const isCheckersHome = () => {
//   const { activePlayer, checkerPositions } = gameState
//   const home = activePlayer === 1 ? PLAYER_1_HOME_LIMIT : PLAYER_2_HOME_LIMIT
//   return (
//     checkerPositions.board.filter((point, i) =>
//       activePlayer === 1
//         ? i > PLAYER_1_HOME_LIMIT && !point.includes(1)
//         : i > PLAYER_2_HOME_LIMIT && !point.includes(2)
//     ).length > 0
//   )
// }

////////////////////
// Dice and Movement
// const dice = () => Math.floor(Math.random() * 6) + 1

// const getDiceRoll = () => {
//   // const [die1, die2] = [dice(), dice()]
//   const [die1, die2] = [6, 1]

//   const roll = !gameState.activePlayer
//     ? [die1, 0, 0, die2]
//     : gameState.activePlayer === 1
//     ? [die1, die2, 0, 0]
//     : [0, 0, die1, die2] // ∴ activePlayer === 2

//   dispatch({
//     type: 'setDice',
//     payload: { roll: roll }
//   })

//   return [die1, die2]
// }

export const playerTurnMoves = (
  diceRoll: DiceRoll,
  dispatch: Dispatch<ReducerActions>
) => {
  const moves = diceRoll
  // rolling doubles gives 4 moves of the rolled number
  if (moves[0] === moves[1]) moves.push(...moves)

  dispatch({
    type: 'setMovesRemaining',
    payload: { movesRemaining: moves, movesTaken: '' }
  })
  console.log([moves])
  return moves as number[]
}

export const getDirection = (activePlayer: ActivePlayer) =>
  activePlayer === 1 ? -1 : 1

export const getOpenPoints = (
  activePlayer: ActivePlayer,
  checkerPositions: BoardPositions,
  dispatch: Dispatch<ReducerActions>
) => {
  const openPoints = checkerPositions.map((point: Array<1 | 2>) => {
    return point.length === 0
      ? `open`
      : point.length === 1 && point[0] !== activePlayer
      ? `blot`
      : point.length > 1 && point[0] !== activePlayer
      ? `closed`
      : `anchor`
  })

  dispatch({ type: 'setOpenPoints', payload: openPoints })
  return openPoints
}

const isCheckersBar = (
  activePlayer: ActivePlayer,
  boardPositions: BoardPositions
) => {
  const barPoint = activePlayer === 1 ? PLAYER_1_BAR : PLAYER_2_BAR
  // check for checkers on bar
  return boardPositions[barPoint].length === 0
    ? { isCheckers: false, point: barPoint }
    : { isCheckers: true, point: barPoint }
}

const isCheckersHome = (
  activePlayer: ActivePlayer,
  boardPositions: BoardPositions
) => {
  const home = activePlayer === 1 ? PLAYER_1_HOME_LIMIT : PLAYER_2_HOME_LIMIT
  return (
    boardPositions.filter((point, i) =>
      activePlayer === 1
        ? i > PLAYER_1_HOME_LIMIT && !point.includes(1)
        : i > PLAYER_2_HOME_LIMIT && !point.includes(2)
    ).length > 0
  )
}

export const isValidMoves = (openPoints: OpenPoint) => {
  // const { openPoints } = gameState.checkerPositions
  const fromPoints = openPoints.reduce((acc, point, i) => {
    return point === 'anchor' ? [...acc, i] : acc
  }, [] as number[])
  console.log(fromPoints)

  // const validMoves = fromPoints.map((fromPoint) =>
  //   getValidMoves(
  //     {fromPoint: fromPoint,
  //     checkerColor: gameState.activePlayer}
  //   )
  // )
  // console.log(validMoves)
}

export const checkMoves = (
  openPoints: OpenPoint,
  boardPositions: BoardPositions,
  activePlayer: ActivePlayer,
  diceRoll: DiceRoll,
  dispatch: Dispatch<ReducerActions>
) => {
  const direction = getDirection(activePlayer)
  // const dirMoves = (moves || gameState.movement.movesRemaining).map(
  const dirMoves = diceRoll.map((move) => move * direction)
  const bar = activePlayer === 1 ? PLAYER_1_BAR : PLAYER_2_BAR

  let fromPoints
  // if the active bar is occupied, can only move from there
  if (isCheckersBar(activePlayer, boardPositions))
    fromPoints = [
      { fromPoint: bar, checkerQty: boardPositions[bar].length }
    ] as {
      fromPoint: number
      checkerQty: number
    }[]
  // otherwise check all other occupied points
  else
    fromPoints = openPoints.reduce((acc, point, i) => {
      // const canMove = openPoints[i + dirMoves[0]] !== 'closed' || openPoints[i + dirMoves[1]] !== 'closed'
      return point === 'anchor'
        ? [...acc, { fromPoint: i, checkerQty: boardPositions[i].length }]
        : acc
    }, [] as { fromPoint: number; checkerQty: number }[])

  // TODO: move this into a map or forEach loop?
  // check first number against all fromPoints.length > 0
  // const check1Move = fromPoints.map((fromPoint) => {
  //   const moveTo = openPoints[fromPoint.fromPoint + dirMoves[0]]
  //   if (moveTo !== 'closed') return { ...fromPoint, dropPoint: moveTo }
  //   return
  // })
  let check1Move = fromPoints.filter(
    (fromPoint) => openPoints[fromPoint.fromPoint + dirMoves[0]] !== 'closed'
  )
  let check12Move = check1Move.filter(
    (fromPoint) =>
      openPoints[fromPoint.fromPoint + dirMoves[0] + dirMoves[1]] !== 'closed'
  )
  let check2Move = fromPoints.filter(
    (fromPoint) => openPoints[fromPoint.fromPoint + dirMoves[1]] !== 'closed'
  )
  let check21Move = check2Move.filter(
    (fromPoint) =>
      openPoints[fromPoint.fromPoint + dirMoves[1] + dirMoves[0]] !== 'closed'
  )
  console.log(
    '1',
    check1Move,
    '2',
    check2Move,
    '12',
    check12Move,
    '21',
    check21Move
  )

  let validMoves = [check1Move, check2Move].flat()

  // if (check2Move.length === 1) {
  //   // then must take move with that checker
  // }
  // // check 1 number against all fromPoints.length > 1
  // // repeat for 2 number
  if (check1Move.length === 0 && check2Move.length === 0) {
    alert('NO MOVES AVAILABLE')
    validMoves = []
  }
  if (check12Move.length > 0 && check2Move.length === 0) {
    // check1Move.filter((move) => check12Move.includes(move))
    // get rid of check1move
    validMoves = check12Move
  }
  if (check1Move.length === 0 && check21Move.length > 0) {
    // check2Move.filter((move) => check21Move.includes(move))
    validMoves = check21Move
  }
  console.log(validMoves)

  dispatch({ type: 'setValidMoves', payload: validMoves })
  return validMoves
}

export const getMoves = (
  moves: number[],
  checkerPositions: CheckerPositionsState,
  activePlayer: ActivePlayer
) => {
  const { openPoints, board } = checkerPositions

  const direction = getDirection(activePlayer)
  const dirMoves = moves.map((move) => move * direction)

  // get array of all occupied points
  // const fromPoints = board.map((point) => if (point[0] === activePlayer))
  const fromPoints = board.reduce(
    (acc, point, i) =>
      point[0] === activePlayer
        ? [...acc, { fromPoint: i, checkerQty: board[i].length }]
        : acc,
    [] as { fromPoint: number; checkerQty: number }[]
  )
  // const dropPoints = fromPoints.map((point) => )

  let moveAcc = 0
  /*
  const moveCombos = moves.map((move) => (moveAcc += move))
  const isMoveValid = moveCombos.map((move) =>
  fromPoint + move >= 1 && fromPoint + move <= 24
  ? openPoints[fromPoint + move]
  : 'closed'
  )
  const invalidIndex = isMoveValid.indexOf('closed')
  const validMoves =
  invalidIndex !== -1 ? moveCombos.slice(0, invalidIndex) : moveCombos
  const validCurrentMoves = validMoves.map((move) => fromPoint + move)
  
  return validCurrentMoves
  */
}

export const getValidMoves = (
  dragItem: { fromPoint: number; checkerColor: any },
  dropPoint: number,
  activePlayer: ActivePlayer,
  checkerPositions: CheckerPositionsState,
  movement: MovementState
  // dropPoint?: number
) => {
  const { fromPoint } = dragItem
  const { openPoints, board } = checkerPositions
  // console.log('HOME', isCheckersHome())

  // check that the fromPoint will allow all moves to be taken
  /*
    // TODO: add back
  if (!movement.validMoves.map((move) => move.fromPoint).includes(fromPoint)) {
    // alert('NO MOVE')
    return false
  }
  // check for remaining moves
  if (movement.movesRemaining.length === 0) return false

  const bar = isCheckersBar(activePlayer, board)
  if (bar.isCheckers && fromPoint !== bar.point) return false
  */

  const direction = getDirection(activePlayer)
  console.log(movement.movesRemaining)

  const directionalMoves = movement.movesRemaining.map(
    (move) => move * direction
  )
  // console.log(directionalMoves)

  const validForward = getMoves(directionalMoves)
  const validReverse = getMoves([...directionalMoves].reverse())
  const validMoves = new Set([...validForward, ...validReverse])

  // TODO: add handling for blots
  function getMoves(moves: number[]) {
    let moveAcc = 0
    const moveCombos = moves.map((move) => (moveAcc += move))
    const isMoveValid = moveCombos.map((move) =>
      fromPoint + move >= 1 && fromPoint + move <= 24
        ? openPoints[fromPoint + move]
        : 'closed'
    )
    const invalidIndex = isMoveValid.indexOf('closed')
    const validMoves =
      invalidIndex !== -1 ? moveCombos.slice(0, invalidIndex) : moveCombos
    const validCurrentMoves = validMoves.map((move) => fromPoint + move)

    return validCurrentMoves
  }

  // checks if the array of valid moves includes the point (div) hovered over
  return [...validMoves].includes(dropPoint)
}

export const updateRemainingMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any },
  movement: MovementState,
  dispatch: Dispatch<ReducerActions>
) => {
  const { fromPoint, checkerColor } = dragItem

  // const initialPoint =
  //   typeof fromPoint === 'number'
  //     ? fromPoint
  //     : fromPoint === 'bar' && checkerColor === 1
  //     ? PLAYER_1_BAR
  //     : PLAYER_2_BAR

  const moveDistance = Math.abs(fromPoint - dropPoint)
  console.log('moveDist', moveDistance)
  const { movesRemaining } = movement

  //   const moves = movesRemaining.at(-1)
  const moves = [...movesRemaining]

  let moveAcc = 0
  const moveCombos = moves.map((move) => (moveAcc += move))

  const takeSingleMove = (moveDist: number) => {
    console.log('SINGLEMOVE')
    const taken = moves.splice(moves.indexOf(moveDist), 1)
    return dispatch({
      type: 'setMovesRemaining',
      payload: {
        movesRemaining: moves, // this is the mutated value from splice()
        movesTaken: { fromPoint: fromPoint, toPoint: dropPoint, moves: taken }
      }
    })
  }
  // FIXME: maybe this should return the dice to be taken as two individual moves
  // send dice to dropCheckerHandler
  const takeComboMove = (moveDist: number) => {
    let moveAcc = 0
    const movesIndex = moves.map((move) => (moveAcc += move)).indexOf(moveDist)
    const taken = moves.splice(0, movesIndex + 1)
    console.log('COMBOMOVE', movesIndex, taken, moves)

    return dispatch({
      type: 'setMovesRemaining',
      payload: {
        movesRemaining: moves, // this is the mutated value from splice()
        movesTaken: { fromPoint: fromPoint, toPoint: dropPoint, moves: taken }
      }
    })
  }
  const moveIndex = moves.indexOf(moveDistance)

  moveIndex >= 0 && takeSingleMove(moveDistance)
  moveIndex === -1 && takeComboMove(moveDistance)
}

export const moveChecker = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: ActiveChecker },
  checkerPositions: CheckerPositionsState,
  dispatch: Dispatch<ReducerActions>
) => {
  const { fromPoint, checkerColor } = dragItem
  const openPoints = checkerPositions.openPoints

  const barPoint = [PLAYER_1_BAR, PLAYER_2_BAR]
  let newState = checkerPositions
  // move to open or anchor point

  // (!barPoint.includes(fromPoint) && openPoints[dropPoint] === 'open') ||
  if (openPoints[dropPoint] === 'open' || openPoints[dropPoint] === 'anchor') {
    const movingChecker = newState.board[fromPoint].pop() as ActiveChecker
    newState.board[dropPoint].push(movingChecker)
    // newState.board[dropPoint].push(checkerColor)
  }
  // TODO: add hits in comboMoves
  // hit opponent blot
  if (openPoints[dropPoint] === 'blot') {
    const hitBlot = newState.board[dropPoint].pop() as ActiveChecker
    hitBlot === 1
      ? newState.board[PLAYER_1_BAR].push(hitBlot)
      : newState.board[PLAYER_2_BAR].push(hitBlot)
    const movingChecker = newState.board[fromPoint].pop() as ActiveChecker
    newState.board[dropPoint].push(movingChecker)
  }

  dispatch({ type: 'setCheckerPosition', payload: newState })
  // TODO: remove if openPoints call in dropCheckerHandler is updating after each move
  // const newOpenPoints = getOpenPoints()
  // dispatch({ type: 'setOpenPoints', payload: newOpenPoints })
}

// export const gameLogic = {
//   stateSubscriber,
//   reducer,
//   getDiceRoll,
//   getOpenPoints,
//   initialMoves,
//   checkMoves,
//   getMoves,
//   isValidMoves,
//   getValidMoves,
//   updateRemainingMoves,
//   moveChecker,
//   toggleActivePlayer
// }
