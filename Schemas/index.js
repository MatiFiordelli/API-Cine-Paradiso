import mongoose from 'mongoose'

export const pricesSchema = new mongoose.Schema({
    type: String,
    price: String
})

export const messagesContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
})