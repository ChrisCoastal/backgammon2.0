import { access } from 'fs'
import { useDrop } from 'react-dnd'
import {
  TableState,
  ReducerActions,
  ActivePlayer,
  ActiveChecker,
  CheckerPositionsState
} from '../@types/types'

import { INITIAL_TABLE_STATE, PLAYER_1_START, PLAYER_2_START } from './config'

// useReducer
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

// Player Turn
const toggleActivePlayer = (dice?: number[]) => {
  let action = 'toggle'
  console.log('TOG', gameState.activePlayer)

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
    console.log('TOGGLING')

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

  dispatch({
    type: 'setMovesRemaining',
    payload: { movesRemaining: moves, movesTaken: '' }
  })
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

const getValidMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
) => {
  const { activePlayer, movement } = gameState
  if (movement.movesRemaining.length === 0) return false

  const { fromPoint } = dragItem
  const direction = moveDirection(activePlayer)
  const directionalMoves = movement.movesRemaining.map(
    (move) => move * direction
  )
  const openPoints = getOpenPoints()

  // TODO: add handling for blots
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

  // checks if the array of valid moves includes the point (div) hovered over
  return [...validMoves].includes(dropPoint)
}

const getValidBarMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
) => {
  const { fromPoint, checkerColor } = dragItem

  const initialPoint =
    typeof fromPoint === 'number'
      ? fromPoint
      : fromPoint === 'bar' && checkerColor === 1
      ? PLAYER_1_START
      : PLAYER_2_START
}

const updateRemainingMoves = (
  dropPoint: number,
  dragItem: { fromPoint: number; checkerColor: any }
) => {
  const { fromPoint, checkerColor } = dragItem

  const initialPoint =
    typeof fromPoint === 'number'
      ? fromPoint
      : fromPoint === 'bar' && checkerColor === 1
      ? PLAYER_1_START
      : PLAYER_2_START

  const moveDistance = Math.abs(initialPoint - dropPoint)
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

  moves.indexOf(moveDistance) >= 0 && takeSingleMove(moveDistance)
  moves.indexOf(moveDistance) === -1 && takeComboMove(moveDistance)
}

const moveChecker = (
  dropPoint: number,
  item: { fromPoint: number; checkerColor: ActiveChecker }
) => {
  const { fromPoint, checkerColor } = item
  const openPoints = getOpenPoints()

  let newState = gameState.checkerPositions
  // move to open or anchor point
  if (openPoints[dropPoint] === 'open' || openPoints[dropPoint] === 'anchor') {
    const movingChecker = newState.table[fromPoint].pop() as ActiveChecker
    newState.table[dropPoint].push(movingChecker)
    // newState.table[dropPoint].push(checkerColor)
  }

  // hit opponent blot
  if (openPoints[dropPoint] === 'blot') {
    const hitBlot = newState.table[dropPoint].pop() as ActiveChecker
    newState.bar.push(hitBlot)
    const movingChecker = newState.table[fromPoint].pop() as ActiveChecker
    newState.table[dropPoint].push(movingChecker)
  }

  dispatch({ type: 'setCheckerPosition', payload: newState })
}

export const gameLogic = {
  stateSubscriber,
  reducer,
  getDiceRoll,
  initialMoves,
  getOpenPoints,
  getValidMoves,
  getValidBarMoves,
  updateRemainingMoves,
  moveChecker,
  toggleActivePlayer
}
