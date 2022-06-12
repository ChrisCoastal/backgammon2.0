import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'

import { ItemTypes } from '../../utils/config'

interface PointProps {
  moveHandler: (startPos: number, item: any) => void
  pointIndex: number
  children: ReactNode
}

export const BoardPoint: FC<PointProps> = ({
  moveHandler,
  pointIndex,
  children
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: ItemTypes.CHECKER,
    drop: (item) => moveHandler(pointIndex, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      getChecker: monitor.getItem(),
      canDrop: monitor.canDrop()
    })
  }))
  const color = pointIndex % 2 ? 'bg-red-200' : 'bg-blue-200'

  return (
    <div
      ref={dropRef}
      role="Space"
      // data-testid={`(${x},${y})`}
      className={`relative w-full h-full`}
    >
      <div className={color}>{children}</div>
      {/* {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
      {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
      {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />} */}
    </div>
  )
}
