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
  
})