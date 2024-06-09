import 'dotenv/config'
import { Prices, Hours, MessagesContact, MovieBillboard, Seatsdateshours } from '../Models/index.js'
import { getDateData, extractHours } from '../helpers/index.js'
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
        data.forEach((e) => {
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
        const newMoviebillboard = new MovieBillboard({ results: arr })

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

const getTrailers = async (req, res) => {
    const apiKey = "4d1a073d6e646d93ce0400ffa3b8d13e"
    const movieBillboard = await MovieBillboard.find({})
    const moviesArray = movieBillboard[0].results
    const movieTrailersJSONs = []
    moviesArray.forEach((e) => {
        movieTrailersJSONs.push(`https://api.themoviedb.org/3/movie/${e.id}/videos?language=es-ES&api_key=${apiKey}`)
    })

    const movieTrailersUrls = await Promise.all(
        movieTrailersJSONs.map((e) =>
            fetch(e)
                .then((res) => res.json())
                .then((data) => {
                    const params = '?si=A6MpsJXJ7WJE401P?autoplay=1&mute=1&widgetid=1'

                    if ((data?.results)?.length > 0) {
                        const key = data.results[0].key
                        return `https://www.youtube.com/embed/${key}${params}`
                    }
                })
        )
    )

    res.json({ trailers: [...movieTrailersUrls] })
}

const initTableSeatsdateshours = async (req, res) => {
    const theaters = (new Array(185)).fill(false)
    const hoursFetched = await Hours.find({})
    const hoursArray = extractHours(hoursFetched)
    const datesArray = []
    for (let i = 0; i < 7; i++) {
        datesArray.push(getDateData(i))
    }

    const seatsdateshoursObj = datesArray.map((e) => {
        const obj = {
            date: `${e.dayNumber}/${e.monthNumber}`,
            schedules: hoursArray.map((e) => {
                return {
                    hour: e,
                    seats: theaters
                }
            })
        }

        return obj
    })

    const seatsdateshours = new Seatsdateshours({ seatsdateshours: seatsdateshoursObj })

    try {
        await seatsdateshours.save()
        console.log('Successfully inserted')
        res.sendStatus(200)
    } catch (e) {
        console.log('An error occurred while inserting into the Database: ' + e)
    }
}

const getSeatsdateshours = async (req, res) => {
    const seatsdateshours = await Seatsdateshours.find({})
    res.send(seatsdateshours)
}

const updateSeatsdateshours = async (req, res) => {
    //obtengo tabla 
    const seatsdateshours = await Seatsdateshours.find({})

    //obtengo registro e indice en base a fecha
    const date = req.body.date
    const records = seatsdateshours[0].seatsdateshours.filter((e) => {
        return e.date === date
    })
    const index = seatsdateshours[0].seatsdateshours.findIndex((i) => i.date === date)

    //obtengo campo hora que contiene el array de asientos, con el indice
    const hour = req.body.hour
    const finalRecord = records[0].schedules.filter((e) => {
        return e.hour === hour
    })
    const finalIndex = records[0].schedules.findIndex((i) => i.hour === hour)
    
    //obtengo el array a modificar, de la DB y el array modificado que viene del cliente
    let db_seats = finalRecord[0].seats
    const client_seats = req.body.seats
    
    //modifico el array de asientos que viene de la DB con las modificaciones del cliente
    client_seats.forEach((e,i)=>{
        db_seats[Number(e)-1] = true
    })

    //modifico el campo array de asientos con el array modificado, ESTE ES EL REGISTRO MODIFICADO
    records[0].schedules[finalIndex].seats = db_seats

    //record[0] registro a ser updated, aqui actualiza el registro del json que viene de la DB
    seatsdateshours[0].seatsdateshours[index] = records[0]

    //update table
    try{
        await Seatsdateshours.deleteMany({})
        const newSeatsdateshours = new Seatsdateshours({ seatsdateshours: seatsdateshours[0].seatsdateshours})

        try {
            await newSeatsdateshours.save()
            console.log('Successfully inserted')
            res.sendStatus(200)
        } catch (e) {
            console.log('An error occurred while inserting into the Database: ' + e)
            res.sendStatus(500)
        }
    } catch(e){
        console.log('An error occurred while deleting into the Database: ' + e)
        res.sendStatus(500)
    }    
}

export {
    welcome,
    template,
    getPrices,
    getHours,
    extractMovieBillboard,
    getMovieBillboard,
    postMessageContact,
    getTrailers,
    initTableSeatsdateshours,
    getSeatsdateshours,
    updateSeatsdateshours
}