import dotenv from 'dotenv'
dotenv.config()

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-prod',
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
}
