const express = require('express');

const { noData } = require('pg-protocol/dist/messages.js');
const {getTopics, getSpecificArticle} = require('../controllers/appController.js')


const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getSpecificArticle)


app.use((error,request,response,next) => {
    console.log (error.msg)
    if (error.status){
        response.status(error.status).send({msg:error.msg})
    } else {
        next(error)

    }
})

// app.use((error,request,response,next) => {

//     response.status(500).send(error)
// })

module.exports = {app}