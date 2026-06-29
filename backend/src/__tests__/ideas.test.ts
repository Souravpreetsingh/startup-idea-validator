import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let app: express.Express
let mongoServer: MongoMemoryServer
let authToken: string
let ideaId: string

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())

  const { default: routes } = await import('../routes')
  app = express()
  app.use(express.json())
  app.use('/api', routes)

  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({ fullName: 'Idea Tester', email: 'ideas@example.com', password: 'Password123!' })
  authToken = signupRes.body.data.token
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('CRUD /api/ideas', () => {
  it('should create a new idea', async () => {
    const res = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Startup',
        description: 'A test startup idea for testing purposes with enough length',
        industry: 'Technology',
      })

    expect(res.status).toBe(201)
    expect(res.body.data.idea).toHaveProperty('title', 'Test Startup')
    ideaId = res.body.data.idea._id
  })

  it('should list user ideas', async () => {
    const res = await request(app)
      .get('/api/ideas')
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.data.length).toBeGreaterThanOrEqual(1)
  })

  it('should get a single idea', async () => {
    const res = await request(app)
      .get(`/api/ideas/${ideaId}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
    expect(res.body.data._id).toBe(ideaId)
  })

  it('should update an idea', async () => {
    const res = await request(app)
      .put(`/api/ideas/${ideaId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Startup', description: 'An updated description that meets the minimum length requirement' })

    expect(res.status).toBe(200)
    expect(res.body.data.idea.title).toBe('Updated Startup')
  })

  it('should delete an idea', async () => {
    const res = await request(app)
      .delete(`/api/ideas/${ideaId}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
  })

  it('should reject unauthenticated access', async () => {
    const res = await request(app).get('/api/ideas')
    expect(res.status).toBe(401)
  })
})
