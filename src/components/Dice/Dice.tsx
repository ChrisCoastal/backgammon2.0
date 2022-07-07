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
      <ul className={`flex gap-2`}>
        {diceRoll.map((dice, i) => (
          <li
            key={Math.random()}
            className={`flex justify-center items-center ${diceColor[i]} w-16 h-16 mx-2 rounded-md text-white text-xl font-extrabold`}
          >
            <p className={``}>{dice > 0 && dice}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Dice
