import { useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'

import { ActiveChecker, ActivePlayer } from 'src/@types/types'

import {
  ItemTypes,
  BOARD_COLORS,
  PLAYER_1_BAR,
  PLAYER_2_BAR,
  POINT_POSITIONS
} from '../../utils/config'

interface PointProps {
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
  board: Array<1 | 2>
  children: ReactNode
}

const BoardPoint: FC<PointProps> = ({
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

  // tailwind
  const dropColor =
    isOver && canDrop ? 'bg-green-200' : canDrop ? 'bg-green-100' : ''

  const pointColor =
    pointIndex === PLAYER_1_BAR || pointIndex === PLAYER_2_BAR
      ? BOARD_COLORS.bar
      : pointIndex % 2
      ? BOARD_COLORS.oddPoint
      : BOARD_COLORS.evenPoint

  const pointPosition = POINT_POSITIONS[pointIndex]
  // FIXME:
  const checkerAlign =
    pointIndex === PLAYER_1_BAR
      ? 'justify-start py-1'
      : pointIndex === PLAYER_2_BAR
      ? 'justify-end bottom-0 py-1'
      : pointIndex > 12
      ? 'justify-end bottom-0'
      : 'justify-start'

  return (
    <div className={`${pointPosition}`}>
      {/* <p className={`absolute`}>{pointIndex}</p> */}
      <div
        ref={dropRef}
        className={`flex flex-col ${checkerAlign} ${pointColor} ${dropColor} w-full h-full px-0.5`}
      >
        {children}
      </div>
    </div>
  )
  {
    /* {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
      {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
      {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />} */
  }
}

export default BoardPoint
