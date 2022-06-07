import React from 'react'

interface CheckerProps {
  dragHandler: Function
  activeChecker: 1 | 2 | null
  checkerColor: number
  checkerPosition: number
}

const Checker = ({
  dragHandler,
  activeChecker,
  checkerColor,
  checkerPosition
}: CheckerProps) => {
  console.log(checkerColor)

  const color =
    checkerColor === 1
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-sky-600 hover:bg-sky-700'

  const active = activeChecker === checkerColor
  console.log(checkerPosition, active, activeChecker)

  return (
    <span
      key={Math.random()}
      // onClick={moveHandler}
      className={`py-2 px-3 rounded-full ${color}`}
      draggable={active}
      tabIndex={1}
      onDrag={() => dragHandler(checkerPosition, window.event)}
    >
      {checkerColor}
    </span>
  )
}

export default Checker
