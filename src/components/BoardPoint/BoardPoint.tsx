import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'

import { gameLogic } from 'src/utils/gameState'

import { ItemTypes } from '../../utils/config'

interface PointProps {
  validMoves: (
    pointIndex: number,
    item: { fromPoint: number; checkerColor: any }
  ) => boolean
  dropHandler: (
    pointIndex: number,
    item: { fromPoint: number; checkerColor: any }
  ) => void
  pointIndex: number
  children: ReactNode
}

const BoardPoint: FC<PointProps> = ({
  validMoves,
  dropHandler,
  pointIndex,
  children
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: ItemTypes.CHECKER1 || ItemTypes.CHECKER2,
    canDrop: (item) =>
      validMoves(pointIndex, item as { fromPoint: number; checkerColor: any }),
    drop: (item) =>
      dropHandler(pointIndex, item as { fromPoint: number; checkerColor: any }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      getChecker: monitor.getItem(),
      canDrop: monitor.canDrop()
    })
  }))

  const dropColor =
    isOver && canDrop ? 'bg-green-200' : canDrop ? 'bg-green-100' : ''
  const color = pointIndex % 2 ? 'bg-red-200' : 'bg-blue-200'

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
