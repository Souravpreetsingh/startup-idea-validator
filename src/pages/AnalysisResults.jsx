import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/MobileBottomNav'

export default function AnalysisResults() {
  const navigate = useNavigate()

  return (
    <body className="bg-background text-on-background font-body-md min-h-screen flex antialiased">
      <Sidebar />

      <main className="flex-grow md:ml-64 p-container-padding flex flex-col gap-section-gap max-w-7xl mx-auto w-full pb-24 md:pb-12">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface tracking-tighter">Analysis Results</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">Comprehensive AI evaluation for "Decentralized Personal Data Vault".</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-low transition-colors">Export PDF</button>
              <button className="px-6 py-3 rounded-full bg-on-surface text-surface font-label-md hover:bg-on-surface-variant transition-colors">Share Report</button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-5 gap-grid-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Idea Score</span>
              <span className="material-symbols-outlined text-tertiary">military_tech</span>
            </div>
            <div className="mt-4">
              <span className="font-display-lg text-display-lg text-on-surface leading-none">84</span>
              <span className="font-body-md text-body-md text-on-surface-variant">/100</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Market Demand</span>
              <span className="material-symbols-outlined text-tertiary">monitoring</span>
            </div>
            <div className="mt-4">
              <span className="font-display-lg text-headline-md text-on-surface leading-tight block">High</span>
              <span className="font-body-md text-label-sm text-on-surface-variant">Growing at 12% YoY</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Competition</span>
              <span className="material-symbols-outlined text-tertiary">swords</span>
            </div>
            <div className="mt-4">
              <span className="font-display-lg text-headline-md text-on-surface leading-tight block">Moderate</span>
              <span className="font-body-md text-label-sm text-on-surface-variant">3 key players</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 flex flex-col justify-between aspect-square md:aspect-auto">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Growth Potential</span>
              <span className="material-symbols-outlined text-tertiary">rocket_launch</span>
            </div>
            <div className="mt-4">
              <span className="font-display-lg text-headline-md text-on-surface leading-tight block">Strong</span>
              <span className="font-body-md text-label-sm text-on-surface-variant">Scalable model</span>
            </div>
          </div>

          <div className="bg-inverse-surface text-inverse-on-surface rounded-[32px] p-6 flex flex-col justify-between aspect-square md:aspect-auto col-span-2 md:col-span-1">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-surface-variant uppercase tracking-widest">Success Prob.</span>
              <span className="material-symbols-outlined text-tertiary-fixed">percent</span>
            </div>
            <div className="mt-4">
              <span className="font-display-lg text-display-lg text-inverse-on-surface leading-none">68</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
          <div className="lg:col-span-8 flex flex-col gap-section-gap">
            <section className="flex flex-col gap-6">
              <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">SWOT Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container-low transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-tertiary-fixed"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-on-surface">fitness_center</span>
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Strengths</h4>
                  </div>
                  <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                    <li className="flex gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> First-mover advantage in niche</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-tertiary text-[18px]">check</span> Low initial overhead costs</li>
                  </ul>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container-low transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-outline"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-on-surface">warning</span>
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Weaknesses</h4>
                  </div>
                  <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                    <li className="flex gap-2"><span className="material-symbols-outlined text-outline text-[18px]">close</span> High reliance on user trust</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-outline text-[18px]">close</span> Complex regulatory landscape</li>
                  </ul>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container-low transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-fixed"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-on-surface">lightbulb</span>
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Opportunities</h4>
                  </div>
                  <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span> Increasing data privacy concerns</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span> B2B white-label potential</li>
                  </ul>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 relative overflow-hidden group hover:bg-surface-container-low transition-colors">
                  <div className="absolute top-0 left-0 w-1 h-full bg-error-container"></div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-on-surface">bolt</span>
                    <h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Threats</h4>
                  </div>
                  <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                    <li className="flex gap-2"><span className="material-symbols-outlined text-error text-[18px]">warning</span> Big tech entering the space</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-error text-[18px]">warning</span> Sudden legislative changes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-6">
              <h3 className="font-headline-md text-headline-md text-on-surface border-b border-outline-variant pb-2">Competitor Landscape</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-body-lg text-body-lg font-bold text-on-surface">DataShield Inc.</h4>
                    <span className="bg-surface-container-highest px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant">Market Leader</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4 mt-2">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-2">Strengths</span>
                      <ul className="font-body-md text-label-sm text-on-surface space-y-1">
                        <li>• Strong brand trust</li>
                        <li>• Enterprise features</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-2">Weaknesses</span>
                      <ul className="font-body-md text-label-sm text-on-surface space-y-1">
                        <li>• Expensive pricing</li>
                        <li>• Clunky UI/UX</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-body-lg text-body-lg font-bold text-on-surface">Vaultify</h4>
                    <span className="bg-surface-container-highest px-3 py-1 rounded-full font-label-sm text-label-sm text-on-surface-variant">Challenger</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4 mt-2">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-2">Strengths</span>
                      <ul className="font-body-md text-label-sm text-on-surface space-y-1">
                        <li>• Mobile-first design</li>
                        <li>• Viral marketing</li>
                      </ul>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-2">Weaknesses</span>
                      <ul className="font-body-md text-label-sm text-on-surface space-y-1">
                        <li>• Limited API access</li>
                        <li>• High churn rate</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-section-gap">
            <section className="bg-surface-dim border border-outline-variant rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-outline-variant pb-4">
                <span className="material-symbols-outlined text-on-surface">precision_manufacturing</span>
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface">MVP Recommendation</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Focus purely on the core encryption vault and simple API key generation. Ignore social features and advanced analytics for the first release.</p>
              <button className="w-full mt-2 bg-on-surface text-surface py-3 rounded-xl font-label-md hover:bg-on-surface-variant transition-colors">View Technical Spec</button>
            </section>

            <section className="flex flex-col gap-6">
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface border-b border-outline-variant pb-2">Growth Timeline</h3>
              <div className="relative pl-6 border-l border-outline-variant ml-4 space-y-8">
                {[
                  { title: 'Month 1-3: Private Beta', desc: 'Onboard 100 highly engaged users from niche subreddits.' },
                  { title: 'Month 4-6: Public Launch', desc: 'Product Hunt launch and targeted content marketing.' },
                  { title: 'Month 7-12: B2B API', desc: 'Release API for small developers to integrate the vault.' },
                ].map((node) => (
                  <div key={node.title} className="relative">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-tertiary-fixed border-2 border-surface"></div>
                    <h4 className="font-label-md text-label-md text-on-surface">{node.title}</h4>
                    <p className="font-body-md text-label-sm text-on-surface-variant mt-1">{node.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface border-b border-outline-variant pb-2">Investor Match</h3>
              <div className="flex flex-wrap gap-2">
                {['Seed Stage SaaS', 'Privacy Tech', 'Micro VC'].map((tag) => (
                  <span
                    key={tag}
                    className="border border-tertiary text-on-surface px-4 py-2 rounded-full font-label-sm text-label-sm bg-surface-container-lowest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </body>
  )
}
