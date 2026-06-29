import { env } from '../config/env'
import logger from '../config/logger'

interface EmailPayload {
  to: string
  subject: string
  html: string
}

async function sendMail(payload: EmailPayload) {
  if (!env.SMTP_HOST || !env.SMTP_USER) {
    logger.info(`[Email] (dry-run) To: ${payload.to} | Subject: ${payload.subject}`)
    return { sent: false, dryRun: true }
  }

  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.default.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || '587'),
      secure: env.SMTP_PORT === '465',
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
    await transporter.sendMail({ from: env.SMTP_FROM || '"Validator Pro" <noreply@validatorpro.app>', ...payload })
    logger.info(`[Email] Sent to ${payload.to}: ${payload.subject}`)
    return { sent: true }
  } catch (err) {
    logger.error(`[Email] Failed to send to ${payload.to}:`, err)
    return { sent: false, error: String(err) }
  }
}

export const emailService = {
  analysisComplete(user: { email: string; fullName: string }, ideaName: string) {
    return sendMail({
      to: user.email,
      subject: `Analysis Complete: ${ideaName}`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#1c1b1a;">Analysis Complete ✅</h2>
        <p>Hi ${user.fullName},</p>
        <p>Your AI analysis for <strong>${ideaName}</strong> is ready.</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${env.CLIENT_URL}/analysis/${ideaName}" style="background:#1c1b1a;color:#fcf9f6;padding:12px 32px;border-radius:24px;text-decoration:none;font-weight:600;">View Analysis</a>
        </p>
        <hr style="border:none;border-top:1px solid #e5e2df;" />
        <p style="color:#78776f;font-size:12px;">Validator Pro — AI Startup Idea Validator</p>
      </div>`,
    })
  },

  teamInvite(user: { email: string }, inviterName: string, teamName: string) {
    return sendMail({
      to: user.email,
      subject: `You're invited to join ${teamName}`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#1c1b1a;">Team Invitation 🚀</h2>
        <p><strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on Validator Pro.</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${env.CLIENT_URL}/teams" style="background:#1c1b1a;color:#fcf9f6;padding:12px 32px;border-radius:24px;text-decoration:none;font-weight:600;">View Invitation</a>
        </p>
        <hr style="border:none;border-top:1px solid #e5e2df;" />
        <p style="color:#78776f;font-size:12px;">Validator Pro — AI Startup Idea Validator</p>
      </div>`,
    })
  },

  weeklyReport(user: { email: string; fullName: string }, stats: { ideasCount: number; analysesCount: number; tasksCompleted: number }) {
    return sendMail({
      to: user.email,
      subject: 'Your Weekly Startup Report',
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#1c1b1a;">Weekly Report 📊</h2>
        <p>Hi ${user.fullName},</p>
        <p>Here's your weekly summary:</p>
        <ul>
          <li>Ideas created: <strong>${stats.ideasCount}</strong></li>
          <li>Analyses run: <strong>${stats.analysesCount}</strong></li>
          <li>Tasks completed: <strong>${stats.tasksCompleted}</strong></li>
        </ul>
        <p style="text-align:center;margin:24px 0;">
          <a href="${env.CLIENT_URL}/dashboard" style="background:#1c1b1a;color:#fcf9f6;padding:12px 32px;border-radius:24px;text-decoration:none;font-weight:600;">Go to Dashboard</a>
        </p>
        <hr style="border:none;border-top:1px solid #e5e2df;" />
        <p style="color:#78776f;font-size:12px;">Validator Pro — AI Startup Idea Validator</p>
      </div>`,
    })
  },

  taskReminder(user: { email: string; fullName: string }, taskTitle: string, deadline: Date) {
    return sendMail({
      to: user.email,
      subject: `Reminder: ${taskTitle}`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#1c1b1a;">Task Reminder ⏰</h2>
        <p>Hi ${user.fullName},</p>
        <p>Your task <strong>${taskTitle}</strong> is due on ${deadline.toLocaleDateString()}.</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${env.CLIENT_URL}/features/tasks" style="background:#1c1b1a;color:#fcf9f6;padding:12px 32px;border-radius:24px;text-decoration:none;font-weight:600;">View Tasks</a>
        </p>
        <hr style="border:none;border-top:1px solid #e5e2df;" />
        <p style="color:#78776f;font-size:12px;">Validator Pro — AI Startup Idea Validator</p>
      </div>`,
    })
  },
}
