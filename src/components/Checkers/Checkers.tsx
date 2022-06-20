import React, { FC } from 'react'
import { ActiveChecker, CheckerPositions } from 'src/@types/types'

import Checker from '../Checker/Checker'

interface CheckersProps {
  // table: Array<1 | 2>[]
  pointIndex: number
  // checkerColor: ActiveChecker
  checkers: (1 | 2)[]
}

const Checkers: FC<CheckersProps> = ({
  pointIndex,

  checkers
}) => {
  return (
    <>
      {checkers.map((checker: 1 | 2, checkerIndex) => {
        if (checkerIndex > 5) return
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
