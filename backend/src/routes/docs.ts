import { Router, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../config/swagger'

const router = Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Validator Pro API Docs',
}))

router.get('/json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

export default router
