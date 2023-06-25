import {deepEqual, throws} from "node:assert/strict"
import {describe, it} from "node:test";
import {Game, initGame, tryLetter} from "../src/domain/game";
import {discoverLetter, initWord, Word} from "../src/domain/word";
import {InvalidLetterError} from "../src/domain/errors/invalid-letter.error";

describe("word", function () {
    describe("initWord", function () {
        it("should return the word with only unknown letters", function () {
            // Given
            const word = "cheese"

            // When
            const initiated = initWord (word)

            // Then
            deepEqual(initiated, {
                word: "cheese",
                letters: [
                    {
                        type: "hidden",
                        letter: "c"
                    },
                    {
                        type: "hidden",
                        letter: "h"
                    },
                    {
                        type: "hidden",
                        letter: "e"
                    },
                    {
                        type: "hidden",
                        letter: "e"
                    },
                    {
                        type: "hidden",
                        letter: "s"
                    },
                    {
                        type: "hidden",
                        letter: "e"
                    }
                ]
            } satisfies Word)
        })
    })

    describe("discover", function () {
        it("should be able to discover letters if the given letter is in the word", function () {
            // Given
            const word = initWord("cheese")

            // When
            const result = discoverLetter (word, "e")

            // Then
            deepEqual(result, {
                type: "found",
                newWord: {
                    word: "cheese",
                    letters: [
                        {
                            type: "hidden",
                            letter: "c"
                        },
                        {
                            type: "hidden",
                            letter: "h"
                        },
                        {
                            type: "discovered",
                            letter: "e"
                        },
                        {
                            type: "discovered",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "s"
                        },
                        {
                            type: "discovered",
                            letter: "e"
                        }
                    ]

                }
            })
        })

        it("should be able to not discover any letter if given letter is not in the word", function () {
            // Given
            const word = initWord("cheese")

            // When
            const result = discoverLetter(word, "n")

            // Then
            deepEqual(result, {
                type: "notFound",
                newWord: {
                    word: "cheese",
                    letters: [
                        {
                            type: "hidden",
                            letter: "c"
                        },
                        {
                            type: "hidden",
                            letter: "h"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "s"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        }
                    ]
                }
            })
        })

        it("should be able to tell if the submitted letter was already discovered", function () {
            // Given
            const { newWord: word } = discoverLetter(initWord("cheese"), "h")

            // When
            const result = discoverLetter(word, "h")

            // Then
            deepEqual(result, {
                type: "alreadyFound",
                newWord: {
                    word: "cheese",
                    letters: [
                        {
                            type: "hidden",
                            letter: "c"
                        },
                        {
                            type: "discovered",
                            letter: "h"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "s"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        }
                    ]
                }
            })
        })

        describe('error cases', function () {
            it("should throw an error if the string is composed of multiple letters", function () {
                // Given
                const word = initWord("chest")

                // When
                const shouldThrow = () => discoverLetter(word, "ce")

                // Then
                throws(shouldThrow, new InvalidLetterError ("ce"))
            })

            it("should throw an error if the string is empty", function () {
                // Given
                const word = initWord("chest")

                // When
                const shouldThrow = () => discoverLetter(word, "")

                // Then
                throws(shouldThrow, new InvalidLetterError (""))
            })
        })
    })
})

describe("game state", function () {
    describe("initGame", function () {
        it("should be able to start a game from a word", function () {
            // Given
            // When
            const game = initGame ("hello", 5)

            // Then
            deepEqual(game, {
                maxFailedAttempts: 5,
                failedAttempts: 0,
                state: 'running',
                word: {
                    word: "hello",
                    letters: [
                        {
                            type: "hidden",
                            letter: "h"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "l"
                        },
                        {
                            type: "hidden",
                            letter: "l"
                        },
                        {
                            type: "hidden",
                            letter: "o"
                        }
                    ]
                },
                triedLetters: []
            } satisfies Game)
        })
    })

    describe("tryLetter", function () {
        it ("should be able to not remove an attempt when the letter is correct", function () {
            // Given
            const game = initGame ("hello", 5)

            // When
            const newGame = tryLetter (game, "h")

            // Then
            deepEqual(newGame, {
                maxFailedAttempts: 5,
                failedAttempts: 0,
                state: 'running',
                word: {
                    word: "hello",
                    letters: [
                        {
                            type: "discovered",
                            letter: "h"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "l"
                        },
                        {
                            type: "hidden",
                            letter: "l"
                        },
                        {
                            type: "hidden",
                            letter: "o"
                        }
                    ]
                },
                triedLetters: [ "h" ]
            } satisfies Game)
        })

        it("should be able to remove an attempt if the letter is incorrect", function () {
            // Given
            const game = initGame ("hello", 5)

            // When
            const newGame = tryLetter (game, "j")

            // Then
            deepEqual(newGame, {
                maxFailedAttempts: 5,
                failedAttempts: 1,
                state: 'running',
                word: {
                    word: "hello",
                    letters: [
                        {
                            type: "hidden",
                            letter: "h"
                        },
                        {
                            type: "hidden",
                            letter: "e"
                        },
                        {
                            type: "hidden",
                            letter: "l"
                        },
                        {
                            type: "hidden",
                            letter: "l"
                        },
                        {
                            type: "hidden",
                            letter: "o"
                        }
                    ]
                },
                triedLetters: [ "j" ]
            } satisfies Game)
        })

        it("should be able to end the game and discover all letters if the maximum amount of attempt is reached", function () {
            // Given
            const game = initGame ("hello", 1)

            // When
            const newGame = tryLetter (game, "j")

            // Then
            deepEqual(newGame, {
                maxFailedAttempts: 1,
                failedAttempts: 1,
                state: 'lost',
                word: {
                    word: "hello",
                    letters: [
                        {
                            type: "discovered",
                            letter: "h"
                        },
                        {
                            type: "discovered",
                            letter: "e"
                        },
                        {
                            type: "discovered",
                            letter: "l"
                        },
                        {
                            type: "discovered",
                            letter: "l"
                        },
                        {
                            type: "discovered",
                            letter: "o"
                        }
                    ]
                },
                triedLetters: [ "j" ]
            } satisfies Game)
        })

        it ("should be able to end the game if the word is discovered before the maximum amount of attempt is reached", function () {
            // Given
            const game = initGame("hello", 5)

            // When
            const newGame = tryLetter(tryLetter(tryLetter(tryLetter(game, "h"), "e"), "l"), "o")

            // Then
            deepEqual(newGame, {
                maxFailedAttempts: 5,
                failedAttempts: 0,
                state: 'won',
                word: {
                    word: "hello",
                    letters: [
                        {
                            type: "discovered",
                            letter: "h"
                        },
                        {
                            type: "discovered",
                            letter: "e"
                        },
                        {
                            type: "discovered",
                            letter: "l"
                        },
                        {
                            type: "discovered",
                            letter: "l"
                        },
                        {
                            type: "discovered",
                            letter: "o"
                        }
                    ]
                },
                triedLetters: [ "h", "e", "l", "o" ]
            } satisfies Game)
        })
    })
})
