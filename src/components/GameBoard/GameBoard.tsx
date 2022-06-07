import { log } from 'console'
import React, { useEffect, useState } from 'react'

// types
import { BoardPositions } from 'src/@types/types'

// helpers
import { rollDice } from 'src/utils/helpers'

// config
import { INITIAL_POSITIONS } from '../../utils/config'
import Checker from '../Checker/Checker'
import Dice from '../Dice/Dice'

const GameBoard = () => {
  const [turnHistory, setTurnHistory] = useState([])
  const [activePlayer, setActivePlayer] = useState<null | 1 | 2>(null)
  const [diceRoll, setDiceRoll] = useState<Array<number>>([0, 0, 0, 0])
  const [checkerPositions, setCheckerPositions] = useState(INITIAL_POSITIONS)

  const diceRollHandler = () => {
    const roll = rollDice()
    if (!activePlayer) {
      setDiceRoll(() => [roll[0], 0, 0, roll[1]])
      activePlayerHandler()
    }
    if (activePlayer === 1) setDiceRoll(() => [roll[0], roll[1], 0, 0])
    if (activePlayer === 2) setDiceRoll(() => [0, 0, roll[0], roll[1]])
  }

  const moveHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
    const checker = event.currentTarget.innerText
    console.log('click', checker, event.target)
    if (checker === activePlayer?.toString()) {
      console.log()
    }
    // if (event.target === activePlayer)
  }

  const activePlayerHandler = () => {
    // initial player
    if (!activePlayer && diceRoll[0] > diceRoll[3]) setActivePlayer(() => 1)
    if (!activePlayer && diceRoll[0] < diceRoll[3]) setActivePlayer(() => 2)
    if (!activePlayer && diceRoll[0] === diceRoll[3]) {
      diceRollHandler()
    }
    if (activePlayer === 1) setActivePlayer(() => 2)
    if (activePlayer === 1) setActivePlayer(() => 1)
  }

  const endTurnHandler = () => {
    return
  }

  const checkerDragHandler = (startPoint: number, event: DragEvent) => {
    const openPoints = getOpenPoints(startPoint)
    console.log(event)

    console.log('dragging', startPoint)
  }

  const getOpenPoints = (startPoint: number) => {
    return
  }

  console.log(checkerPositions)

  return (
    <div>
      {checkerPositions.map((point, pointIndex) => (
        <div key={pointIndex}>
          <div>{pointIndex + 1}</div>
          <div>
            {point.map((checker) =>
              checker > 0 ? (
                <Checker
                  key={1 + Math.random()}
                  // activeChecker={activeChecker1}
                  activeChecker={activePlayer}
                  dragHandler={checkerDragHandler}
                  checkerPosition={pointIndex + 1}
                  checkerColor={checker}
                />
              ) : null
            )}
          </div>
        </div>
      ))}
      {diceRoll && <Dice diceRoll={diceRoll} activePlayer={activePlayer} />}
      <button
        onClick={diceRollHandler}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        ROLL
      </button>
      <button
        onClick={endTurnHandler}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        END TURN
      </button>
      <button
        onClick={activePlayerHandler}
        disabled={!!activePlayer}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        START GAME
      </button>
    </div>
  )
}

export default GameBoard
