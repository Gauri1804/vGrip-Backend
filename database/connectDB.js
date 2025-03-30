import mongoose from "mongoose"
import chalk from 'chalk'; // Import chalk
export const connectDB = async () => {
    try {
        // console.log(process.env.MONGO_URL)
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(chalk.bgBlack.white.bold(`database connected successful connected: ${connection.connection.host}`));
    } catch (error) {
        console.error(`error in database connection: ${error.message}`);
        process.exit(1); //for failure
    }
}

