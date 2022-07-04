import React, { FC } from 'react'
import { BOARD_COLORS } from 'src/utils/config'

interface DoublingCubeProps {
  cubeValue: number
}

const DoublingCube: FC<DoublingCubeProps> = ({ cubeValue }) => {
  return (
    <div
      className={`inline-block py-4 px-4 mt-8 mx-2 rounded-sm text-red-400 text-xl font-extrabold ${BOARD_COLORS.bar}`}
    >
      <p>{cubeValue}</p>
    </div>
  )
}

export default DoublingCube
