import mongoose from 'mongoose'

export const userSchema = new mongoose.Schema({
    nickName: String,
    id: String
})