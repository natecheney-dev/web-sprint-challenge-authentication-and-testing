const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')




test('sanity', () => {
    expect(true).toBe(true)
})

beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
})

beforeEach(async () => {
    await db('users').truncate();
})

afterAll(async () => {
    await db.destroy();
})

describe('Register User', () => {
    let res
    beforeEach(async () => {
        res = await request(server)
            .post('/api/auth/register')
            .send({ username: 'admin', password: 'password' })
    })
    test('status 201', async () => {
        expect(res.status).toBe(201)
    })
    test('responds with created user', async () => {
        expect(res.body).toMatchObject({ id: 1, username: 'admin' })
    })
})

describe('User Login', () => {
    let res
    beforeEach(async () => {
        res = await request(server)
            .post('/api/auth/register')
            .send({ username: 'admin', password: 'password' })
    })
    test('status 201', async () => {
        await request(server)
            .post("/api/auth/login")
            .send({ username: 'admin', password: 'password' })
        expect(res.status).toBe(201)
    })
    test('login successful', async () => {
        await request(server)
            .post("/api/auth/login")
            .send({ username: 'admin', password: 'password' })
        expect(res.body.username).toContain('admin')
    })

})
