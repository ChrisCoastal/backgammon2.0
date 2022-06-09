import { log } from 'console'
import React, {
  ReducerAction,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react'

// types
import { BoardPositions, CheckerPositionsState } from 'src/@types/types'

// config
import { INITIAL_POSITIONS } from '../../utils/config'
import Checker from '../Checker/Checker'
import Dice from '../Dice/Dice'
import GameOptions from '../GameOptions/GameOptions'

interface tableState {
  turnHistory: {}[]
  checkerPositions: CheckerPositionsState
  activePlayer: 1 | 2 | null
  diceState: { diceRoll: number[]; doublingCube: number }
  validMoves: ValidMoveState
}

const initialTableState: tableState = {
  turnHistory: [],
  checkerPositions: {
    table: INITIAL_POSITIONS,
    bar: [],
    bearOff1: [],
    bearOff2: []
  },
  activePlayer: null,
  diceState: {
    diceRoll: [0, 0, 0, 0],
    doublingCube: 1
  },
  validMoves: { dice: null, roll: null, point: null, action: null }
}

interface ValidMoveState {
  dice: number | null
  roll: number | null
  point: number | null
  action: string | null
}

type DropState = ValidMoveState[]

interface ReducerActions {
  type: 'setActivePlayer' | 'setDiceRoll' | 'setMove' | 'reset'
  payload?: any
}

const GameBoard = () => {
  // const [turnHistory, setTurnHistory] = useState([])
  // const [options, setOptions] = useState([])
  // const [activePlayer, setActivePlayer] = useState<null | 1 | 2>(null)
  // const [diceRoll, setDiceRoll] = useState([0, 0, 0, 0])
  // const [checkerPositions, setCheckerPositions] = useState(
  //   initialTableState.checkerPositions
  // )
  // const [dropPoints, setDropPoints] = useState<DropState>([])

  const [state, dispatch] = useReducer(reducer, initialTableState)
  // const [state, dispatch] = useReducer(reducer, initialTableState, init)

  function reducer(state: tableState, action: ReducerActions): tableState {
    switch (action.type) {
      case 'setActivePlayer':
        return (state.activePlayer = action.payload)
      case 'setDiceRoll':
        return (state.diceState.diceRoll = action.payload)
      case 'setMove':
        return (state.checkerPositions = action.payload)
      case 'reset':
        return initialTableState
      default:
        return state
    }
  }

  // function init(statePayload: CheckerPositionsState): tableState {
  //   return statePayload
  // }

  const { table, bar, bearOff1, bearOff2 } = state.checkerPositions
  const { diceRoll, doublingCube } = state.diceState
  const { activePlayer } = state

  // const optionsHandler = (newState: object) => {
  //   setOptions((prevOptions) => ({ ...prevOptions, ...newState }))
  // }

  const diceRollHandler = () => {
    const dice = () => Math.floor(Math.random() * 6) + 1
    const die1 = dice()
    const die2 = dice()
    if (!activePlayer)
      dispatch({ type: 'setDiceRoll', payload: [die1, 0, 0, die2] })
    if (activePlayer === 1)
      dispatch({ type: 'setDiceRoll', payload: [die1, die2, 0, 0] })
    if (activePlayer === 2)
      dispatch({ type: 'setDiceRoll', payload: [0, 0, die1, die2] })
    // if (!activePlayer) setDiceRoll((prev) => [die1, 0, 0, die2])
    // if (activePlayer === 1) setDiceRoll((prev) => [die1, die2, 0, 0])
    // if (activePlayer === 2) setDiceRoll((prev) => [0, 0, die1, die2])
  }

  const endTurnHandler = () => {
    if (activePlayer === 1)
      return dispatch({ type: 'setActivePlayer', payload: 2 })
    if (activePlayer === 2)
      return dispatch({ type: 'setActivePlayer', payload: 1 })
  }

  const checkerDragHandler = (startPoint: number, event: DragEvent) => {
    const openPoints = getOpenPoints()
    console.log(openPoints, activePlayer)

    const validMoves = getValidMoves(openPoints, startPoint)
    // console.log(event)
    // console.log('dragging', startPoint)
  }

  const getBarCheckers = () => {}
  const getHomeCheckers = () => {}

  const getOpenPoints = () => {
    const openPoints = table.map((point, i) => {
      return point.length === 0
        ? `open`
        : point.length === 1 && point[0] !== activePlayer
        ? `blot`
        : point.length > 1 && point[0] !== activePlayer
        ? `closed`
        : `anchor`
    })

    return openPoints
  }

  const getValidMoves = (
    openPoints: ('open' | 'blot' | 'closed' | 'anchor')[],
    startPoint: number
  ) => {
    if (!activePlayer) return

    // checkers on the bar must be moved first
    if (bar.includes(activePlayer)) console.log('bar')

    // player 1 moves higher point to lower; player 2 vice-versa
    const direction = activePlayer === 1 ? -1 : 1

    const playerRoll = diceRoll
      .filter((die) => die !== 0)
      .map((die) => die * direction)
    // doubles get 4 roll
    if (playerRoll[0] === playerRoll[1]) playerRoll.push(...playerRoll)

    const movesArr: number[] = []
    const combinations = playerRoll.reduce((pV, cV, i) => {
      const moves = [...pV, i > 0 ? pV[i - 1] + cV : cV]
      return moves
    }, movesArr)
    combinations.shift()

    const moves = [...playerRoll, ...combinations]

    // const firstMoves = playerRoll.map((die, i) => {
    const validMoves = moves.map((move, i) => {
      const moveToPoint = startPoint + move
      if (
        moveToPoint > 23 ||
        moveToPoint < 0 ||
        openPoints[moveToPoint] === 'closed'
      )
        return {
          dice: i,
          roll: move,
          point: moveToPoint + 1,
          action: 'closed'
        }
      else
        return {
          dice: i,
          roll: move,
          point: moveToPoint + 1,
          action: openPoints[moveToPoint]
        }
    })

    console.log(validMoves)
    return validMoves
  }

  const moveCheckerHandler = () => {
    'moved'
  }

  const moveHandler = (event: React.MouseEvent<HTMLSpanElement>) => {
    const checker = event.currentTarget.innerText
    console.log('click', checker, event.target)
    if (checker === activePlayer?.toString()) {
      console.log()
    }
    // if (event.target === activePlayer)
  }

  useEffect(() => {
    if (activePlayer) return
    console.log('init player')

    initActivePlayer()
  }, diceRoll)

  const initActivePlayer = () => {
    // initial player
    if (!activePlayer && diceRoll[0] > diceRoll[3])
      return dispatch({ type: 'setActivePlayer', payload: 1 })
    if (!activePlayer && diceRoll[0] < diceRoll[3])
      return dispatch({ type: 'setActivePlayer', payload: 2 })
    if (!activePlayer && diceRoll[0] !== 0 && diceRoll[0] === diceRoll[3]) {
      console.log('DOUBLE', diceRoll)

      diceRollHandler()
    }
    // if (activePlayer === 1) dispatch({type: 'setActivePlayer', payload: 2})
    // if (activePlayer === 2) dispatch({type: 'setActivePlayer', payload: 1})
  }

  const startGame = () => {
    diceRollHandler()
  }

  const dropPoint = 'bg-green-200'
  // ${dropPoints.map((point) =>
  //   point.point === pointIndex && point.action === 'open'
  //     ? 'bg-green-200'
  //     : ''
  // )}

  // const validPointHighlight = dropPoints'bg-green-200'

  return (
    <div>
      {table.map((point, pointIndex) => (
        <div key={pointIndex}>
          <div className={`bg-orange-300 w-48 h-8 mt-4`}>{pointIndex + 1}</div>
          <div>
            {point.map((checker) =>
              checker > 0 ? (
                <Checker
                  key={1 + Math.random()}
                  // activeChecker={activeChecker1}
                  activeChecker={activePlayer}
                  dragHandler={checkerDragHandler}
                  checkerPosition={pointIndex}
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
        onClick={startGame}
        disabled={!!activePlayer}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        START GAME
      </button>
      <button
        onClick={() => dispatch({ type: 'reset' })}
        disabled={!!activePlayer}
        className={`py-2 px-6 m-2 rounded bg-blue-600 hover:bg-blue-700`}
      >
        END GAME
      </button>
      {/* <GameOptions optionsHandler={optionsHandler} /> */}
    </div>
  )
}

export default GameBoard
