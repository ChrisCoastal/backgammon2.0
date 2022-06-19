import { useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'

import { ActiveChecker, ActivePlayer } from 'src/@types/types'
import type { gameLogic } from 'src/utils/gameState'

import { ItemTypes, BOARD_COLORS } from '../../utils/config'

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
  bar: ActiveChecker[]
  children: ReactNode
}

const BoardPoint: FC<PointProps> = ({
  validMoves,
  dropHandler,
  pointIndex,
  activePlayer,
  bar,
  children
}) => {
  const getDropppable = () => {
    const dropType = !activePlayer
      ? 'null'
      : bar.includes(activePlayer as 1 | 2) && activePlayer === 1
      ? ItemTypes.CHECKER_1_BAR
      : bar.includes(activePlayer as 1 | 2) && activePlayer === 2
      ? ItemTypes.CHECKER_2_BAR
      : activePlayer === 1
      ? ItemTypes.CHECKER_1
      : ItemTypes.CHECKER_2
    return dropType
  }

  const droppable = getDropppable()

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
    [activePlayer]
  )

  const dropColor =
    isOver && canDrop ? 'bg-green-200' : canDrop ? 'bg-green-100' : ''
  const color = pointIndex % 2 ? BOARD_COLORS.oddPoint : BOARD_COLORS.evenPoint

  return (
    <div className="flex-column">
      <div
        ref={dropRef}
        className={`flex-column border-2 border-pink-500 ${color} ${dropColor} w-16 h-80`}
      >
        {children}
      </div>
      <div>
        <p>{pointIndex}</p>
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
