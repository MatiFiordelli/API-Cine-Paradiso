import mongoose from 'mongoose'
import { userSchema } from '../Schemas/index.js'

export const Users = mongoose.model('Users', userSchema)