import type { FC } from 'react'
import { PLAYER_1_BAR, PLAYER_2_BAR } from 'src/utils/config'

import { ActiveChecker } from 'src/@types/types'

import Checker from '../Checker/Checker'

interface CheckersProps {
  // board: Array<1 | 2>[]
  pointIndex: number
  // checkerColor: ActiveChecker
  checkers: (1 | 2)[]
}

const Checkers: FC<CheckersProps> = ({ pointIndex, checkers }) => {
  //TODO: add handling for over 5 checkers
  const overFlowChecker =
    pointIndex === PLAYER_1_BAR
      ? 'top-0'
      : pointIndex === PLAYER_2_BAR
      ? 'bottom-0'
      : pointIndex > 12
      ? 'bottom-0'
      : 'top-0'

  const checkerAlign =
    pointIndex === PLAYER_1_BAR
      ? 'content-end'
      : pointIndex === PLAYER_2_BAR
      ? 'content-end'
      : pointIndex > 12
      ? 'content-end'
      : 'content-end'

  return (
    <div
      className={`relative flex flex-col ${checkerAlign} flex-shrink max-h-full`}
    >
      {checkers.map((checker: 1 | 2, index, arr) => {
        if (index >= 5 && index === arr.length - 1) {
          // if (index > 5) {
          return (
            <p className={`absolute mx-auto text-white font-bold`}>{`+${
              index - 4
            }`}</p>
          )
        }
        if (index < 5)
          return (
            checker && (
              <Checker
                key={`checker ${pointIndex + Math.random()}`}
                point={pointIndex}
                checkerColor={checker}
              />
            )
          )
      })}
    </div>
  )
}

export default Checkers
