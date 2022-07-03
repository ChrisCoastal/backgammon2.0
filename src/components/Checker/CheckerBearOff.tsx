import { FC } from 'react'
import { ActivePlayer, ActiveChecker } from 'src/@types/types'

// react dnd
import { useDrag } from 'react-dnd'

// config
import { ItemTypes, PLAYER_1_BAR, PLAYER_2_BAR } from '../../utils/config'

type CheckerProps = {
  pointIndex: number
  // activePlayer: ActivePlayer
  checkerColor: ActiveChecker
}

const CheckerBearOff: FC<CheckerProps> = ({ pointIndex, checkerColor }) => {
  // const [{ isDragging }, dragRef] = useDrag(() => ({
  //   // type: dropType,
  //   type: `checker${checkerColor}`,
  //   item: { fromPoint: pointIndex, checkerColor: checkerColor },
  //   collect: (monitor) => ({
  //     isDragging: monitor.isDragging()
  //   })
  // }))
  // console.log('checker', checkerColor, activePlayer) // working

  const color =
    checkerColor === 1
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-sky-600 hover:bg-sky-700'

  // return <div ref={dragRef} className={`h-16 w-16 rounded-full ${color}`}></div>
  return <div className={`h-16 w-16 rounded-full ${color}`}></div>
}

export default CheckerBearOff
