import { FC } from 'react'
import { ActivePlayer, ActiveChecker } from 'src/@types/types'

// react dnd
import { useDrag } from 'react-dnd'

// config
import { ItemTypes } from '../../utils/config'

type CheckerProps = {
  point: number
  activePlayer: ActivePlayer
  checkerColor: ActiveChecker
}

// interface CheckerProps {
//   dragHandler: Function
//   dragEndHandler: Function
//   dropHandler: Function
//   activeChecker: 1 | 2 | null
//   checkerColor: number
//   checkerPosition: number
// }

// const Checker = ({
//   dragHandler,
//   dragEndHandler,
//   dropHandler,
//   activeChecker,
//   checkerColor,
//   checkerPosition
// }: CheckerProps) => {
const Checker: FC<CheckerProps> = ({ point, activePlayer, checkerColor }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: `checker${checkerColor}`,
    item: { fromPoint: point, checkerColor: checkerColor },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  const active = activePlayer === checkerColor && 'bg-pink-400'

  const color =
    checkerColor === 1
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-sky-600 hover:bg-sky-700'

  return (
    <div
      ref={dragRef}
      className={`h-16 w-16 rounded-full ${color} ${active}`}
    ></div>
  )

  // return (
  // <span
  //   key={Math.random()}
  //   // onClick={moveHandler}
  //   className={`py-2 px-3 rounded-full ${color}`}
  //   draggable={active}
  //   tabIndex={1}
  //   onDragStart={() => dragHandler(checkerPosition)}
  //   onDrag={() => dragHandler(checkerPosition, window.event)}
  //   onDragEnd={() => console.log('ENDED!!')} // TODO: not firing
  //   // onDragEnd={() => dragEndHandler(checkerPosition, window.event)}
  // >
  //   {checkerColor}
  // </span>
  // <span ref={drag} className={`py-2 px-3 rounded-full ${color}`}></span>
  // )
}

export default Checker
