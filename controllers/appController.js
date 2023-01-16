const {fetchTopics, fetchArticles} = require('../models/appModels.js')

const getTopics = (request,response,next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((error) => {
        next (error)
    })
}

const getArticles = (request,response,next) => {
    fetchArticles().then((articles) => {
        response.status(200).send({articles})
    })
    .catch((error) => {
        next (error)
    })
}

module.exports = {getTopics, getArticles}