import cors from 'cors'
import express from 'express'
import { connectMongoDB } from './Connection/index.js'
import { 
    welcome
} from ".//Controllers/index.js"

await connectMongoDB()
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res)=> welcome(req, res))

app.options('/', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.sendStatus(200)
})

app.listen(PORT, () => console.log('Server running'))