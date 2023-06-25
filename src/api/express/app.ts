import express from "express"
import { urlencoded } from "body-parser"
import { static as staticAssets } from "express";
import {Game, GameState, initGame, tryLetter} from "../../domain/game";
import {LetterState, isLetterDiscovered} from "../../domain/word";

let game = initGame("cheese", 5)

export function createApp () {
  const app = express()

  app.use (staticAssets("assets"))
  app.use (urlencoded({
    extended: true
  }))

  app.get ("/", (_req, res) => {
    res.render ("index.ejs")
  })

  app.get ("/game", (_req, res) => {
    res.json (gameView(game))
  })

  app.get("/try-letter/:letter", (req, res) => {
    game = tryLetter(game, req.params.letter)

    res.json (gameView(game))
  })

  return app
}

type LetterStateView = 
  | { type: "hidden" }
  | { type: "discovered", letter: string }

type GameView = {
  state: GameState
  letters: LetterStateView[]
  maxFailedAttempts: number
  failedAttempts: number
  triedLetters: string[]
}

function gameView (game: Game): GameView {
  const {
    state,
    word,
    maxFailedAttempts,
    failedAttempts,
    triedLetters
  } = game

  return {
    failedAttempts,
    maxFailedAttempts,
    letters: word.letters.map (letter => letter.type === "hidden"
      ? { type: "hidden" }
      : { type: "discovered", letter: letter.letter }
    ),
    state,
    triedLetters
  }
}