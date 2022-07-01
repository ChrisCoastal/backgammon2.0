import type { FC, ReactNode } from 'react'
import { ActivePlayer } from 'src/@types/types'

import { useDrop } from 'react-dnd'

import { ItemTypes, BOARD_COLORS } from '../../utils/config'

interface BearOffProps {
  validMoves: (
    pointIndex: number,
    item: { fromPoint: number; checkerColor: 1 | 2 }
  ) => boolean
  dropHandler: (
    pointIndex: number,
    item: { fromPoint: number; checkerColor: 1 | 2 }
  ) => void
  pointIndex: number
  activePlayer: ActivePlayer
  movesRemaining: number[]
  board: Array<1 | 2>[]
  children?: ReactNode
}

const BearOff: FC<BearOffProps> = ({
  validMoves,
  dropHandler,
  pointIndex,
  activePlayer,
  movesRemaining,
  board,
  children
}) => {
  const droppable = !activePlayer
    ? 'null'
    : activePlayer === 1
    ? ItemTypes.CHECKER_1
    : ItemTypes.CHECKER_2

  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: droppable,
      canDrop: (item) =>
        validMoves(
          pointIndex,
          item as { fromPoint: number; checkerColor: 1 | 2 }
        ),
      drop: (item) =>
        dropHandler(
          pointIndex,
          item as { fromPoint: number; checkerColor: 1 | 2 }
        ),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        getChecker: monitor.getItem(),
        canDrop: monitor.canDrop()
      })
    }),
    [activePlayer, board, movesRemaining]
  )

  const dropColor =
    isOver && canDrop ? 'bg-green-200' : canDrop ? 'bg-green-100' : ''

  const color = BOARD_COLORS.bar

  return (
    <div
      ref={dropRef}
      className={`flex-column border-2 border-pink-500 ${color} ${dropColor} w-16 h-80`}
    >
      <p>Off {activePlayer}</p>
      {children}
    </div>
  )
}

export default BearOff
