import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppRoute } from './routes/AppRoute';
dotenv.config();

const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001"; // Lấy từ biến môi trường


app.use(cors({
    origin: frontendUrl,
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json())
express.urlencoded({ extended: true })

AppRoute(app);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})