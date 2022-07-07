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

  const hasMoves = movesRemaining.length !== 0
  const rollButtonColor = hasMoves
    ? 'bg-gray-300'
    : 'bg-blue-600 hover:bg-blue-700'
  const buttonColor = hasMoves ? 'bg-gray-300' : 'bg-blue-600 hover:bg-blue-700'

  return (
    <div className={`flex flex-col py-8 w-1/4 justify-center`}>
      <div className={``}>
        {!!activePlayer && (
          <div>
            <div>
              {/* {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />} */}
              <Dice diceRoll={diceRoll} activePlayer={activePlayer} />
              <DoublingCube cubeValue={doublingCube} />
              <button
                disabled={hasMoves}
                onClick={rollDiceHandler}
                className={`py-2 px-6 m-2 rounded ${rollButtonColor} bg-g`}
              >
                ROLL
              </button>
            </div>
            <button
              disabled={hasMoves}
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
            className={`py-2 px-6 mx-8 rounded ${buttonColor}`}
          >
            START GAME
          </button>
        )}
      </div>
    </div>
  )
}

export default GameControls
