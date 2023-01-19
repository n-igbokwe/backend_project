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



describe('POST REQUESTS', () => {
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





    test('404 : handles an invalid request with out of bounds :article_id', () => {
        return request(app)
        .get('/api/articles/888/comments')
        .expect(404)
        .then(({body : {msg}}) => {
            console.log(msg)
            expect(msg).toBe('Not Found')
        })
    })
    test('400: handles bad request with an article_id that is NaN', () => {
        return request(app)
        .get('/api/articles/cheese/comments')
        .expect(500)
        .then(({body}) => {
            expect(body.name).toBe('error')
        })
    })


describe('PATCH REQUESTS', () => {
    test('8 200: responds with updated article and vincremeneted vote count', () => {
        return request(app)
        .patch('/api/articles/3')
        .send({inc_votes : 100})
        .expect(200)
        .then(({body : {article}}) => {
            const [articleObj] = article
           expect(articleObj).toHaveProperty('article_id', 3);
           expect(articleObj).toHaveProperty('votes', 100);
           expect(articleObj).toHaveProperty('body', 'some gifs');
        })
    })
    test('8 200: responds with updated article and decremented vote count', () => {
        return request(app)
        .patch('/api/articles/2')
        .send({inc_votes : -100})
        .expect(200)
        .then(({body : {article}}) => {
            const [articleObj] = article
            expect(articleObj).toHaveProperty('article_id', 2);
            expect(articleObj).toHaveProperty('votes', -100);
            expect(articleObj).toHaveProperty('author', 'icellusedkars');
        })
    })
    test('8 404: responds with an error when passed an invalid article_id', () => {
        return request (app)
        .patch('/api/articles/100')
        .send({inc_votes : 100})
        .expect(404)
        .then(({body}) => {
            expect(body).toHaveProperty('msg', 'Not Found')
        })
    })
    test('8 400: responds with an error when passed an invalid amount to increement -decremenet votes', () => {
        return request (app)
        .patch('/api/articles/2')
        .send({inc_votes : 'hello there!'})
        .expect(400)
        .then(({error : {text}}) => {
            expect(text).toEqual("{\"msg\":\"BAD REQUEST\"}")
        })
    })
    test.only('8 400: responds with an error when passed no patch object at all', () => {
        return request (app)
        .patch('/api/articles/2')
        .send()
        .expect(400)
        .then(({error : {text}}) => {
            expect(text).toEqual("{\"msg\":\"BAD REQUEST\"}")
        })
    })
})
