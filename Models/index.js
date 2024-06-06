import mongoose from 'mongoose'
import { pricesSchema, hoursSchema, messagesContactSchema } from '../Schemas/index.js'

export const Prices = mongoose.model('Prices', pricesSchema)
export const Hours = mongoose.model('Hours', hoursSchema)
export const MessagesContact = mongoose.model('MessagesContact', messagesContactSchema)