import app from "./server.js"
import mongodb from "mongodb"
import dotenv from 'dotenv';  // Use import instead of require
import ReviewsDAO from "./dao/reviewsDAO.js"

dotenv.config({path: 'E:/Coding/environment.env'});  // Load the environment variables from .env file

const MongoClient = mongodb.MongoClient
const mongo_username = process.env['MONGO_USERNAME']
const mongo_password = process.env['MONGO_PASSWORD']
const uri = process.env['MONGO_URI']

const port = 8000;

MongoClient.connect(
    uri, 
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)

.catch(err => {
    console.error(err.stack)
    process.exit(1)
})

.then(async client => {
    await ReviewsDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
})