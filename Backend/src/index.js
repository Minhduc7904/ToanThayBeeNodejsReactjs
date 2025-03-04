// index.js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import { AppRoute } from './routes/AppRoute.js'
import db from "./models"
import os from "os"
import path from "path"
dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4000" 

app.use("/images", express.static(path.join(__dirname, "public")))

// Kích hoạt cookieParser
app.use(cookieParser())

// Cấu hình CORS cho phép gửi cookie kèm theo
app.use(cors({
    origin: frontendUrl,
    credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
