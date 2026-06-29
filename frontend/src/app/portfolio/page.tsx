'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

const techStack = [
  { category: 'Frontend', items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Recharts', 'Zod'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'TypeScript', 'Mongoose', 'JWT', 'Zod'] },
  { category: 'AI', items: ['Google Gemini AI', 'Prompt Engineering', 'Context Management', 'Fallback Logic'] },
  { category: 'Infrastructure', items: ['MongoDB Atlas', 'Redis (Upstash)', 'BullMQ', 'Vercel', 'Render'] },
  { category: 'DevOps', items: ['GitHub Actions CI/CD', 'Winston Logging', 'Helmet Security', 'Rate Limiting'] },
  { category: 'Integrations', items: ['Nodemailer', 'PDFKit', 'Multer', 'Mammoth', 'Swagger/OpenAPI'] },
]

const features = [
  { icon: 'psychology', title: 'AI Analysis', desc: 'Gemini-powered startup idea validation with SWOT, market demand, competition analysis, revenue suggestions, and success probability scoring.' },
  { icon: 'smart_toy', title: 'AI Chat', desc: 'Context-aware conversational AI assistant that remembers past analyses, answers startup questions, and provides actionable advice.' },
  { icon: 'account_balance', title: 'Investor Match', desc: 'AI matches startups with ideal investor types, funding stages, recommended amounts, and pitch suggestions.' },
  { icon: 'campaign', title: 'Pitch Generator', desc: 'Generates complete investor pitch decks with executive summary, problem, solution, market opportunity, and business model.' },
  { icon: 'trending_up', title: 'Market Trends', desc: 'Real-time industry breakdowns with average scores, success probabilities, and AI-generated emerging trend analysis.' },
  { icon: 'business_center', title: 'Competitor Intel', desc: 'Deep competitive intelligence: funding details, market positioning, pricing strategies, and estimated user bases.' },
  { icon: 'slideshow', title: 'Presentation Generator', desc: 'AI creates 12-slide investor presentations with export to PDF and HTML formats.' },
  { icon: 'compare_arrows', title: 'Score Benchmarking', desc: 'Rank your startup against industry peers with percentile scores, averages, and similar idea comparisons.' },
  { icon: 'school', title: 'Mentor Match', desc: 'AI recommends ideal mentors based on startup category, founder goals, and industry — with skills gap analysis.' },
  { icon: 'groups', title: 'Team Collaboration', desc: 'Create teams, invite members by email, manage roles, and collaborate on startup ideas.' },
  { icon: 'history', title: 'Version Control', desc: 'Track idea changes over time, compare versions with visual diffs, and restore previous iterations.' },
  { icon: 'task_alt', title: 'Smart Tasks', desc: 'AI-generated 4-week action plans with progress tracking, priority management, and deadline monitoring.' },
  { icon: 'stars', title: 'Badge System', desc: 'Earn achievements as you validate ideas: first analysis, score milestones, team creation, and more.' },
  { icon: 'share', title: 'Public Sharing', desc: 'Generate shareable links for analyses with read-only public pages, social sharing, and embedding.' },
  { icon: 'calendar_today', title: 'Calendar Sync', desc: 'Export tasks to iCal and Google Calendar with one-click integration.' },
  { icon: 'record_voice_over', title: 'Voice Assistant', desc: 'Speech-to-text for hands-free interaction, voice commands for analysis, and text-to-speech for reading results aloud.' },
]

export default function PortfolioPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  if (loading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <div className="text-center mb-12 pt-8">
            <h1 className="font-display-2xl text-[clamp(36px,5vw,72px)] leading-[1.05] tracking-[-0.04em] font-medium text-on-surface mb-4">
              Validator Pro
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              An enterprise-grade AI-powered SaaS platform for validating, analyzing, and presenting startup ideas.
            </p>
          </div>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">Architecture</h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed text-on-surface-variant font-mono whitespace-pre">
{`┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐
│   Next.js 16    │────▶│    Express 4     │────▶│  MongoDB Atlas│
│   (Vercel)      │     │    (Render)      │     │               │
│                 │◀────│                  │◀────│               │
├─────────────────┤     ├─────────────────┤     ├───────────────┤
│ Tailwind CSS v4 │     │ Mongoose ODM    │     │ 15 Collections │
│ Recharts Charts │     │ JWT Auth        │     │ Aggregations  │
│ React 19        │     │ Zod Validation  │     │ Indexes       │
│ Material Icons  │     │ Winston Logging │     │               │
└─────────────────┘     └────────┬────────┘     └───────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │       Redis (Upstash)    │
                    ├─────────────────────────┤
                    │ • Cache (24h TTL)       │
                    │ • BullMQ Queue          │
                    │ • Rate Limiting         │
                    └─────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │    Google Gemini AI     │
                    ├─────────────────────────┤
                    │ • Analysis Generation   │
                    │ • Chat Conversations    │
                    │ • Competitor Intel      │
                    │ • Pitch & Presentation  │
                    │ • Mentor Matching       │
                    │ • Market Trends         │
                    └─────────────────────────┘`}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">Database Schema</h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed text-on-surface-variant font-mono whitespace-pre">
{`User ──┬── StartupIdea ── AnalysisResult ── CompetitorInsight
       │         └── IdeaVersion (history)
       ├── ChatHistory
       ├── Task (action plans)
       ├── Team ── TeamMember ── TeamInvite
       ├── Favorite
       ├── UserMemory
       ├── ActivityLog
       └── UserBadge (gamification)`}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">API Flow</h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 overflow-x-auto">
              <pre className="text-[13px] leading-relaxed text-on-surface-variant font-mono whitespace-pre">
{`Authentication Flow:
  Client ──▶ POST /auth/signup ──▶ Zod Validate ──▶ bcrypt Hash ──▶ MongoDB Save ──▶ JWT Sign ──▶ Response

AI Analysis Lifecycle:
  User Creates Idea ──▶ POST /analysis/generate ──▶ BullMQ Queue ──▶ Worker ──▶ Gemini API ──▶ Parse & Validate ──▶ MongoDB Save ──▶ Redis Cache ──▶ Email Notification

Real-time Chat:
  User Message ──▶ POST /chat ──▶ Fetch Context ──▶ Gemini AI ──▶ Structured Response ──▶ Save History ──▶ Reply`}</pre>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techStack.map((group) => (
                <div key={group.category} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6">
                  <h3 className="font-label-md text-on-surface mb-3">{group.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="bg-surface-container-low text-on-surface-variant text-[12px] px-3 py-1.5 rounded-full">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">All Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.title} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 flex gap-4">
                  <span className="material-symbols-outlined text-2xl text-tertiary shrink-0">{f.icon}</span>
                  <div>
                    <h3 className="font-label-sm text-on-surface mb-1">{f.title}</h3>
                    <p className="text-[13px] text-on-surface-variant leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">Demo</h2>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">play_circle</span>
              <h3 className="font-label-md text-on-surface mb-2">Product Demo</h3>
              <p className="text-body-md text-on-surface-variant mb-4">Watch a walkthrough of the full platform</p>
              <div className="max-w-2xl mx-auto bg-surface-container-low rounded-2xl p-8 flex items-center justify-center aspect-video">
                <span className="material-symbols-outlined text-5xl text-outline">smart_display</span>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display-xl text-[clamp(24px,3vw,40px)] font-medium text-on-surface mb-8">Screenshots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Dashboard Analytics', 'Idea Analysis', 'AI Chat', 'Competitor Intel', 'Presentation Generator', 'Score Benchmarking'].map((label) => (
                <div key={label} className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col items-center justify-center aspect-video">
                  <span className="material-symbols-outlined text-4xl text-outline mb-2">image</span>
                  <p className="text-label-sm text-on-surface-variant">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center text-label-sm text-on-surface-variant py-8 border-t border-outline-variant">
            Built with Next.js 16, Express, TypeScript, MongoDB, Redis, BullMQ, and Google Gemini AI
          </div>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
