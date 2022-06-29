import React, { FC } from 'react'
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
  return (
    <>
      {checkers.map((checker: 1 | 2, checkerIndex) => {
        // if (checkerIndex > 5) return
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
    </>
  )
}

export default Checkers
