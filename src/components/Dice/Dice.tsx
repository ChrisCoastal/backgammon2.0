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
          <li
            key={Math.random()}
            className={`inline-flex py-3 px-3 m-2 bg-red-300 rounded-sm`}
          >
            {dice}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dice
