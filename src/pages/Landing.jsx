import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <body className="bg-cream-paper text-midnight-ink font-body-md antialiased overflow-x-hidden">
      <div className="bg-deep-forest-teal text-white text-center py-3 font-label-md tracking-wide w-full z-50 relative">
        New: Analyze market sentiment with GPT-5
      </div>

      <header className="fixed top-[56px] md:top-[60px] left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full px-6 py-3 bg-white/80 backdrop-blur-md border border-stone-mist flex justify-between items-center z-50">
        <div className="font-display-lg text-headline-md tracking-tighter text-on-surface">Validator</div>
        <nav className="hidden md:flex gap-8">
          <button onClick={() => navigate('/dashboard')} className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Dashboard</button>
          <button onClick={() => navigate('/analysis')} className="text-primary font-bold border-b border-primary pb-1 font-body-md text-body-md hover:text-primary transition-colors duration-200">Analyze Idea</button>
          <button onClick={() => navigate('/chat')} className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">AI Assistant</button>
          <button className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Profile</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hidden md:block text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200">Logout</button>
          <button
            onClick={() => navigate('/analysis')}
            className="bg-lavender-whisper text-midnight-ink px-6 py-2 rounded-full font-label-md hover:bg-[#d6bee5] transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="pt-48 pb-section-gap px-container-padding max-w-7xl mx-auto relative flex flex-col items-center text-center min-h-[921px] justify-center">
        <div className="absolute left-10 top-1/3 w-64 h-64 bg-lavender-whisper rounded-full mix-blend-multiply filter blur-3xl opacity-30 hidden lg:block" style={{ animation: 'float 6s ease-in-out infinite' }}></div>
        <div
          className="absolute right-10 bottom-1/3 w-72 h-72 bg-[#f2daff] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '-3s' }}
        ></div>
        <div className="max-w-4xl mx-auto z-10">
          <h1 className="font-display-xl text-[clamp(64px,8vw,120px)] leading-[0.9] tracking-[-0.05em] mb-8 text-midnight-ink">
            Validate Your <br className="hidden md:block" /><span className="text-graphite-veil italic">Startup Idea</span> Using AI
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
            Analyze startup potential, market demand, and revenue opportunities instantly. Our intelligence engine provides editorial-grade clarity on your next big venture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/analysis')}
              className="bg-lavender-whisper text-midnight-ink px-8 py-4 rounded-full font-label-md hover:scale-95 transition-transform duration-150 flex items-center gap-2"
            >
              Validate Idea
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button className="bg-transparent border border-stone-mist text-midnight-ink px-8 py-4 rounded-full font-label-md hover:bg-stone-mist/20 transition-colors flex items-center gap-2">
              Watch Demo
              <span className="material-symbols-outlined text-sm">play_circle</span>
            </button>
          </div>
          <div className="mt-16 flex justify-center opacity-70">
            <div className="h-10 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-lavender-whisper"
                  style={{
                    height: '40px',
                    animation: `wave 1s ease-in-out infinite alternate`,
                    animationDelay: `${(i - 1) * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <section className="bg-stone-mist py-12 px-container-padding border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-outline-variant/30">
          {[
            { num: '10k+', label: 'Ideas Analyzed' },
            { num: '$2B', label: 'Market Cap Validated' },
            { num: '94%', label: 'Prediction Accuracy' },
            { num: '24/7', label: 'AI Analysis' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display-lg text-headline-md text-midnight-ink">{stat.num}</span>
              <span className="font-label-md text-on-surface-variant mt-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-section-gap px-container-padding max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6">Structural Intelligence</h2>
          <p className="font-body-lg text-on-surface-variant">Sophisticated tools wrapped in an elegant, minimal interface. Built for thinkers and founders.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-gutter">
          <div className="md:col-span-2 border border-stone-mist rounded-[32px] p-10 bg-white hover:bg-stone-mist/10 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-lavender-whisper flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-midnight-ink">insights</span>
            </div>
            <h3 className="font-label-md text-lg mb-4 text-midnight-ink uppercase tracking-widest">Market Sentiment</h3>
            <p className="font-body-md text-on-surface-variant mb-8 max-w-md">Real-time analysis of social chatter, news cycles, and competitor announcements synthesized into actionable briefs.</p>
            <div className="h-48 w-full bg-[#f7f3f0] rounded-xl border border-stone-mist relative overflow-hidden flex items-center justify-center">
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                alt="Market sentiment dashboard"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD98mwDEMutJgc-Nnrb_GafHMsBK1-AFRNQvRUcGaSjNwc0rPAWkpxaTLC2JwdsNTPf97IfiY20KD6mE5M5fYiXak3rwdLk982e_4ZodaUHtNYNy6Zvi7EEX6SO-bZ4Dt5_Fc6w9n96fcUEeDiDVkS9XpbthDVdopDPdKtnkcqb-aCdHF-9ZD3khSEoLfjrM7zskV6UkIwDPeXO_hk6Gry8mQZU0mZXTSy_ZaPoWjx9gXl39fdvHUgZ3iWLaycoXZPvbm63C2AdZGE"
              />
            </div>
          </div>
          <div className="border border-stone-mist rounded-[32px] p-10 bg-white hover:bg-stone-mist/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-lavender-whisper flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-midnight-ink">attach_money</span>
            </div>
            <h3 className="font-label-md text-lg mb-4 text-midnight-ink uppercase tracking-widest">Revenue Models</h3>
            <p className="font-body-md text-on-surface-variant">Automated generation of potential pricing tiers and monetization strategies based on successful SaaS analogs.</p>
          </div>
          <div className="border border-stone-mist rounded-[32px] p-10 bg-white hover:bg-stone-mist/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-lavender-whisper flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-midnight-ink">group_add</span>
            </div>
            <h3 className="font-label-md text-lg mb-4 text-midnight-ink uppercase tracking-widest">Competitor Mapping</h3>
            <p className="font-body-md text-on-surface-variant">Identify feature gaps and positioning opportunities in established markets with pinpoint accuracy.</p>
          </div>
          <div className="md:col-span-2 border border-stone-mist rounded-[32px] p-10 bg-midnight-ink text-white hover:bg-inverse-surface transition-colors">
            <div className="w-12 h-12 rounded-full bg-surface-tint flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-cream-paper">description</span>
            </div>
            <h3 className="font-label-md text-lg mb-4 text-cream-paper uppercase tracking-widest">Executive Summaries</h3>
            <p className="font-body-md text-surface-dim max-w-lg mb-8">Export beautifully typeset, investor-ready validation reports directly to PDF or Notion.</p>
            <button
              onClick={() => navigate('/analysis')}
              className="bg-lavender-whisper text-midnight-ink px-6 py-2 rounded-full font-label-md hover:bg-[#d6bee5] transition-colors"
            >
              View Sample Report
            </button>
          </div>
        </div>
      </section>

      <section className="border-t border-stone-mist">
        <div className="py-section-gap px-container-padding bg-cream-paper">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-display-lg text-headline-md text-graphite-veil mb-4 block">01</span>
              <h2 className="font-display-lg text-headline-md mb-6">Input Context</h2>
              <p className="font-body-md text-on-surface-variant">Provide a brief, plain-English description of your concept. No complex jargon required; the engine extrapolates intent from basic premises.</p>
            </div>
            <div className="h-64 border border-stone-mist rounded-xl bg-white p-6 relative overflow-hidden flex items-center justify-center">
              <span className="font-body-md text-graphite-veil italic">"An AI tool that..."</span>
            </div>
          </div>
        </div>
        <div className="py-section-gap px-container-padding bg-midnight-ink text-cream-paper">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="h-64 border border-[#31302f] rounded-xl bg-inverse-surface p-6 relative overflow-hidden order-2 md:order-1 flex items-center justify-center">
              <div className="h-10 flex items-center gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-surface-tint"
                    style={{
                      height: '40px',
                      animation: `wave 1s ease-in-out infinite alternate`,
                      animationDelay: `${(i - 1) * 0.2}s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="font-display-lg text-headline-md text-surface-tint mb-4 block">02</span>
              <h2 className="font-display-lg text-headline-md mb-6">Engine Processing</h2>
              <p className="font-body-md text-surface-dim">Our neural architecture cross-references your concept against historical startup data, search trends, and current market conditions.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </body>
  )
}
