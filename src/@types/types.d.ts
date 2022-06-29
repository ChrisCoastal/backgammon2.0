import { ColorSchemeOverrides } from '@mui/material'
import { BlobOptions } from 'buffer'

// Board Positions
interface Point {
  [key: string]: Array<string | null>
}
export type BoardPositions = Point[]
export type OpenPoint = Array<'open' | 'blot' | 'closed' | 'anchor'>

export type ActivePlayer = 1 | 2 | null
export type ActiveChecker = 1 | 2

// Dice rolls
// export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6
// export type DiceRoll = [DiceNumber, DiceNumber]

export type CheckerPositions = Array<1 | 2>[]

export interface TablePositionsState {
  board: CheckerPositions
  openPoints: OpenPoint
  bearOff1: CheckerPositions
  bearOff2: CheckerPositions
}

export interface GameState {
  gameHistory: {}[]
  checkerPositions: CheckerPositionsState
  activePlayer: 1 | 2 | null
  diceState: {
    diceRoll: number[]
    // movesRemaining: number[]
    doublingCube: number
  }
  movement: {
    movesRemaining: number[] // want to push a new array
    validMoves: { fromPoint: number; checkerQty: number }[]
    // movesPossible: number[]
    movesTaken: { fromPoint: number; toPoint: number; move: [] }[]
  }
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
