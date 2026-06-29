import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Startup Idea Validator API',
      version: '1.0.0',
      description: 'Enterprise API for validating startup ideas using AI. Includes authentication, analysis, chat, teams, and enterprise features.',
      contact: { name: 'Validator Pro Team' },
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development' },
      { url: 'https://api.validatorpro.app/api', description: 'Production' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            startupExperience: { type: 'string' },
            industryInterest: { type: 'string' },
          },
        },
        StartupIdea: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            industry: { type: 'string' },
            targetAudience: { type: 'string' },
            budget: { type: 'string' },
            businessModel: { type: 'string' },
            problemStatement: { type: 'string' },
            expectedSolution: { type: 'string' },
          },
        },
        AnalysisResult: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            ideaScore: { type: 'integer', minimum: 0, maximum: 100 },
            successProbability: { type: 'integer', minimum: 0, maximum: 100 },
            marketDemand: { type: 'string' },
            competition: { type: 'string' },
            swot: {
              type: 'object',
              properties: {
                strengths: { type: 'array', items: { type: 'string' } },
                weaknesses: { type: 'array', items: { type: 'string' } },
                opportunities: { type: 'array', items: { type: 'string' } },
                threats: { type: 'array', items: { type: 'string' } },
              },
            },
            revenueSuggestions: { type: 'array', items: { type: 'string' } },
            growthStrategy: { type: 'string' },
            mvpRoadmap: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
