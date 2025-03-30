import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './database/connectDB.js';
import chalk from 'chalk'; // Import chalk
import authRoute from './routes/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from 'cors'
dotenv.config();

const app = express();

app.use(express.json()); // allow us to parse json data 
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use("/api/v1/auth", authRoute)

const PORT = process.env.PORT

app.listen(PORT || 5000, () => {
    connectDB();
    console.log(chalk.bgYellow.red.bold(`Server is listening at port ${PORT}`));
})