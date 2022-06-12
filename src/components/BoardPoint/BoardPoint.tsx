import type { FC, ReactNode } from 'react'
import { useDrop } from 'react-dnd'

// import type { Game } from './Game'
import { ItemTypes } from '../../utils/config'
// import { Overlay, OverlayType } from './Overlay'
// import { Square } from './Square'

export interface BoardPointProps {
  pointIndex: number
  children?: ReactNode
  // game: Game
}

export const BoardPoint: FC<BoardPointProps> = ({
  pointIndex,
  children
}: // game
BoardPointProps) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.CHECKER,
      // canDrop: () => game.canMoveKnight(x, y),
      // drop: () => game.moveKnight(x, y),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      })
    })
    // [game]
  )
  const color = pointIndex % 2 ? 'bg-red-200' : 'bg-blue-200'

  return (
    <div
      ref={drop}
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
