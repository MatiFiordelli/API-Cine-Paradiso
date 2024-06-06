import 'dotenv/config'
import { Prices, Hours, MessagesContact, MovieBillboard } from '../Models/index.js'
import fetch from 'node-fetch'

const welcome = (req, res) => {
    res.send('Welcome').status(200)
}

const template = async (req, res, funct) => {
    try {
        await funct(req, res)
    } catch (e) {
        console.log(e)
        res.status(500)
    }
}

const postMessageContact = async (req, res) => {
    try {
        const newContactMessage = new MessagesContact(req.body)
        await newContactMessage.save()
        console.log('Successfully inserted')
        res.json({ ok: true })
    } catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

const getPrices = async (req, res) => {
    const prices = await Prices.find({})
    res.send(prices)
}

const getHours = async (req, res) => {
    const hours = await Hours.find({})
    res.send(hours)
}

const extractMovieBillboard = async (req, res) => {
    const endPointBg = "https://api.themoviedb.org/3"
    const apiKey = "4d1a073d6e646d93ce0400ffa3b8d13e"
    const language = "es-ES"
    const url = `${endPointBg}/movie/now_playing?api_key=${apiKey}&language=${language}&page=1&include_adult=false&region=AR`
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            //res.send(data.results)
            insertRecord(data.results)
        })

    const insertRecord = async (data) => {
        let obj = {}
        let arr = []
        data.forEach((e)=>{
            obj = {
                backdrop_path: e.backdrop_path,
                genre_ids: e.genre_ids,
                id: e.id,
                original_language: e.original_language,
                original_title: e.original_title,
                overview: e.overview,
                popularity: e.popularity,
                poster_path: e.poster_path,
                release_date: e.release_date,
                title: e.title,
                vote_average: e.vote_average,
                vote_count: e.vote_count
            }
            arr.push(obj)
        })

        await MovieBillboard.deleteMany({})
        const newMoviebillboard = new MovieBillboard({results: arr})

        try {
            await newMoviebillboard.save()
            console.log('Successfully inserted')
            res.sendStatus(200)
        } catch (e) {
            console.log('An error occurred while inserting into the Database: ' + e)
        }
    }

}

const getMovieBillboard = async (req, res) => {
    const movieBillboard = await MovieBillboard.find({})
    res.send(movieBillboard)
}


export {
    welcome,
    template,
    getPrices,
    getHours,
    extractMovieBillboard,
    getMovieBillboard,
    postMessageContact
}