import 'dotenv/config'
import { Prices, Hours, MessagesContact } from '../Models/index.js'
import fetch from 'node-fetch'

const welcome = (req, res)=> {
    res.send('Welcome').status(200)
}

const template = async(req, res, funct) => {
    try{
       await funct(req, res)
    } catch(e){
        console.log(e)
        res.status(500)
    }
}

const postMessageContact = async(req, res) => {
    try{
        const newContactMessage = new MessagesContact(req.body)
        await newContactMessage.save()
        console.log('Successfully inserted')
        res.json({ok:true})
    }catch(e){
        console.log(e)
        res.sendStatus(500)
    }
}

const getPrices = async(req, res) => {
    const prices = await Prices.find({})
    res.send(prices)
}

const getHours = async(req, res) => {
    const hours = await Hours.find({})
    res.send(hours)
}

const extractMovieBillboard = async(req, res) => {
    const endPointBg = "https://api.themoviedb.org/3"
    const apiKey = "4d1a073d6e646d93ce0400ffa3b8d13e"
    const language = "es-ES"
    const url = `${endPointBg}/movie/now_playing?api_key=${apiKey}&language=${language}&page=1&include_adult=false&region=AR`
    fetch(url)
        .then((res)=>res.json())
        .then((data)=>res.send(data.results))
}



export {
    welcome,
    template,
    getPrices,
    getHours,
    extractMovieBillboard,
    postMessageContact
}