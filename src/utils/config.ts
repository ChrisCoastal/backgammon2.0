import { TableState } from 'src/@types/types'

export const INITIAL_POSITIONS: Array<1 | 2>[] = [
  [2, 2],
  [],
  [],
  [],
  [],
  [1, 1, 1, 1, 1],
  [],
  [1, 1, 1],
  [],
  [],
  [],
  [2, 2, 2, 2, 2],
  [1, 1, 1, 1, 1],
  [],
  [],
  [],
  [2, 2, 2],
  [],
  [2, 2, 2, 2, 2],
  [],
  [],
  [],
  [],
  [1, 1]
]

export const INITIAL_TABLE_STATE: TableState = {
  gameHistory: [],
  checkerPositions: {
    table: INITIAL_POSITIONS,
    bar: [],
    bearOff1: [],
    bearOff2: []
  },
  activePlayer: 2,
  // TODO: activePlayer: null,
  diceState: {
    diceRoll: [0, 0, 0, 0],
    availableRoll: [],
    doublingCube: 1
  },
  movement: {
    validMoves: null,
    takenMoves: []
  }
}

export const BOARD_COLORS = {
  oddPoint: 'bg-red-200',
  evenPoint: 'bg-blue-200',
  player1checker: 'bg-red-500',
  player2checker: 'bg-blue-500'
}

// React DnD
export const ItemTypes = {
  CHECKER1: 'checker1',
  CHECKER2: 'checker2'
}
