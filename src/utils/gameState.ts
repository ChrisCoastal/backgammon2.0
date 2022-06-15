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
      console.log(payload)

      return {
        ...state,
        movement: { ...state.movement, movesRemaining: payload.moves }
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
//       moveCombinations()
//     }
//     if (!activePlayer && dice[0] < dice[1]) {
//       dispatch({ type: 'setActivePlayer', payload: 2 })
//       moveCombinations()
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

const diceRoll = () => [dice(), dice()]

const rollDiceHandler = (
  activePlayer: ActivePlayer
  // dispatch: React.Dispatch<ReducerActions>
) => {
  const [die1, die2] = diceRoll()
  const roll = !activePlayer
    ? [die1, 0, 0, die2]
    : activePlayer === 1
    ? [die1, die2, 0, 0]
    : [0, 0, die1, die2] // ∴ activePlayer === 2

  const moves =
    gameState.movement.movesRemaining ||
    moveCombinations([die1, die2], activePlayer)

  dispatch({
    type: 'setDice',
    payload: { roll: roll }
  })
  dispatch({ type: 'setMovesRemaining', payload: moves })

  // if (!activePlayer) {
  //   dispatch({ type: 'setDice', payload: roll })
  // }
  // if (activePlayer === 1)
  //   dispatch({
  //     type: 'setDice',
  //     payload: { roll: [die1, die2, 0, 0], moves: moves }
  //   })
  // dispatch({ type: 'setMovesRemaining', payload: moves })
  // if (activePlayer === 2)
  //   dispatch({
  //     type: 'setDice',
  //     payload: { roll: [0, 0, die1, die2], moves: moves }
  //   })
  // dispatch({ type: 'setMovesRemaining', payload: moves })
}

const moveDirection = (activePlayer: ActivePlayer) =>
  gameState.activePlayer === 1 ? -1 : 1

// TODO: should only be called from rollDiceHandler
const moveCombinations = (diceRoll: number[], activePlayer: ActivePlayer) => {
  if (!activePlayer) console.error('diceCombination')
  const direction = moveDirection(activePlayer)
  console.log(
    'diceRoll',
    diceRoll,
    'remaining',
    gameState.movement.movesRemaining
  )

  // doubles get 4 moves of the rolled number
  // if (diceRoll[0] === diceRoll[1]) diceRoll.push(...diceRoll)

  // moves from individual dice with board direction added
  // const singleDiceMoves = diceRoll
  const singleDiceMoves = gameState.diceState.diceRoll
    .filter((die) => die !== 0)
    .map((die) => die * direction)
  // doubles get 4 moves of the rolled number
  if (singleDiceMoves[0] === singleDiceMoves[1])
    singleDiceMoves.push(...singleDiceMoves)

  // all combinations of individual moves
  const combos: number[] = []
  const combinationDiceMoves = singleDiceMoves.reduce((pV, cV, i) => {
    const moves = [...pV, i > 0 ? pV[i - 1] + cV : cV]
    return moves
  }, combos)
  combinationDiceMoves.shift()

  // nested array of the available individual rolls, and their combinations
  const moves = { singleDice: singleDiceMoves, multiDice: combinationDiceMoves }
  // const moves = [...singleDiceMoves, ...combinations]

  dispatch({ type: 'setMovesRemaining', payload: moves })
  return moves
}

const remianingMoveCombos = () => {}

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

const validMoves = (
  openPoints: ('open' | 'blot' | 'closed' | 'anchor')[],
  dragItem: { fromPoint: number; checkerColor: any },
  // dropPoint: number,
  movesArr: { singleDice: number[]; multiDice: number[] },
  activePlayer: ActivePlayer
) => {
  if (!activePlayer) return

  const { fromPoint, checkerColor } = dragItem
  // TODO: checkers on the bar must be moved first
  // if (bar.includes(activePlayer)) console.log('bar')

  const moves = [...movesArr.singleDice, ...movesArr.multiDice]

  const validMovesArr = moves.map((move, i) => {
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
  const movesRemaining = gameState.movement.movesRemaining
  if (movesRemaining.singleDice.includes(moveDistance)) {
    movesRemaining
  }
  // dispatch({ type: 'setMovesRemaining', payload: newState })
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
  rollDiceHandler,
  moveCombinations, // TODO: remove
  openPoints,
  validMoves,
  updateRemainingMoves,
  moveChecker
}
