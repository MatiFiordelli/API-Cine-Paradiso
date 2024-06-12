import 'dotenv/config'
import { Prices, Hours, MessagesContact, MovieBillboard, Seatsdateshours, Seatsdateshourstheaters } from '../Models/index.js'
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
    const url = `${endPointBg}/movie/now_playing?api_key=${apiKey}&language=${language}&page=1&include_adult=false&region=US`
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            //res.send(data.results)
            insertRecord(data.results)
        })

    const insertRecord = async (data) => {
        let obj = {}
        let arr = []
        data.forEach((e,i) => {
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
            if (i<20) arr.push(obj)
        })
        console.log(arr)
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

    await Seatsdateshours.deleteMany({})
    const seatsdateshours = new Seatsdateshours({ seatsdateshours: seatsdateshoursObj })

    try {
        await seatsdateshours.save()
        console.log('Successfully inserted')
        res.sendStatus(200)
    } catch (e) {
        console.log('An error occurred while inserting into the Database: ' + e)
    }
}

const initTableSeatsdateshourstheaters = async (req, res) => {
    const theaters_movie_ids = []
    for(let i=0; i<20; i++){ theaters_movie_ids.push(i)}
    const seats = (new Array(185)).fill(false)
    const hoursFetched = await Hours.find({})
    const hoursArray = extractHours(hoursFetched)
    const datesArray = []
    for (let i = 0; i < 7; i++) {
        datesArray.push(getDateData(i))
    }

    const seatsdateshourstheatersObj = theaters_movie_ids.map((e, i) => {
        const obj = {
            teather_movie_id: `${i}`,
            seatsdateshours: datesArray.map((e)=>{
                return {
                    date: `${e.dayNumber}/${e.monthNumber}`,
                    schedules: hoursArray.map((e) => {
                        return {
                            hour: e,
                            seats: seats
                        }
                    })
                }
            })
        }
        
        return obj
    })
    res.send(seatsdateshourstheatersObj)
    
    await Seatsdateshourstheaters.deleteMany({})
    const seatsdateshourstheaters = new Seatsdateshourstheaters({results: seatsdateshourstheatersObj})

    try {
        await seatsdateshourstheaters.save()
        console.log('Successfully inserted')
        res.sendStatus(200)
    } catch (e) {
        console.log('An error occurred while inserting into the Database: ' + e)
        res.sendStatus(500)
    }
}

const getSeatsdateshours = async (req, res) => {
    const seatsdateshours = await Seatsdateshours.find({})
    res.send(seatsdateshours)
}

