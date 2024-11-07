import express from "express"
import cors from "cors"
import login from "./login.route.js"
import patients from "./patients.route.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.set('ngrok-skip-browser-warning', 'true');
    next();
  });
  
app.use("/patients", patients)
app.use("/login", login)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

export default app
