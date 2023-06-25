import {discoverLetter, discoverWord, initWord, isLetterDiscovered, Word} from "./word";

export type GameState = 'won' | 'lost' | 'running'

export type Game = {
  maxFailedAttempts: number
  failedAttempts: number
  state: GameState
  word: Word
  triedLetters: string[]
}

/**
 * Initialise a new game.
 *
 * @param word
 * @param maxFailedAttempts
 */
export function initGame(word: string, maxFailedAttempts: number): Game {
  return {
    maxFailedAttempts: maxFailedAttempts,
    failedAttempts: 0,
    state: "running",
    word: initWord(word),
    triedLetters: []
  }
}

/**
 * Update the game state by trying a new letter.
 *
 * @param word
 * @param maxFailedAttempts
 * @param failedAttempts
 * @param state
 * @param letter
 */
export function tryLetter({word, maxFailedAttempts, failedAttempts, state, triedLetters}: Game, letter: string): Game {
  const {newWord, type} = discoverLetter(word, letter)

  const newFailedAttempts = type === "notFound"
    ? failedAttempts + 1
    : failedAttempts

  const areAllLettersDiscovered = newWord.letters.every(isLetterDiscovered)

  const newState = maxFailedAttempts <= newFailedAttempts
    ? "lost"
    : areAllLettersDiscovered
      ? "won"
      : state

  return {
    word: newState === "lost"
      ? discoverWord(newWord)
      : newWord,
    failedAttempts: newFailedAttempts,
    maxFailedAttempts,
    state: newState,
    triedLetters: [ ...triedLetters, letter ]
  }
}

