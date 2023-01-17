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
    test('400 : handles a bad request with out of bounds :article_id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(400)
        .then(({body : {msg}}) => { 
            expect(msg).toBe("Not Found")
        })
    })


    test('200 : responds with correct articles object', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((result) => {
            const {body} = result
            const articles = body.articles
            console.log(articles)
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

    describe.only('POST REQUESTS', () => {
        test('200: responds with posted article (ticket 7)', () =>{
            return request (app)
            .post('/api/articles/2/comments')
            .expect(201)
            .send({'username': 'butter_bridge', 'comment':'A very interesting opinion'})
            .then(({body : {post}}) => {
                expect(post).toHaveProperty('comment_id', 19)
                expect(post).toHaveProperty('body', 'A very interesting opinion')
                expect(post).toHaveProperty('article_id', 2)
                expect(post).toHaveProperty('author', 'butter_bridge')
            })

        })
        test('400: responds with an error when username does not exist', () => {
            return request (app)
            .post('/api/articles/2/comments')
            .expect(400)
            .send({
                'username' : "notReal",
                'comment' : ' Whocares',
            })
            .then(({body}) => {
                expect(body).toHaveProperty('msg')
            })
        })
        test('400: responds with an error when post object is too large', () => {
            return request (app)
            .post('/api/articles/2/comments')
            .expect(400)
            .send({
                'username' : "notReal",
                'comment' : ' Whocares',
                'another' : 1
            })
            .then(({body}) => {
                expect(body).toHaveProperty('msg', 'Bad Request')
            })
        })
        test('400: responds with an error when article_id does not exist', () => {
            return request (app)
            .post('/api/articles/999/comments')
            .expect(400)
            .send({
                'username' : "notReal",
                'comment' : ' Whocares',
            })
            .then(({body}) => {
                expect(body).toHaveProperty('msg')
            })
        })
    })
  


})