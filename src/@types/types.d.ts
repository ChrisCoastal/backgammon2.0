import { ColorSchemeOverrides } from '@mui/material'
import { BlobOptions } from 'buffer'

export type OpenPoint = Array<'open' | 'blot' | 'closed' | 'anchor'>

export type ActivePlayer = 1 | 2 | null
export type ActiveChecker = 1 | 2

// Dice rolls
export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6 | 0
export type DoublingCubeNumber = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256
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

export interface DiceState {
  diceRoll: DiceRoll
  doublingCube: number
}

export interface MovementState {
  movesRemaining: number[] // want to push a new array
  validMoves: { fromPoint: number; checkerQty: number }[]
  // movesPossible: number[]
  movesTaken: { fromPoint: number; toPoint: number; move: [] }[]
}

export interface Turn {
  turn: number
  movesTaken: { fromPoint: number; toPoint: number; move: [] }[]
}

export interface GameState {
  gameHistory: Turn[]
  checkerPositions: CheckerPositionsState
  activePlayer: 1 | 2 | null
  diceState: DiceState
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
