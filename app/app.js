const express = require('express');
const {getTopics, getArticles} = require('../controllers/appController.js')

const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)

app.use((error,request,response,next) => {
    console.log("first")
    if (error.status){
        console.log(error)
        response.status(error.status).send({msg:err.msg})
    } else {
        next(error)
    }
})

app.use((error,request,response,next) => {
    console.log("second")
    console.log(error, "<----- this is the error")
})

module.exports = {app}