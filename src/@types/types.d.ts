import { ColorSchemeOverrides } from '@mui/material'
import { BlobOptions } from 'buffer'

export type OpenPoint = Array<'open' | 'blot' | 'closed' | 'anchor'>

export type ActivePlayer = 1 | 2 | null
export type ActiveChecker = 1 | 2

// Dice rolls
export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0
export type DiceRoll = [DiceNumber, DiceNumber]

// Board Positions
// FIXME:
interface Point {
  [key: string]: Array<string | null>
}
// export type PointPositions = Point[]
export type PointPositions = Array<1 | 2>
export type BoardPositions = Array<1 | 2>[]

export interface CheckerPositionsState {
  board: BoardPositions
  openPoints: OpenPoint
  bearOff1: PointPositions
  bearOff2: PointPositions
}

export interface MovementState {
  movesRemaining: number[] // want to push a new array
  validMoves: { fromPoint: number; checkerQty: number }[]
  // movesPossible: number[]
  movesTaken: { fromPoint: number; toPoint: number; move: [] }[]
}

export interface GameState {
  gameHistory: {}[]
  checkerPositions: CheckerPositionsState
  activePlayer: 1 | 2 | null
  diceState: {
    diceRoll: DiceRoll
    // movesRemaining: number[]
    doublingCube: number
  }
  movement: MovementState
}

export interface ReducerActions {
  type:
    | 'setActivePlayer'
    | 'setDice'
    | 'setOpenPoints'
    | 'setValidMoves'
    | 'setMovesRemaining'
    | 'setMovesPossible'
    | 'setCheckerPosition'
    | 'showValidMoves'
    | 'setDoublingCube'
    | 'reset'
  payload?: any
}
