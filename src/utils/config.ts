import { TableState } from 'src/@types/types'

export const PLAYER_1_BAR = 25
export const PLAYER_2_BAR = 0
export const INITIAL_POSITIONS: Array<1 | 2>[] = [
  [], // bar player2
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
  [1, 1],
  [] // bar player1
]

export const INITIAL_TABLE_STATE: TableState = {
  gameHistory: [],
  checkerPositions: {
    table: INITIAL_POSITIONS,
    openPoints: [],
    bearOff1: [],
    bearOff2: []
  },
  activePlayer: 2,
  // activePlayer: null,
  diceState: {
    diceRoll: [0, 0, 0, 0],
    doublingCube: 1
  },
  movement: {
    movesRemaining: [],
    // movesPossible: [],
    movesTaken: []
  }
}

export const BOARD_COLORS = {
  oddPoint: 'bg-red-200',
  evenPoint: 'bg-blue-200',
  bar: 'bg-slate-500',
  player1checker: 'bg-red-500',
  player2checker: 'bg-blue-500'
}

// React DnD
export const ItemTypes = {
  CHECKER_1: 'checker1',
  CHECKER_1_BAR: 'checker1Bar',
  CHECKER_2: 'checker2',
  CHECKER_2_BAR: 'checker2Bar'
}
