import React from 'react'
import { ReducerActions } from '../../@types/types'

interface DiceProps {
  dispatch: React.Dispatch<ReducerActions>
  activePlayer: 1 | 2 | null
}

const Dice = ({ activePlayer, dispatch }: DiceProps) => {
  const dice = () => Math.floor(Math.random() * 6) + 1

  const getDiceRoll = () => {
    // // const [die1, die2] = [dice(), dice()]
    // const [die1, die2] = [6, 1]
    const diceRoll = [6, 1]
    const [die1, die2] = diceRoll

    const roll = !activePlayer
      ? [die1, 0, 0, die2]
      : activePlayer === 1
      ? [die1, die2, 0, 0]
      : [0, 0, die1, die2] // ∴ activePlayer === 2

    dispatch({
      type: 'setDice',
      payload: { roll: roll }
    })

    return [die1, die2]
  }
  //TODO: add die component
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
