const dice = () => Math.floor(Math.random() * 6) + 1

export const rollDice = () => [dice(), dice()]
