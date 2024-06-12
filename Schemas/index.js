import mongoose from 'mongoose'

export const pricesSchema = new mongoose.Schema({
    type: String,
    price: String
})

export const hoursSchema = new mongoose.Schema({
    afternoon: [String],
    evening: [String],
})

export const messagesContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
})

export const movieBillboardObjSchema = new mongoose.Schema({
    backdrop_path: String,
    genre_ids: [Number],
    id: Number,
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    title: String,
    vote_average: Number,
    vote_count: Number
})

export const movieBillboardSchema = new mongoose.Schema({
    results: [movieBillboardObjSchema]
})


export const schedulesObjSchema = new mongoose.Schema({
    hour: String,
    seats: [Boolean],
})
export const seatsdateshoursObjSchema = new mongoose.Schema({
    date: String,
    schedules: [schedulesObjSchema]
})
export const seatsdateshoursSchema = new mongoose.Schema({
    seatsdateshours: [seatsdateshoursObjSchema]
})
export const seatsdateshourstheatersSchema = new mongoose.Schema({results:[{
    teather_movie_id: String,
    seatsdateshours: [seatsdateshoursObjSchema]
}]})