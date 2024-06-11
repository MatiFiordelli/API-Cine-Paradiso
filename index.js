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
    getTrailers,
    initTableSeatsdateshours,
    renewAndRemoveOldRecordsTableSeatsdateshours,
    getSeatsdateshours,
    updateSeatsdateshours
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
app.get('/init-table-seatsdateshours', (req, res) => template(req, res, initTableSeatsdateshours))
app.get('/renew-and-remove-old-records-table-seatsdateshours', (req, res) => template(req, res, renewAndRemoveOldRecordsTableSeatsdateshours))
app.get('/get-seatsdateshours', (req, res) => template(req, res, getSeatsdateshours))
app.post('/update-seatsdateshours', (req, res) => template(req, res, updateSeatsdateshours))

app.options('/', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.sendStatus(200)
})

app.listen(PORT, () => console.log('Server running'))