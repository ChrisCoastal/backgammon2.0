import { FC } from 'react'

// config
import { ItemTypes } from '../../utils/config'

// react dnd
import { useDrag } from 'react-dnd'

interface CheckerProps {
  dragHandler: Function
  dragEndHandler: Function
  dropHandler: Function
  activeChecker: 1 | 2 | null
  checkerColor: number
  checkerPosition: number
}

const Checker = ({
  dragHandler,
  dragEndHandler,
  dropHandler,
  activeChecker,
  checkerColor,
  checkerPosition
}: CheckerProps) => {
  const color =
    checkerColor === 1
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-sky-600 hover:bg-sky-700'

  const active = activeChecker === checkerColor

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.CHECKER,
      collect: (monitor: any) => ({
        isDragging: !!monitor.isDragging()
      })
    }),
    []
  )

  return (
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
    <span ref={drag} className={`py-2 px-3 rounded-full ${color}`}></span>
  )
}

export default Checker
