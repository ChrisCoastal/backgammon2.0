import { log } from 'console'
import React from 'react'

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

  return (
    <span
      key={Math.random()}
      // onClick={moveHandler}
      className={`py-2 px-3 rounded-full ${color}`}
      draggable={active}
      tabIndex={1}
      onDragStart={() => dragHandler(checkerPosition)}
      onDrag={() => dragHandler(checkerPosition, window.event)}
      onDragEnd={() => console.log('ENDED!!')} // TODO: not firing
      // onDragEnd={() => dragEndHandler(checkerPosition, window.event)}
    >
      {checkerColor}
    </span>
  )
}

export default Checker
