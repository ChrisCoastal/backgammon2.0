// helpers
import { getDiceRoll } from '../../utils/gameState'

// types
import { DiceRoll } from '../../@types/types'

interface DiceProps {
  diceRoll: DiceRoll
  activePlayer: 1 | 2 | null
}

const Dice = ({ activePlayer, diceRoll }: DiceProps) => {
  // const diceRoll = getDiceRoll(dispatch)

  // const [die1, die2] = diceRoll

  // const roll = !activePlayer
  //   ? [die1, 0, 0, die2]
  //   : activePlayer === 1
  //   ? [die1, die2, 0, 0]
  //   : [0, 0, die1, die2] // ∴ activePlayer === 2

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