const getSeatsdateshourstheaters = async (req, res) => {
    const seatsdateshourstheaters = await Seatsdateshourstheaters.find({})
    res.send(seatsdateshourstheaters)
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

const updateSeatsdateshourstheaters = async (req, res) => {
    //obtengo tabla 
    const seatsdateshourstheaters = await Seatsdateshourstheaters.find({})
    const selectedMovie = seatsdateshourstheaters[0].results.filter((e)=>e.teather_movie_id===req.body.id)[0]

    //obtengo registro e indice en base a fecha
    const date = req.body.date
    const records = selectedMovie.seatsdateshours.filter((e) => {
        return e.date === date
    })
    const index = selectedMovie.seatsdateshours.findIndex((i) => i.date === date)

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
    selectedMovie.seatsdateshours[index] = records[0]

    //aca actualiza el json inicial traido de la DB, y le reemplaza los datos, actualizados
    seatsdateshourstheaters[0].results[req.body.id] = selectedMovie

    //update table
    try{
        await Seatsdateshourstheaters.deleteMany({}) 
        
        const newSeatsdateshourstheaters = new Seatsdateshourstheaters({ results: seatsdateshourstheaters[0].results})

        try {
            await newSeatsdateshourstheaters.save()
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

const callInitTableSeatsdatehours = (req,res) => {
    fetch('https://api-cine-paradiso.vercel.app/init-table-seatsdateshours')
        .then(()=>res.sendStatus(200))
        .catch((err)=>{
            console.log(err)
            res.sendStatus(500)
        })
}

const renewAndRemoveOldRecordsTableSeatsdateshours = async (req, res) => {
    //obtengo tabla 
    const seatsdateshours = await Seatsdateshours.find({})

    //si esta vacia, la inicializa
    if(seatsdateshours.length === 0){
        callInitTableSeatsdatehours(req, res)  
        console.log(seatsdateshours)  
        console.log('Init by seatsdateshours.length === 0')    
        return
    }else{
    
        const seatsdateshoursStringify = JSON.stringify(seatsdateshours)
        const seatsdateshoursCopy = JSON.parse(seatsdateshoursStringify)[0].seatsdateshours

        const today = new Date().toLocaleDateString().split('/')
        const currentDay = today[0]
        const currentMonth = today[1]

        //devuelve un objeto con dia, mes y año, a partir de un string del formato: '12/2', dia/mes
        const obtainDayAndMonth = (str) => {
            const splitted = str.split('/')
            
            return {
                day: splitted[0],
                month: splitted[1],
                year: new Date().getFullYear()
            }
        }

        const deleteObsoleteRecords = async(e) => {
            const date = obtainDayAndMonth(e.date)
            
            if(date.month*1>currentMonth*1) return e
            if(date.month*1===currentMonth*1){
                if(date.day*1>=currentDay*1) {
                    return e
                }
            }
        }
        //borro registros obsoletos
        const filteredRecordsByDate = Promise.all(
            seatsdateshoursCopy.filter(async(e)=>{
                return await deleteObsoleteRecords(e)
            })
        )
        filteredRecordsByDate.then(async()=>{

       
            //si no hay nada para modificar
            if(filteredRecordsByDate.length===7) {
                res.sendStatus(200)
                return
            }
            //si todas las fechas estan obsoletas, inicializa
            if(filteredRecordsByDate.length===0) {
                callInitTableSeatsdatehours(req, res)
                console.log('Init by filteredRecordsByDate.length===0')
                console.log('el len es: ',filteredRecordsByDate.length)
                console.log('obj: ', filteredRecordsByDate)
                return
            }else{

                const getNextDay = (date, amountDays) => {
                    const result = new Date(date.setDate(date.getDate() + amountDays)).toLocaleDateString()
                    return result.slice(0,-5)
                }
                
                //detecto cantidad de registros a insertar, en total deben ser 7
                const amountRecordsLeft = filteredRecordsByDate.length
                const amountRecordsToInsert = 7 - amountRecordsLeft 
                
                //obtengo la fecha del ultimo registro disponible, null si no quedo ninguno
                let lastRecordDate = null
                if(amountRecordsToInsert > 0){
                    const lastIndex = filteredRecordsByDate.length - 1
                    lastRecordDate = filteredRecordsByDate[lastIndex].date
                }

                //function genera array de fechas a partir de una fecha, ejemplo: 13/6
                const generateDatesArray = (strDate, amount) => {
                    const todayStr = `${today[0]}/${today[1]}`
                    const objDate = obtainDayAndMonth(strDate===null ? todayStr : strDate)
                    const fromThisDateOnAhead = new Date(objDate.year, (objDate.month * 1)-1, objDate.day * 1)
                    const array = []
                    
                    for(let i=0; i<amount; i++){
                        array.push(getNextDay(fromThisDateOnAhead ,1))
                    }
                    return array
                }

                //funcion para crear registro
                const createRecords = async() => {
                    const theaters = (new Array(185)).fill(false)
                    const hoursFetched = await Hours.find({})
                    const hoursArray = extractHours(hoursFetched)
                    const datesArray = generateDatesArray(lastRecordDate , amountRecordsToInsert)

                    const obj = datesArray.map((e) => {
                        return {
                            date: e,
                            schedules: hoursArray.map((e) => {
                                return {
                                    hour: e,
                                    seats: theaters
                                }
                            })
                        }
                    })
                    
                    return obj
                }
                
                const result = await createRecords()
                result.forEach((e)=>{
                    filteredRecordsByDate.push(e)
                })
                
                seatsdateshours[0].seatsdateshours = await filteredRecordsByDate

                await Seatsdateshours.deleteMany({})
                const seatdateshoursUpdated = new Seatsdateshours({ seatsdateshours: await filteredRecordsByDate })

                try {
                    await seatdateshoursUpdated.save()
                    console.log('Successfully inserted')
                    res.sendStatus(200)
                } catch (e) {
                    console.log('An error occurred while inserting into the Database: ' + e)
                    res.sendStatus(500)
                }
                    
                /*
                    TAREAS:
                    1- OBTENER EL JSON(TABLA)
                    2- RECORRERLO E IR BORRANDO LOS REGISTROS OBSOLETOS DE ACUERDO A LA FECHA
                    2a-HACER FUNCION PARA DETECCION DE FECHAS
                    3- CONTAR CUANTOS REGISTROS RESTAN
                    4- EN CASO DE QUEDAR ALGUN/OS REGISTROS, VER LA FECHA DEL ULTIMO
                    5- AGREGAR TANTOS REGISTROS, AL FINAL, HASTA COMPLETAR 7, TENIENDO EN CUENTA CORRELATIVIDAD DE FECHAS
                */

                /*
            

                */
            }
        }
    )}
}

const renewAndRemoveOldRecordsTableSeatsdateshourstheaters = async (req, res) => {

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
    initTableSeatsdateshourstheaters,
    renewAndRemoveOldRecordsTableSeatsdateshours,
    renewAndRemoveOldRecordsTableSeatsdateshourstheaters,
    getSeatsdateshours,
    getSeatsdateshourstheaters,
    updateSeatsdateshours,
    updateSeatsdateshourstheaters
}