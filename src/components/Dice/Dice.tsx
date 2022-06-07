import React from 'react'

interface DiceProps {
  diceRoll: Array<number | null>
  activePlayer: 1 | 2 | null
}

const Dice = ({ diceRoll, activePlayer }: DiceProps) => {
  console.log(diceRoll)

  return (
    <div>
      <ul>
        {diceRoll.map((dice) => (
          <li key={Math.random()}>{dice}</li>
        ))}
      </ul>
    </div>
  )
}

export default Dice
