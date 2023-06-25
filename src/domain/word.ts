import {InvalidLetterError} from "./errors/invalid-letter.error";

export type HiddenLetter = { type: 'hidden', letter: string }
export type DiscoveredLetter = { type: 'discovered', letter: string }
export type LetterState = HiddenLetter | DiscoveredLetter
export type Word = {
  word: string
  letters: LetterState[]
}

/**
 * Initialize a word.
 *
 * @param word
 * @returns
 */
export function initWord(word: string): Word {
  return {
    word,
    letters: [...word].map(letter => ({type: 'hidden', letter}))
  }
}

export type DiscoverLetterResult = { newWord: Word, type: 'found' | 'notFound' | 'alreadyFound' }

/**
 * Discovers a letter from the word.
 *
 * @param word
 * @param letters
 * @param letter
 * @returns
 */
export function discoverLetter({word, letters}: Word, letter: string): DiscoverLetterResult {
  if (letter.length > 1 || letter === "") {
    throw new InvalidLetterError(letter)
  }

  const newLetters = letters.map(l => {
    if (isLetterDiscovered(l))
      return l
    else if (isLetterMatching(l, letter))
      return toDiscovered(l)
    else
      return l
  }) satisfies LetterState[]

  const oldDiscoveredCount = letters.filter(l => l.type === "discovered")
  const newDiscoveredCount = newLetters.filter(l => l.type === "discovered")

  const isLetterInTheWord = word.includes(letter)

  const newType = oldDiscoveredCount < newDiscoveredCount
    ? "found"
    : isLetterInTheWord
      ? "alreadyFound"
      : "notFound"

  return {
    newWord: {
      word,
      letters: newLetters
    },
    type: newType
  }
}

/**
 * Returns true if the given letter is discovered; otherwise false.
 *
 * @param letter
 * @returns
 */
export function isLetterDiscovered(letter: LetterState): letter is DiscoveredLetter {
  return letter.type === "discovered"
}

/**
 * Checks if both letter are the same.
 *
 * @param letterState
 * @param letter
 * @returns
 */
function isLetterMatching(letterState: LetterState, letter: string): boolean {
  return letterState.letter === letter
}

/**
 * Transforms an hidden letter to a discovered letter.
 *
 * @param letter
 * @returns
 */
function toDiscovered({letter}: HiddenLetter): DiscoveredLetter {
  return {letter, type: 'discovered'}
}

/**
 * Discover all the letters of the word.
 *
 * @param word
 */
export function discoverWord(word: Word): Word {
  return {
    ...word,
    letters: word.letters.map(
      l => isLetterDiscovered(l) ? l : toDiscovered(l)
    )
  }
}