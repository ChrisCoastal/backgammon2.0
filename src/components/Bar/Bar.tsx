import React from 'react'

// types
import { ActiveChecker } from 'src/@types/types'

// components
import Checker from '../Checker/Checker'

interface BarProps {
  barCheckers: ActiveChecker[]
}

const Bar: React.FC<BarProps> = ({ barCheckers }) => {
  return (
    <div className={`flex-column w-80 h-16 bg-amber-300`}>
      {barCheckers.map(
        (checker) =>
          checker && (
            <Checker
              key={`checker ${Math.random()}`}
              point="bar"
              checkerColor={checker}
            />
          )
      )}
    </div>
  )
}

export default Bar
