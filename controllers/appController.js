
const {fetchTopics, fetchArticles, fetchSpecificArticle, fetchSpecificComments, fetchSpecificCommentsByArticleId, publishCommentWithArticleId, updateVotes, fetchUsers, removeComment, checkCommentIdBeforeRemove} = require('../models/appModels.js')




const getTopics = (request,response,next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((error) => {
        next (error)
    })
}

const getArticles = (request,response,next) => {
    const topic = request.query.topic
    const sortBy = request.query.sort_by
    const order = request.query.order
    fetchArticles(order, sortBy, topic).then((articles) => {
        response.status(200).send({articles})
    })
    .catch((error) => {
        next (error)
    })
}



const getSpecificArticle = (request, response, next) => {
     const {article_id} = request.params
    fetchSpecificArticle(article_id).then((article) => {
        response.status(200).send({article})
    })
    .catch((error) => {
        next (error)
    })
}


const getSpecificComments = (request, response, next) => {
    const {article_id} = request.params
    fetchSpecificCommentsByArticleId(article_id)
    .then(() => {
        return fetchSpecificComments(article_id)
        .then((result) => {
            console.log(result)
        })
    })
}




const postComment = (request, response, next) => {
    const {params : {article_id}} = request
    const {body} = request
    publishCommentWithArticleId(article_id, body).then((post) => {
        response.status(201).send({post})

    })
    .catch((error) => {
        next(error)
    })
}


const patchVotes = (request, response, next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body
    updateVotes(article_id, inc_votes)
    .then((article) =>  {
        response.status(200).send({article})
    })
    .catch((error) => {
        next(error)
    })
}


const getUsers = (request, response, next) => {
    fetchUsers().then((users) => {
        response.status(200).send({users})
    })
}

const deleteComment = (request, response, next) => {
    const {comment_id} = request.params
    checkCommentIdBeforeRemove(comment_id)
    .then(() => {
     removeComment(comment_id).then((result) => {
        response.status(204).send({result})
         })
    })
    .catch((error) => {

        next(error)
    })
}





module.exports = {getTopics, getArticles, getSpecificArticle, getSpecificComments, postComment, patchVotes, getUsers, deleteComment}



