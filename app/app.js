const express = require('express');



const {getTopics, getArticles, getSpecificArticle, postComment, getSpecificComments, patchVotes, getUsers, deleteComment} = require('../controllers/appController.js')



const app = express();

app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getSpecificArticle)
app.post('/api/articles/:article_id/comments', postComment)
app.get('/api/articles/:article_id/comments', getSpecificComments)
app.get('/api/users', getUsers)
app.patch('/api/articles/:article_id', patchVotes)
app.delete('/api/comments/:comment_id', deleteComment)



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