// Board Positions
interface Point {
  [key: string]: Array<string | null>
}
export type BoardPositions = Point[]

// Dice rolls
// export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6 | null

interface CheckerPositionsState {
  table: Array<1 | 2>[]
  bar: Array<1 | 2>
  bearOff1: Array<1 | 2>
  bearOff2: Array<1 | 2>
}
