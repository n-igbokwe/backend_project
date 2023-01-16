
const {fetchTopics, fetchSpecificArticle} = require('../models/appModels.js')

const getTopics = (request,response,next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((error) => {
        next (error)
    })
}


const getSpecificArticle = (request, response, next) => {
     const {article_id} = request.params
    fetchSpecificArticle(article_id).then((article) => {
        response.status(200).send({article})


const getArticles = (request,response,next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({articles})
    })
    .catch((error) => {
        next (error)
    })
}


module.exports = {getTopics, getArticles, getSpecificArticle}

