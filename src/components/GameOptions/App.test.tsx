import { render, screen } from '@testing-library/react'

describe('<App />', () => {
  it('should render the App', () => {
    // test here
  })
})

// BROAD OUTLINE
// app is loaded
// user logs in
// user is taken to profile page
// user presses button to start game
// a player can play with another person or against the AI
// game ends when a player wins or a player quits
// when a game ends players have an option to play again

// GAME SETUP
// choice of board orientation
// choice of checker color
// choice of match length
// choice to use doubling cube
// chouette
// auto doubling on init roll
// jacoby rule
// beaver rule

// GAME PLAY

// a game is initialized
// checkers are placed in their starting positions
// initial roll is taken (1 dice each player)

// dice are kept in useState
// {pl1Dice: [num, num], pl2Dice: [num, num]}
// checker positions are kept in useState
// [player1:{check1: pos, check2: pos...}, player2:{check1: pos, check2: pos...}]
// in backend this can be stored as two separate objects

// Movement
// random dice roll chooses who goes first
// the player chosen to go first rolls their dice
// the dice numbers constitute two separate moves, but can be taken by a single checker
// if possible, both moves must be taken (if neither can be used, the player forfiets their turn)
// if both dice roll the same number, each dice may be taken twice

// Hitting
// a checker alone on a point may be hit if the opposing play can move to that point
// two or more checkers on the same point cannot be hit; opponents cannot move to this square

// Entering
// any checker on the bar must be moved to the board before any other moves are taken
// checkers are moved into the opponents home board (corresponding to the number rolled)

// Bearing Off
// all checkers must be in the home board
// as much of the roll must be taken as possible

// Doubling and Back/Gammons
// players can choose to double at the start of their turn before rolling
// doubling increases the value of the game
// if a player wins and their opponent has bore of 0 checkers, the game is worth double (execpt jacoby)
