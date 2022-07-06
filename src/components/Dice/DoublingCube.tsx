import React, { FC } from 'react'
import { BOARD_COLORS } from 'src/utils/config'

interface DoublingCubeProps {
  cubeValue: number
}

const DoublingCube: FC<DoublingCubeProps> = ({ cubeValue }) => {
  return (
    <div
      className={`inline-block w-12 mt-8 mx-2 rounded-sm text-red-400 text-xl font-extrabold ${BOARD_COLORS.bar}`}
    >
      <span className={`block relative pb-1/1`}>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
        >
          {cubeValue}
        </div>
      </span>
    </div>
  )
}

export default DoublingCube
