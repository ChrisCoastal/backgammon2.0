import { access } from 'fs'
import { useDrop } from 'react-dnd'
import {
  TableState,
  ReducerActions,
  ActivePlayer,
  ActiveChecker,
  CheckerPositionsState,
  OpenPoint
} from '../@types/types'

import { INITIAL_TABLE_STATE, PLAYER_1_BAR, PLAYER_2_BAR } from './config'

////////////////////
// useReducer and State Management
let gameState: TableState = INITIAL_TABLE_STATE
let dispatch: React.Dispatch<ReducerActions>

// triggered to update via useEffect in GameBoard
function stateSubscriber(
  state: TableState,
  reducerDispatch: React.Dispatch<ReducerActions>
) {
  console.log('setting state', state)

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
    case 'setOpenPoints':
      return {
        ...state,
        checkerPositions: {
          ...state.checkerPositions,
          openPoints: payload
        }
      }
    case 'setMovesRemaining':
      return {
        ...state,
        movement: {
          ...state.movement,
          movesRemaining: payload.movesRemaining,
          // FIXME: spreads to undefined on first pass
          movesTaken: [...state.movement.movesTaken, payload.movesTaken]
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

////////////////////
// Player Turn
const toggleActivePlayer = (dice?: number[]) => {
  let action = 'toggle'

  // initialize activePLayer
  if (dice) {
    if (!gameState.activePlayer && dice[0] > dice[1]) {
      dispatch({ type: 'setActivePlayer', payload: 1 })
      return (action = 'P1')
    }
    if (!gameState.activePlayer && dice[0] < dice[1]) {
      dispatch({ type: 'setActivePlayer', payload: 2 })
      return (action = 'P2')
    }
    if (!gameState.activePlayer && dice[0] !== 0 && dice[0] === dice[1]) {
      alert('DOUBLES ROLLED')
      return (action = 'doubles')
      // dispatch doubling cube
    }
  } else {
    // if (gameState.activePlayer === 1)
    //   return dispatch({ type: 'setActivePlayer', payload: 2 })
    // if (gameState.activePlayer === 2)
    //   return dispatch({ type: 'setActivePlayer', payload: 1 })
    gameState.activePlayer === 1
      ? dispatch({ type: 'setActivePlayer', payload: 2 })
      : dispatch({ type: 'setActivePlayer', payload: 1 })
  }
  return action
}

////////////////////
// Table Position
const isCheckersBar = () => {}
const isCheckersHome = (checkerPos: CheckerPositionsState) => checkerPos

////////////////////
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
  // rolling doubles gives 4 moves of the rolled number
  if (moves[0] === moves[1]) moves.push(...moves)

  dispatch({
    type: 'setMovesRemaining',
    payload: { movesRemaining: moves, movesTaken: '' }
  })
  console.log([moves])
  return moves
}

const getDirection = () => (gameState.activePlayer === 1 ? -1 : 1)

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

  dispatch({ type: 'setOpenPoints', payload: openPoints })
  return openPoints
}

const isValidMoves = (openPoints: OpenPoint) => {
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

const checkMoves = (openPoints: OpenPoint, moves: [number, number]) => {
  const { table } = gameState.checkerPositions
  const direction = getDirection()
  // const dirMoves = (moves || gameState.movement.movesRemaining).map(
  const dirMoves = moves.map((move) => move * direction)
  const bar = gameState.activePlayer === 1 ? PLAYER_1_BAR : PLAYER_2_BAR

  // take the possible fromPoints[]
  let fromPoints = openPoints.reduce((acc, point, i) => {
    // const canMove = openPoints[i + dirMoves[0]] !== 'closed' || openPoints[i + dirMoves[1]] !== 'closed'
    return point === 'anchor'
      ? [...acc, { pointIndex: i, checkerQty: table[i].length }]
      : acc
    // return point === 'anchor' && canMove ? [...acc, i] : acc
  }, [] as { pointIndex: number; checkerQty: number }[])

  // check for activePlayer checkers on bar
  if (fromPoints.map((from) => from.pointIndex).includes(bar)) {
    // then move 1 or 2
  }

  // check first number against all fromPoints.length > 0
  const checkFirstMove = fromPoints.filter(
    (fromPoint) => openPoints[fromPoint.pointIndex + dirMoves[0]] !== 'closed'
  )
  if (checkFirstMove.length === 1) {
    // then must take move with that checker
  }
  const checkSecondMove = fromPoints.filter(
    (fromPoint) => openPoints[fromPoint.pointIndex + dirMoves[1]] !== 'closed'
  )
  if (checkSecondMove.length === 1) {
    // then must take move with that checker
  }
  // check first number against all fromPoints.length > 1
  // repeat for second number
  console.log(checkFirstMove, checkSecondMove)

  return
}

const getMoves = (fromPoint: number, moves: number[]) => {
  const { openPoints } = gameState.checkerPositions

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

const getValidMoves = (
  dragItem: { fromPoint: number; checkerColor: any },
  dropPoint: number
  // dropPoint?: number
) => {
  const { activePlayer, checkerPositions, movement } = gameState
  const { fromPoint } = dragItem
  const bar = activePlayer === 1 ? PLAYER_1_BAR : PLAYER_2_BAR
  // check for remaining moves
  if (movement.movesRemaining.length === 0) return false
  // check for checkers on bar
  if (checkerPositions.table[bar].length !== 0 && fromPoint !== bar)
    return false

  const direction = getDirection()
  const directionalMoves = movement.movesRemaining.map(
    (move) => move * direction
  )
  const { openPoints } = gameState.checkerPositions

  // TODO: add handling for blots
  const getMoves = (moves: number[]) => {
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

  const validForward = getMoves(directionalMoves)
  const validReverse = getMoves([...directionalMoves].reverse())
  const validMoves = new Set([...validForward, ...validReverse])

  // return dropPoint !== undefined
  //   ? [...validMoves].includes(dropPoint)
  //   : [...validMoves]
  // checks if the array of valid moves includes the point (div) hovered over
  return [...validMoves].includes(dropPoint)
}

const updateRemainingMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
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
  const { movesRemaining } = gameState.movement

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

const moveChecker = (
  dropPoint: number,
  item: { fromPoint: number; checkerColor: ActiveChecker }
) => {
  const { fromPoint, checkerColor } = item
  const openPoints = gameState.checkerPositions.openPoints

  const barPoint = [PLAYER_1_BAR, PLAYER_2_BAR]
  let newState = gameState.checkerPositions
  // move to open or anchor point

  // (!barPoint.includes(fromPoint) && openPoints[dropPoint] === 'open') ||
  if (openPoints[dropPoint] === 'open' || openPoints[dropPoint] === 'anchor') {
    const movingChecker = newState.table[fromPoint].pop() as ActiveChecker
    newState.table[dropPoint].push(movingChecker)
    // newState.table[dropPoint].push(checkerColor)
  }
  // TODO: add hits in comboMoves
  // hit opponent blot
  if (openPoints[dropPoint] === 'blot') {
    const hitBlot = newState.table[dropPoint].pop() as ActiveChecker
    hitBlot === 1
      ? newState.table[PLAYER_1_BAR].push(hitBlot)
      : newState.table[PLAYER_2_BAR].push(hitBlot)
    const movingChecker = newState.table[fromPoint].pop() as ActiveChecker
    newState.table[dropPoint].push(movingChecker)
  }

  dispatch({ type: 'setCheckerPosition', payload: newState })
  const newOpenPoints = getOpenPoints()

  dispatch({ type: 'setOpenPoints', payload: newOpenPoints })
}

export const gameLogic = {
  stateSubscriber,
  reducer,
  getDiceRoll,
  getOpenPoints,
  initialMoves,
  checkMoves,
  isValidMoves,
  getValidMoves,
  updateRemainingMoves,
  moveChecker,
  toggleActivePlayer
}
