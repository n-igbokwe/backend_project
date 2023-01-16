const {fetchTopics} = require('../models/appModels.js')

const getTopics = (request,response,next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics})
    })
    .catch((error) => {
        next (error)
    })
}

module.exports = {getTopics}