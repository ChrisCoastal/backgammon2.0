import { GameState } from 'src/@types/types'

export const PLAYER_1_BAR = 25
export const PLAYER_1_HOME_LIMIT = 6
export const PLAYER_1_BEAROFF = 100
export const PLAYER_2_BAR = 0
export const PLAYER_2_HOME_LIMIT = 19
export const PLAYER_2_BEAROFF = 200
export const INITIAL_BOARD_POSITION: Array<1 | 2>[] = [
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
  ////
  // Testing Positions
  // [2], // bar player2
  // [],
  // [2],
  // [1, 1],
  // [1, 1],
  // [1, 1],
  // [1, 1, 1, 1, 1],
  // [1, 1],
  // [],
  // [],
  // [],
  // [],
  // [2],
  // [1, 1, 1, 1, 1],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [1, 1],
  // [],
  // [],
  // [],
  // [],
  // [1, 1],
  // [] // bar player1
  ////
  // Testing Home Positions
  ////
  // [], // bar player2
  // [],
  // [2],
  // [1, 1],
  // [1, 1],
  // [1, 1],
  // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [2],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [],
  // [] // bar player1
  ////
]

export const INITIAL_GAME_STATE: GameState = {
  gameHistory: [],
  checkerPositions: {
    board: INITIAL_BOARD_POSITION,
    openPoints: [],
    bearOff1: [],
    bearOff2: []
  },
  // activePlayer: 2,
  activePlayer: null,
  diceState: {
    diceRoll: [0, 0],
    doublingCube: 1
  },
  movement: {
    movesRemaining: [],
    // movesPossible: number[]
    validMoves: [],
    movesTaken: []
  }
}

export const BOARD_COLORS = {
  oddPoint: 'bg-red-200',
  evenPoint: 'bg-blue-200',
  bar: 'bg-slate-500',
  player1checker: 'bg-red-500',
  player2checker: 'bg-blue-500',
  player1dice: 'bg-red-300',
  player2dice: 'bg-blue-300'
}

// React DnD
export const ItemTypes = {
  CHECKER_1: 'checker1',
  CHECKER_1_BAR: 'checker1Bar',
  CHECKER_2: 'checker2',
  CHECKER_2_BAR: 'checker2Bar'
}
