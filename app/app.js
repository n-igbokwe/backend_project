const express = require('express');


const {getTopics, getArticles, getSpecificArticle, getSpecificComments, getUsers} = require('../controllers/appController.js')


const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getSpecificArticle)
app.get('/api/articles/:article_id/comments', getSpecificComments)
app.get('/api/users', getUsers)

app.use((error,request,response,next) => {
    if (error.status){
        response.status(error.status).send({msg:error.msg})
    } else {
        next(error)

    }
})

app.use((error,request,response,next) => {

    response.status(500).send(error)
})

module.exports = {app}