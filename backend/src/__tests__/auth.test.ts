import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let app: express.Express
let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())

  const { default: routes } = await import('../routes')
  app = express()
  app.use(express.json())
  app.use('/api', routes)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('POST /api/auth/signup', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'test@example.com', password: 'Password123!' })

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.user).toHaveProperty('email', 'test@example.com')
    expect(res.body.data).toHaveProperty('token')
  })

  it('should reject duplicate email', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'dup@example.com', password: 'Password123!' })

    const res = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'dup@example.com', password: 'Password123!' })

    expect(res.status).toBe(409)
    expect(res.body.success).toBe(false)
  })

  it('should reject invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Test User', email: 'notanemail', password: 'Password123!' })

    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Login User', email: 'login@example.com', password: 'Password123!' })
  })

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'Password123!' })

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('token')
    expect(res.body.data.user).toHaveProperty('email', 'login@example.com')
  })

  it('should reject wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
  })

  it('should reject non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Password123!' })

    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/logout', () => {
  it('should logout successfully', async () => {
    const signupRes = await request(app)
      .post('/api/auth/signup')
      .send({ fullName: 'Logout User', email: 'logout@example.com', password: 'Password123!' })

    const token = signupRes.body.data.token

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('should reject logout without token', async () => {
    const res = await request(app).post('/api/auth/logout')
    expect(res.status).toBe(401)
  })
})
