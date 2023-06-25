import {createApp} from "./app";

async function start () {
  const app = createApp()

  app.listen (3000, () => console.log ("Listening"))
}

start().catch(console.error)