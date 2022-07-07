import { FC } from 'react'
import { ActivePlayer, ActiveChecker } from 'src/@types/types'

// react dnd
import { useDrag } from 'react-dnd'

// config
import { ItemTypes, PLAYER_1_BAR, PLAYER_2_BAR } from '../../utils/config'

// images
import CheckerIcon from './CheckerIcon'

type CheckerProps = {
  point: number | 'bearOff1' | 'bearOff2'
  // activePlayer: ActivePlayer
  checkerColor: ActiveChecker
}

const Checker: FC<CheckerProps> = ({ point, checkerColor }) => {
  const [{ isDragging }, dragRef, preview] = useDrag(() => ({
    // type: dropType,
    type: `checker${checkerColor}`,
    item: { fromPoint: point, checkerColor: checkerColor },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))
  // console.log('checker', checkerColor, activePlayer) // working

  const color =
    checkerColor === 1
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-sky-600 hover:bg-sky-700'

  return (
    <span
      ref={dragRef}
      className={`relative pb-1/1 rounded-full ${color} flex-shrink`}
    ></span>
  )
}

export default Checker
