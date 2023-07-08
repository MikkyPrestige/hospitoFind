import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const rootRouter = express.Router()

rootRouter.get('^/$|/index(.html)?', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'views', 'index.html'))
})

export default rootRouter