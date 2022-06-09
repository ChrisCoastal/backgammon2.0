import React from 'react'

interface GameOptionsProps {
  optionsHandler: Function
}

const GameOptions = ({ optionsHandler }: GameOptionsProps) => {
  const flipBoardHandler = () => {
    return
  }

  return (
    <div>
      <button onClick={flipBoardHandler}>FLIP BOARD</button>
    </div>
  )
}

export default GameOptions
