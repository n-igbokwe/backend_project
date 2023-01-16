const db = require('../db/connection.js')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}

const fetchSpecificArticle = (id) => {
    const queryString = 'SELECT * FROM articles WHERE article_id = $1'
    const queryValues = [];

    if (id !== undefined){
        queryValues.push(id)
    }

    return db.query(queryString,queryValues).then(({rows}) => {
        if (rows.length >= 1){
            return rows
        } else {
            return Promise.reject({status:400, msg: 'Not Found'})
            
        }
    })
}

module.exports = {fetchTopics, fetchSpecificArticle}