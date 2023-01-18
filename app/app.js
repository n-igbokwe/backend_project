const express = require('express');


const {getTopics, getArticles, getSpecificArticle, getSpecificComments, patchVotes} = require('../controllers/appController.js')


const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getSpecificArticle)
app.get('/api/articles/:article_id/comments', getSpecificComments)
app.patch('/api/articles/:article_id', patchVotes)


app.use((error,request,response,next) => {
    if (error.status){
        response.status(error.status).send({msg:error.msg})
    } else {
        next(error)

    }
})

app.use((error,request,response,next) => {

    response.status(400).send({msg: "BAD REQUEST"})
})

module.exports = {app}