import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const rootRouter = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

rootRouter.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

export default rootRouter