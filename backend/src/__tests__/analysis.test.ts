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
    .send({ fullName: 'Analysis Tester', email: 'analysis@example.com', password: 'Password123!' })
  authToken = signupRes.body.data.token

  const ideaRes = await request(app)
    .post('/api/ideas')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ title: 'AI Analysis Test', description: 'Testing AI analysis generation with detailed description', industry: 'AI' })
  ideaId = ideaRes.body.data.idea._id
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('POST /api/analysis/generate', () => {
  it('should trigger analysis generation', async () => {
    const res = await request(app)
      .post('/api/analysis/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ideaId })

    expect(res.status).toBe(200)
  })

  it('should reject request without ideaId', async () => {
    const res = await request(app)
      .post('/api/analysis/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({})

    expect(res.status).toBe(400)
  })

  it('should reject non-existent idea', async () => {
    const res = await request(app)
      .post('/api/analysis/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ ideaId: new mongoose.Types.ObjectId().toString() })

    expect(res.status).toBe(404)
  })
})

describe('GET /api/analysis/:ideaId', () => {
  it('should return analysis for existing idea', async () => {
    const res = await request(app)
      .get(`/api/analysis/${ideaId}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(res.status).toBe(200)
  })

  it('should reject unauthorized access', async () => {
    const res = await request(app).get(`/api/analysis/${ideaId}`)
    expect(res.status).toBe(401)
  })
})
