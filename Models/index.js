import mongoose from 'mongoose'
import { pricesSchema, messagesContactSchema } from '../Schemas/index.js'

export const Prices = mongoose.model('Prices', pricesSchema)
export const MessagesContact = mongoose.model('MessagesContact', messagesContactSchema)