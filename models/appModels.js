const { query } = require('../db/connection.js')
const db = require('../db/connection.js')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}


const fetchArticles = (order = 'desc', sort_by = 'created_at', topic) => {
    const greenlistedSortBys = ['created_at', 'article_id', 'title', 'created_at', 'votes']
    const greenlistedOrders = ['asc', 'desc']

  
let queryString = `SELECT * FROM articles `

if (topic !== undefined){
    queryString += 'WHERE topic = $1 '
    if (!greenlistedSortBys.includes(sort_by) || !greenlistedOrders.includes(order)){
        return Promise.reject({status:400, msg: 'Bad Request'})
    } else {

        queryString += `ORDER BY ${sort_by} ${order}`

    
        return db.query(queryString, [topic]).then(({rows}) => {
    const topicArticles = rows

   return db.query(`SELECT article_id FROM comments;`).then(({rows}) => {
        const articleIds = rows
        const topicArticlesWithCommentCount = topicArticles.map((article) => {
                        let count = 0
        
                        articleIds.map(({article_id}) => {
                            if (article_id === article.article_id){
                                count++
                            }
                        })
                        article.comment_count = count
                        return article
                        })
                        return topicArticlesWithCommentCount
                        })
    })
    }

} else {
if (!greenlistedSortBys.includes(sort_by) || !greenlistedOrders.includes(order)){
        return Promise.reject({status:400, msg: 'Bad Request'})
    } else {

        return db.query('SELECT article_id FROM comments').then(({rows}) => {
            const articleIds = rows
           return  db.query(`SELECT * FROM articles ORDER BY ${sort_by} ${order}`).then(({rows}) => {
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
     
        

}

    
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

module.exports = {fetchTopics, fetchArticles, fetchSpecificArticle, fetchSpecificComments, fetchSpecificCommentsByArticleId}


