import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { AppRoute } from './routes/AppRoute'
import db from "./models"
import os from "os"
import path from "path"
// import cookieParser from "cookie-parser"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001" 

app.use("/images", express.static(path.join(__dirname, "public")))

// app.use(cookieParser())
// app.use(cors({
//     origin: frontendUrl,
//     credentials: true,
// }))

app.use(express.json())
express.urlencoded({ extended: true })

app.get("/healthcheck", async (req, res) => {
    try {
        await db.sequelize.authenticate()

        return res.status(200).json({
            status: "OK",
            message: "Service is running",
            timestamp: new Date().toISOString(),
            database: "Connected",
            memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            uptime: `${process.uptime().toFixed(2)} seconds`,
            cpuUsage: os.loadavg()
        })
    } catch (error) {
        return res.status(500).json({
            status: "ERROR",
            message: "Service is down",
            timestamp: new Date().toISOString(),
            error: error.message
        })
    }
})

AppRoute(app)

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})