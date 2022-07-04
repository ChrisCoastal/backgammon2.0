import React, { FC } from 'react'
import { ActivePlayer, DiceRoll, DiceState } from 'src/@types/types'

// components
import Dice from '../Dice/Dice'
import DoublingCube from '../Dice/DoublingCube'

interface GameControlsProps {
  activePlayer: ActivePlayer
  diceState: DiceState
  movesRemaining: number[]
  rollDiceHandler: () => void
  startGameHandler: () => void
  endTurnHandler: () => void
}

const GameControls: FC<GameControlsProps> = ({
  activePlayer,
  diceState,
  movesRemaining,
  rollDiceHandler,
  startGameHandler,
  endTurnHandler
}) => {
  // TODO: add condition so end turn is required before roll
  const { diceRoll, doublingCube } = diceState

  const disable = movesRemaining.length !== 0
  const rollButtonColor = disable
    ? 'bg-gray-300'
    : 'bg-blue-600 hover:bg-blue-700'
  const buttonColor = disable ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div className={`py-16 h-screen`}>
      <div className={`py-16 bg-zinc-200`}>
        {!!activePlayer && (
          <div>
            <div>
              {/* {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />} */}
              <Dice diceRoll={diceRoll} activePlayer={activePlayer} />
              <DoublingCube cubeValue={doublingCube} />
              <button
                disabled={disable}
                onClick={rollDiceHandler}
                className={`py-2 px-6 m-2 rounded ${rollButtonColor} bg-g`}
              >
                ROLL
              </button>
            </div>
            <button
              disabled={disable}
              onClick={endTurnHandler}
              className={`py-2 px-6 m-2 rounded ${buttonColor}`}
            >
              END TURN
            </button>
            <button
              onClick={() => console.log('undo')}
              className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
            >
              UNDO
            </button>
          </div>
        )}
        {!activePlayer && (
          <button
            onClick={() => startGameHandler()}
            disabled={!!activePlayer}
            className={`py-2 px-6 m-2 rounded ${buttonColor}`}
          >
            START GAME
          </button>
        )}
      </div>
    </div>
  )
}

export default GameControls
