import { ColorSchemeOverrides } from '@mui/material'
import { BlobOptions } from 'buffer'

// Board Positions
interface Point {
  [key: string]: Array<string | null>
}
export type BoardPositions = Point[]

export type ActivePlayer = 1 | 2 | null
export type ActiveChecker = 1 | 2

// Dice rolls
// export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6 | null

interface CheckerPositionsState {
  table: Array<1 | 2>[]
  openPoints: Array<'open' | 'blot' | 'closed' | 'anchor'>
  bearOff1: Array<1 | 2>
  bearOff2: Array<1 | 2>
}

export interface TableState {
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
    // movesPossible: number[]
    movesTaken: { fromPoint: number; toPoint: number; move: [] }[]
  }
}

export interface ReducerActions {
  type:
    | 'setActivePlayer'
    | 'setDice'
    | 'setOpenPoints'
    | 'setMovesRemaining'
    | 'setMovesPossible'
    | 'setCheckerPosition'
    | 'showValidMoves'
    | 'setDoublingCube'
    | 'reset'
  payload?: any
}
