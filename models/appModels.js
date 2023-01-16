const db = require('../db/connection.js')

const fetchTopics = () => {
    return db.query('SELECT * FROM topics;').then(({rows}) => {
        return rows
    })
}


const fetchArticles = () => {
    return db.query('SELECT article_id FROM comments;').then(({rows}) => {
        const articleIds = rows
        return db.query('SELECT * FROM articles;').then(({rows}) => {
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

module.exports = {fetchTopics, fetchArticles}

