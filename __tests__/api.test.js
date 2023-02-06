const request = require('supertest');
const {app} = require('../app/app.js')
const db = require('../db/connection.js')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index.js')
const seed = require('../db/seeds/seed.js')

beforeEach(() => {
    return seed({articleData,commentData,topicData,userData})
})

afterAll(() => {
    db.end()
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
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
        })

    test('200: responds with correct comments array for given article_id', () => {
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
        .then((response) => {
            expect(typeof response).toBe('object')
        })
    })
    test('400: handles bad request with an article_id that is NaN', () => {
        return request(app)
        .get('/api/articles/cheese/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('BAD REQUEST')
        })
    })
    test('9 200: returns the correct users object', () => {
        return request (app)
        .get('/api/users')
        .expect(200)
        .then(({body : {users}}) => {
            const [firstUser, secondUser] = users
            expect(users).toHaveLength(4)
            expect(firstUser).toHaveProperty('username')
            expect(firstUser).toHaveProperty('name')
            expect(firstUser).toHaveProperty('avatar_url')
            expect(Object.keys(firstUser).length).toBe(3)
            expect(Object.keys(secondUser).length).toBe(3)
        })
    })
    test('11 200: returns the correct article object with comment count when given an article_id ', () => {
        return request (app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body: {article}}) => {
            const [firstArt] = article
            expect(firstArt).toHaveProperty('comment_count', '11')
            expect(firstArt).toHaveProperty('article_id', 1)
            expect(Object.keys(firstArt).length).toBe(9)

        })
    })
    test('11 404 : responds with the appropriate error when passed an article_id that does not exist', () => {
        return request (app)
        .get('/api/articles/200')
        .expect(404)
        .then((error) => {
            expect(error.status).toEqual(404);
            expect(error.body).toEqual({msg : 'Not Found'})
        })
    })
    test('11 400 : responds with the appropriate error when passed a non-integer article_id', () => {
        return request (app)
        .get('/api/articles/hacker')
        .expect(400)
        .then((error) => {
            expect(error.status).toEqual(400)
            expect(error.body).toEqual({msg : 'BAD REQUEST'})
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

            expect(msg).toBe('Not Found')
        })
    })
    test('400: handles bad request with an article_id that is NaN', () => {
        return request(app)
        .get('/api/articles/sjkd/comments')
        .expect(400)
        .then(({body}) => {

            expect(body.msg).toBe('BAD REQUEST')
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
    test('8 400: responds with an error when passed no patch object at all', () => {
        return request (app)
        .patch('/api/articles/2')
        .send()
        .expect(400)
        .then(({error : {text}}) => {
            expect(text).toEqual("{\"msg\":\"BAD REQUEST\"}")
        })
    })
})

describe('complex queries', () => {
    test('10 200: accepts topic filter', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body : {articles}}) => {
            expect(articles).toHaveLength(1)
            const [firstArticle] = articles
            expect(firstArticle).toHaveProperty('topic', 'cats')
            expect(firstArticle).toHaveProperty('article_id')
            expect(firstArticle).toHaveProperty('title')
            expect(firstArticle).toHaveProperty('comment_count')
        })
    })
    test('10 200: accepts sort_by queries', () => {
        return request (app)
        .get('/api/articles?sort_by=votes')
        .expect(200)
        .then(({body : {articles}}) => {
            expect(articles).toHaveLength(12)
            const [firstArticle, secondArticle] = articles
            expect(firstArticle).toHaveProperty('votes',100)
            expect(secondArticle).toHaveProperty('votes', 0)
        })
    })
    test('10 200: topic and sort_by queries work together', () => {
        return request(app)
        .get('/api/articles?topic=mitch&sort_by=votes')
        .expect(200)
        .then(({body : {articles}}) => {
            expect(articles).toHaveLength(11)
            const [firstArticle, secondArticle] = articles
            expect(firstArticle && secondArticle).toHaveProperty('topic', 'mitch')
            expect(firstArticle).toHaveProperty('votes', 100)
            expect(secondArticle).toHaveProperty('votes', 0)
        })
    })
    test('10 200: accepts order query', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then(({body : {articles}}) => {
            expect(articles).toHaveLength(12)
            const[firstArticle] = articles
            expect(firstArticle).toHaveProperty('created_at', '2020-01-07T14:08:00.000Z')   
            const {11 : lastArticle} = articles
            expect(lastArticle).toHaveProperty('created_at', '2020-11-03T09:12:00.000Z' )
      
        })
    })
    test('10 200: accepts all queries together', () => {
        return request (app)
        .get('/api/articles?topic=mitch&sort_by=article_id&order=desc')
        .expect(200)
        .then(({body : {articles}}) => {
            expect(articles).toHaveLength(11)
            const [firstArticle] = articles
            expect(firstArticle).toHaveProperty('article_id', 12)
            const {10 : lastArticle} = articles
            expect(lastArticle).toHaveProperty('article_id', 1)

        })
    })
    test('10 400: handles errors correctly when passed non greenlisted argument', () => {
        return request (app)
        .get('/api/articles?order=hacker')
        .expect(400)
        .then(({body})=> {
            expect(body).toEqual({"msg": "Bad Request"})
        })
    })
    test('10 400: handles errors correctly when passed non greenlisted argument', () => {
        return request (app)
        .get('/api/articles?sort_by=hacker')
        .expect(400)
        .then(({body})=> {
            expect(body).toEqual({"msg": "Bad Request"})
        })
    })
    test('10 400 handles errors correctly when passed a corect argument and a non greenlisted argument', () => {
        return request (app)
        .get('/api/articles?sort_by=hacker&order=desc')
        .expect(400)
        .then(({body})=> {
            expect(body).toEqual({"msg": "Bad Request"})
        })
    })
})

describe('DELETE REQUESTS', () => {
    test('12 204 deletes the given comment by comment_id and responds appropriately', () => {
        return request (app)
        .delete('/api/comments/2')
        .expect(204)
        .then((error) => {
            expect(error.status).toBe(204);
        })
    })
    test('12 404 responds with the appropriate error when given a comment_id that does not exist', () => {
        return request (app)
        .delete ('/api/comments/222')
        .expect(404)
        .then((error) => {
            expect(error.status).toBe(404)
        })
    })
    test('12 400 responds with the appropraite error when given a non-integer comment_id', () => {
        return request(app)
        .delete('/api/commments/hacker')
        .expect(404)
        .then((error) => {
            expect(error.status).toBe(404)
        })
    })

})

