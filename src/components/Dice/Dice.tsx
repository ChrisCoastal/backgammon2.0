// helpers
import { getDiceRoll } from '../../utils/gameState'

// types
import { DiceRoll } from '../../@types/types'
import { BOARD_COLORS } from 'src/utils/config'

interface DiceProps {
  diceRoll: DiceRoll
  activePlayer: 1 | 2 | null
}

const Dice = ({ activePlayer, diceRoll }: DiceProps) => {
  // const diceRoll = getDiceRoll(dispatch)

  // const [die1, die2] = diceRoll

  //TODO: add die component

  const diceColor =
    activePlayer === null
      ? [BOARD_COLORS.player1dice, BOARD_COLORS.player2dice]
      : activePlayer === 1
      ? [BOARD_COLORS.player1dice, BOARD_COLORS.player1dice]
      : [BOARD_COLORS.player2dice, BOARD_COLORS.player2dice]

  return (
    <div>
      <ul>
        {diceRoll.map((dice, i) => (
          <li
            key={Math.random()}
            className={`inline-block ${diceColor[i]} py-8 px-8 mx-2 rounded-sm text-white text-xl font-extrabold`}
          >
            <p>{dice > 0 && dice}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dice
