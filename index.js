import cors from 'cors'
import express from 'express'
import { connectMongoDB } from './Connection/index.js'
import { 
    welcome,
    template,
    getPrices,
    getHours,
    extractMovieBillboard,
    getMovieBillboard,
    postMessageContact,
    getTrailers
} from "./Controllers/index.js"

await connectMongoDB()
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




app.get('/', (req, res) => welcome(req, res))
app.post('/post-message-contact', (req, res) => template(req, res, postMessageContact))
app.get('/get-prices', (req, res) => template(req, res, getPrices))
app.get('/get-hours', (req, res) => template(req, res, getHours))
app.get('/extract-movie-billboard', (req, res) => template(req, res, extractMovieBillboard))
app.get('/get-movie-billboard', (req, res) => template(req, res, getMovieBillboard))
app.get('/get-trailers', (req, res) => template(req, res, getTrailers))

//hacer la de los trailers



app.options('/', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.sendStatus(200)
})

app.listen(PORT, () => console.log('Server running'))