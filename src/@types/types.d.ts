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
  bar: Array<1 | 2>
  bearOff1: Array<1 | 2>
  bearOff2: Array<1 | 2>
}

export interface TableState {
  gameHistory: {}[]
  checkerPositions: CheckerPositionsState
  activePlayer: 1 | 2 | null
  diceState: {
    diceRoll: number[]
    availableRoll: number[]
    doublingCube: number
  }
  movement: {
    validMoves: ValidMoveState[] | null
    takenMoves: number[]
  }
}

export interface ReducerActions {
  type:
    | 'setActivePlayer'
    | 'setDiceRoll'
    | 'setMove'
    | 'showValidMoves'
    | 'setDoublingCube'
    | 'reset'
  payload?: any
}
