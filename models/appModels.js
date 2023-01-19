const { query } = require('../db/connection.js')
const db = require('../db/connection.js')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}


const fetchArticles = () => {
    return db.query('SELECT article_id FROM comments;').then(({rows}) => {
        const articleIds = rows
        return db.query('SELECT * FROM articles ORDER BY created_at DESC;').then(({rows}) => {
            const allArticles = rows
            const allArticlesWithCommentCount = allArticles.map((article) => {
                let count = 0

                articleIds.map(({article_id}) => {
                    if (article_id === article.article_id){
                        count++
                    }
                })
                article.comment_count = count
                return article
                })
                return allArticlesWithCommentCount
            })
            
        })
    
}

const fetchSpecificArticle = (id) => {
    const queryString = 'SELECT * FROM articles WHERE article_id = $1;'
    const queryValues = [];

    //The below code works but a simpler way is to simply let the ID go through if it is not numbers - this will trigger and SQL error which can simply be handled in our error handlers
    // if (typeof +id !== 'number' || isNaN(+id)){
    //     return Promise.reject({status : 400, msg: 'Bad Request'})
    // }
    if (id !== undefined){
        queryValues.push(id)
    }

    return db.query(queryString,queryValues).then(({rows}) => {
        if (rows.length >= 1){
            return rows
        } else {
            return Promise.reject({status:404, msg: 'Not Found'})
            
        }
    })
}

const fetchSpecificComments = (id) => {
    const queryString = `SELECT * FROM comments WHERE article_id = $1 ORDER BY creted_at DESC;`
    return db.query(queryString, [id]).then(({rows}) => {
        return rows
    })

}

const fetchSpecificCommentsByArticleId = (id) => {
    const queryString = 'SELECT article_id FROM articles WHERE article_id = $1;'
    return db.query(queryString, [id]).then(({rowCount}) => {
        console.log(rowCount)
        if (rowCount === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
            
        } else {
            
            return;
            
        }
    })
}

const publishCommentWithArticleId = (article_id, body) => {
    const newComment = [
        body.comment,
        article_id,
        body.username,
        
    ]


    const bodySize = Object.keys(body).length
    if (bodySize > 2){
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }



    const queryString = `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *; `

     return db.query(queryString, newComment).then(() => {
        return db.query(`SELECT * FROM comments;`).then(({rows}) => {

            return (rows[rows.length -1])
        })
    })
}



module.exports = {fetchTopics, fetchArticles, fetchSpecificArticle, fetchSpecificComments, fetchSpecificCommentsByArticleId, publishCommentWithArticleId}


