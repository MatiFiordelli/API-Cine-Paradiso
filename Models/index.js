import mongoose from 'mongoose'
import { pricesSchema, hoursSchema, messagesContactSchema, movieBillboardSchema, seatsdateshoursSchema } from '../Schemas/index.js'

export const Prices = mongoose.model('Prices', pricesSchema)
export const Hours = mongoose.model('Hours', hoursSchema)
export const MessagesContact = mongoose.model('MessagesContact', messagesContactSchema)
export const MovieBillboard = mongoose.model('MovieBillboard', movieBillboardSchema)
export const Seatsdateshours = mongoose.model('Seatsdateshours', seatsdateshoursSchema)