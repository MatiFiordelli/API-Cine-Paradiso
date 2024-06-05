import mongoose from 'mongoose'
import 'dotenv/config'

export const connectMongoDB = async() => {
    const mongoUser = process.env.USER_DB
    const password = process.env.PASSWORD_DB

    try {
        await mongoose.connect(`mongodb+srv://${mongoUser}:${password}@cluster0.2bgyfbp.mongodb.net/?retryWrites=true&w=majority`)
    } catch (e) { 
        console.log('An error occurred while connecting to the Database: ' + e) 
    }
}