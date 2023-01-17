const request = require('supertest');
const {app} = require('../app/app.js')
const db = require('../db/connection.js')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

beforeEach(() => {
    return seed({articleData,commentData,topicData,userData})
})

describe('GET requests', () => {
    test('responds with status 200', () => {
        return request(app).get('/api/topics').expect(200)
    })
    test('200: responds with correct topics object', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((result) => {
            const {body} = result
            const snacks = body.topics
            expect(body).toHaveProperty('topics');
            expect(snacks[0]).toHaveProperty('slug');
            expect(snacks[0]).toHaveProperty('description')
        })
    })
    test('200 : responds with correct articles object', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((result) => {
            const {body} = result
            const articles = body.articles
            expect(body).toHaveProperty('articles')
            expect(articles).toHaveLength(12)

            articles.forEach((article) => {
                expect(article).toHaveProperty('article_id');
                expect(article).toHaveProperty('title');
                expect(article).toHaveProperty('topic');
                expect(article).toHaveProperty('author');
                expect(article).toHaveProperty('body');
                expect(article).toHaveProperty('created_at');
                expect(article).toHaveProperty('votes');
                expect(article).toHaveProperty('article_img_url');
                expect(article).toHaveProperty('comment_count');
            })
        })
    })
         test('200: responds with correct specific article object', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body: {article}}) => {
            let articleZero = article[0]
            expect(articleZero).toHaveProperty('author');
            expect(articleZero).toHaveProperty('title');
            expect(articleZero).toHaveProperty('article_id');
            expect(articleZero).toHaveProperty('body');
            expect(articleZero).toHaveProperty('topic');
            expect(articleZero).toHaveProperty('created_at');
            expect(articleZero).toHaveProperty('votes');
            expect(articleZero).toHaveProperty('article_img_url');
            expect(articleZero.article_id).toBe(2)
        })
    })
    test('404 : handles an invalid request with out of bounds :article_id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body : {msg}}) => { 
            expect(msg).toBe("Not Found")
        })
    })
    test('400 : handles a bad request with an article_id that is NaN', () => {
        return request (app)
        .get('/api/articles/cheese')
        .expect(500)
        .then(({body}) => {
            expect(body.name).toBe('error')
        })
        })

    test('200: responds with correct coments array for given article_id', () => {
        return request (app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({body : {comments}}) => {
            const commentZero = comments[0];
            expect(comments).toHaveLength(2)
            expect(commentZero).toHaveProperty('comment_id');
            expect(commentZero).toHaveProperty('body');
            expect(commentZero).toHaveProperty('article_id');
            expect(commentZero).toHaveProperty('author');
            expect(commentZero).toHaveProperty('votes');
            expect(commentZero).toHaveProperty('created_at');
        })
    })
    test('404 : handles an invalid request with out of bounds :article_id', () => {
        return request(app)
        .get('/api/articles/888/comments')
        .expect(404)
        .then(({body : {msg}}) => {
            console.log(msg)
            expect(msg).toBe('Not Found')
        })
    })
    test.only('400: handles bad request with an article_id that is NaN', () => {
        return request(app)
        .get('/api/articles/cheese/comments')
        .expect(500)
        .then(({body}) => {
            expect(body.name).toBe('error')
        })
    })
})
