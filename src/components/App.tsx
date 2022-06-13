import React from 'react'

import { DndProvider } from 'react-dnd'
// import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import GameBoard from './GameBoard/GameBoard'

function App() {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <GameBoard />
      </DndProvider>
    </div>
  )
}

export default App
