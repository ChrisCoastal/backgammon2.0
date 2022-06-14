import {
  TableState,
  ReducerActions,
  ActivePlayer,
  ActiveChecker,
  CheckerPositionsState
} from '../@types/types'

import { INITIAL_TABLE_STATE } from './config'

// useReducer logic
let gameState: TableState = INITIAL_TABLE_STATE

// triggered to update via useEffect in GameBoard
function stateSubscriber(
  state: TableState
  // dispatch: React.Dispatch<ReducerActions>
) {
  console.log('setting state', state)
  // TODO:
  gameState = state
}

function reducer(state: TableState, action: ReducerActions): TableState {
  const { type, payload } = action

  switch (type) {
    case 'setActivePlayer':
      return { ...state, activePlayer: payload }
    case 'setDiceRoll':
      return {
        ...state,
        diceState: {
          ...state.diceState,
          diceRoll: payload.roll,
          availableRoll: payload.available
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

    case 'setMove':
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
const diceRollHandler = (
  activePlayer: ActivePlayer,
  dispatch: React.Dispatch<ReducerActions>
) => {
  const dice = () => Math.floor(Math.random() * 6) + 1
  const die1 = dice()
  const die2 = dice()
  if (!activePlayer) {
    dispatch({ type: 'setDiceRoll', payload: [die1, 0, 0, die2] })

    // TODO: passing the dice values here to startGameHandler
    // handler was running w/o waiting for state update; this is a workaround
    // return [die1, die2]
  }

  const available =
    gameState.diceState.availableRoll ||
    diceCombinations([die1, die2], activePlayer)

  if (activePlayer === 1)
    dispatch({
      type: 'setDiceRoll',
      payload: { roll: [die1, die2, 0, 0], available: available }
    })
  if (activePlayer === 2)
    dispatch({
      type: 'setDiceRoll',
      payload: { roll: [0, 0, die1, die2], available: available }
    })
}

// TODO: should only be called from diceRollHandler
const diceCombinations = (diceRoll: number[], activePlayer: ActivePlayer) => {
  if (!activePlayer) console.error('diceCombination')
  const direction = activePlayer === 1 ? -1 : 1
  console.log(diceRoll)

  const playerRoll = diceRoll
    .filter((die) => die !== 0)
    .map((die) => die * direction)

  // doubles get 4 moves of the rolled number
  if (playerRoll[0] === playerRoll[1]) playerRoll.push(...playerRoll)

  const movesArr: number[] = []
  const combinations = playerRoll.reduce((pV, cV, i) => {
    const moves = [...pV, i > 0 ? pV[i - 1] + cV : cV]
    return moves
  }, movesArr)
  combinations.shift()

  // nested array of the available individual rolls, and their combinations
  const moves = [playerRoll, combinations]
  // const moves = [...playerRoll, ...combinations]

  return moves
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

const validMoves = (
  openPoints: ('open' | 'blot' | 'closed' | 'anchor')[],
  dragItem: { fromPoint: number; checkerColor: any },
  // dropPoint: number,
  movesArr: number[][],
  activePlayer: ActivePlayer
) => {
  if (!activePlayer) return

  const { fromPoint, checkerColor } = dragItem
  // TODO: checkers on the bar must be moved first
  // if (bar.includes(activePlayer)) console.log('bar')

  const moves = [...movesArr[0], ...movesArr[1]]

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

const moveChecker = (
  dispatch: React.Dispatch<ReducerActions>,
  dropPoint: number,
  item: { fromPoint: number; checkerColor: ActiveChecker }
) => {
  const { fromPoint, checkerColor } = item

  const newState = gameState.checkerPositions
  newState.table[fromPoint].pop()
  newState.table[dropPoint].push(checkerColor)

  dispatch({ type: 'setMove', payload: newState })
  dispatch({ type: 'setMove', payload: newState })
}

export const gameLogic = {
  stateSubscriber,
  reducer,
  diceRollHandler,
  diceCombinations, // TODO: remove
  openPoints,
  validMoves,
  moveChecker
}
