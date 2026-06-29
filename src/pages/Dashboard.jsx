import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/MobileBottomNav'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <body className="bg-background text-on-background font-body-md text-body-md flex min-h-screen">
      <Sidebar />

      <main className="flex-1 md:ml-64 relative min-h-screen">
        <header className="md:hidden bg-surface/80 backdrop-blur-md border-b border-outline-variant sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              className="w-8 h-8 rounded-full object-cover"
              alt="Logo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzh8Cu2G5otlWN-5vBJprn1Q5O7ovGYcEwuQWonQs-hERzwDvTmJWrSqmcrd921uk63XiMcfMvaSgyyu67jyOCno578RPVh_YPllX5K4QjIfE_nUZElTVFgo3v-leu_WCZe1Yj-Gn_xiv_-FgFQwqG0VGmyUhud-sWZyU-zs5dT8tP0AbZFoL9hktC7haxY4g97c1iB3gK6AXZMB---hm1TdH4fWIEE83tnxwyrrYuY2uELZRK7q95rbURFGxCvgQ2m50ESrdkjQ4"
            />
            <h1 className="font-display-lg-mobile text-headline-md font-bold tracking-tight text-on-surface">Validator Pro</h1>
          </div>
          <button
            onClick={() => navigate('/analysis')}
            className="bg-tertiary-fixed text-on-surface p-2 rounded-full border border-outline-variant"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </header>

        <div className="p-container-padding max-w-[1440px] mx-auto pb-24 md:pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-section-gap pt-8 md:pt-4">
            <div>
              <p className="font-body-md text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Overview</p>
              <h2 className="font-display-xl text-[clamp(40px,5vw,72px)] leading-[76px] tracking-[-0.04em] font-medium text-on-surface">Startup Intelligence</h2>
            </div>
            <div className="hidden md:flex gap-4 mt-6 md:mt-0">
              <button className="bg-surface-container-lowest border border-outline-variant px-6 py-3 rounded-full font-body-md text-label-md hover:bg-surface-container-low transition-colors">
                Export Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-grid-gutter mb-section-gap">
            <div className="md:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 flex flex-col justify-center items-center text-center relative overflow-hidden h-[400px]">
              <div className="absolute top-6 left-6 font-body-md text-label-sm text-on-surface-variant tracking-wider uppercase">Viability Index</div>
              <div className="relative w-64 h-64 flex justify-center items-center mt-4">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="45" stroke="#e5e2df" strokeWidth="4"></circle>
                  <circle cx="50" cy="50" fill="none" r="45" stroke="#d6bee5" strokeDasharray="283" strokeDashoffset="60" strokeWidth="8"></circle>
                </svg>
                <div className="z-10 flex flex-col items-center">
                  <span className="font-display-xl text-[80px] leading-none text-on-surface">82</span>
                  <span className="font-body-md text-label-md text-on-surface-variant mt-2">Strong Potential</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-grid-gutter">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between h-[188px]">
                <div className="flex justify-between items-start">
                  <span className="font-body-md text-label-sm text-on-surface-variant tracking-wider uppercase">Ideas Analyzed</span>
                  <span className="material-symbols-outlined text-tertiary">analytics</span>
                </div>
                <div className="font-display-lg text-display-lg text-on-surface">1,248</div>
                <div className="font-body-md text-label-sm text-primary">+12% this month</div>
              </div>

              <div className="bg-inverse-surface border border-[#1c1b1a] rounded-[32px] p-6 flex flex-col justify-between h-[188px] text-inverse-on-surface">
                <div className="flex justify-between items-start">
                  <span className="font-body-md text-label-sm text-surface-variant tracking-wider uppercase">Success Prob.</span>
                  <span className="material-symbols-outlined text-tertiary-fixed">trending_up</span>
                </div>
                <div className="font-display-lg text-display-lg">68%</div>
                <div className="font-body-md text-label-sm text-surface-dim">Avg across portfolio</div>
              </div>

              <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 h-[188px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-body-md text-label-sm text-on-surface-variant tracking-wider uppercase">Market Opportunity</span>
                </div>
                <div className="flex-1 flex items-end gap-2 px-4 pb-2">
                  <div className="w-1/4 bg-surface-variant h-1/3 rounded-t-sm relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-body-md text-label-sm text-on-surface bg-surface-container-high px-2 py-1 rounded transition-opacity whitespace-nowrap">SaaS</div>
                  </div>
                  <div className="w-1/4 bg-primary-fixed-dim h-2/3 rounded-t-sm relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-body-md text-label-sm text-on-surface bg-surface-container-high px-2 py-1 rounded transition-opacity whitespace-nowrap">Fintech</div>
                  </div>
                  <div className="w-1/4 bg-tertiary-fixed-dim h-full rounded-t-sm relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-body-md text-label-sm text-on-surface bg-surface-container-high px-2 py-1 rounded transition-opacity whitespace-nowrap">AI Tech</div>
                  </div>
                  <div className="w-1/4 bg-surface-variant h-1/2 rounded-t-sm relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 font-body-md text-label-sm text-on-surface bg-surface-container-high px-2 py-1 rounded transition-opacity whitespace-nowrap">Health</div>
                  </div>
                </div>
                <div className="flex justify-between text-on-surface-variant text-[10px] uppercase mt-2 px-4">
                  <span>SaaS</span>
                  <span>Fin</span>
                  <span>AI</span>
                  <span>Med</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[800px] mx-auto mb-section-gap">
            <div className="flex justify-between items-end border-b border-outline-variant pb-4 mb-8">
              <h3 className="font-headline-md text-headline-md text-on-surface">Recent Analyses</h3>
              <button className="font-body-md text-label-md text-on-surface hover:text-tertiary transition-colors">View All Archive →</button>
            </div>
            <div className="flex flex-col">
              {[
                { title: 'Autonomous Supply Chain Orchestration', desc: 'AI-driven predictive logistics for mid-market manufacturing.', tag: 'Logistics', score: 94, tagBg: '#204E4A' },
                { title: 'Generative Architectural Drafting', desc: 'Automating initial residential blueprints based on zoning laws.', tag: 'PropTech', score: 76, tagBg: '#204E4A' },
                { title: 'Neuro-adaptive E-Learning Platform', desc: 'Real-time curriculum adjustment using webcam attention tracking.', tag: 'EdTech', score: 42, tagBg: '#F39C12' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-outline-variant gap-4 hover:bg-surface-container-low transition-colors px-4 -mx-4 rounded-lg cursor-pointer"
                  onClick={() => navigate('/analysis')}
                >
                  <div className="flex-1">
                    <h4 className="font-display-lg text-[24px] text-on-surface mb-1">{item.title}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="text-white px-3 py-1 rounded-full font-body-md text-label-sm"
                      style={{ backgroundColor: item.tagBg }}
                    >
                      {item.tag}
                    </span>
                    <span className="font-display-lg text-[24px] text-on-surface w-12 text-right">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-8 lg:p-12 mb-section-gap flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 flex flex-col gap-6">
              <h3 className="font-display-lg text-headline-md text-on-surface">Deep Industry Breakdown</h3>
              <p className="font-body-md text-body-lg text-on-surface-variant">Our latest models show a significant pivot towards applied generative AI in traditional sectors. Fintech and Logistics are currently presenting the highest viability scores with the lowest barrier to entry for specialized B2B solutions.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-tertiary-fixed-dim text-on-surface px-4 py-2 rounded-full font-body-md text-label-md">Trending: B2B SaaS</span>
                <span className="bg-surface-variant text-on-surface px-4 py-2 rounded-full font-body-md text-label-md">Saturated: Consumer AI</span>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div
                className="relative w-64 h-64 rounded-full border-4 border-outline-variant overflow-hidden"
                style={{ background: 'conic-gradient(#d6bee5 0% 45%, #c7c8b5 45% 75%, #1c1b1a 75% 100%)' }}
              >
                <div className="absolute inset-8 bg-surface-container-lowest rounded-full flex justify-center items-center">
                  <span className="font-display-lg text-[32px] text-on-surface">Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </body>
  )
}
