import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'

import { ItemTypes } from '../../utils/config'

interface PointProps {
  moveHandler: (pointIndex: number, item: any) => void
  pointIndex: number
  children: ReactNode
}

const BoardPoint: FC<PointProps> = ({ moveHandler, pointIndex, children }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop(() => ({
    accept: ItemTypes.CHECKER,
    // canDrop: () => canMoveHandler(pointIndex, item),
    drop: (item) => moveHandler(pointIndex, item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      getChecker: monitor.getItem(),
      canDrop: monitor.canDrop()
    })
  }))

  const hoverColor = isOver ? 'bg-green-100' : ''
  const color = pointIndex % 2 ? 'bg-red-200' : 'bg-blue-200'

  return (
    <div
      ref={dropRef}
      className={`flex-column border-2 border-pink-500 ${color} ${hoverColor} w-1/12`}
    >
      {children}
    </div>
  )
  {
    /* {isOver && !canDrop && <Overlay type={OverlayType.IllegalMoveHover} />}
      {!isOver && canDrop && <Overlay type={OverlayType.PossibleMove} />}
      {isOver && canDrop && <Overlay type={OverlayType.LegalMoveHover} />} */
  }
}

export default BoardPoint
