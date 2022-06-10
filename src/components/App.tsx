import React from 'react'

import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import GameBoard from './GameBoard/GameBoard'

function App() {
  return (
    <div className="App">
      <DndProvider backend={TouchBackend}>
        <GameBoard />
      </DndProvider>
    </div>
  )
}

export default App
