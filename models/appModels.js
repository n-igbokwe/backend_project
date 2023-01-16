const db = require('../db/connection.js')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}

module.exports = {fetchTopics}