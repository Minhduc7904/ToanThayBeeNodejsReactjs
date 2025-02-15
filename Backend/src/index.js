import express from 'express';
import dotenv from 'dotenv';
import { AppRoute } from './routes/AppRoute';
dotenv.config();

const app = express()
const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME

app.use(express.json())
express.urlencoded({ extended: true })

AppRoute(app);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})