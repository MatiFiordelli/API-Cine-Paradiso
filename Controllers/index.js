import 'dotenv/config'
//import { Users } from '../Models/index.js'

const welcome = (req, res)=>{
    res.send('Welcome').status(200)
}

export {welcome}