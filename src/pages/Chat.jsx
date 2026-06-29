import Sidebar from '../components/Sidebar'
import MobileBottomNav from '../components/MobileBottomNav'

export default function Chat() {
  return (
    <body className="flex h-screen w-full bg-surface text-on-surface overflow-hidden">
      <Sidebar />

      <aside className="hidden lg:flex flex-col w-72 bg-inverse-surface border-r border-[#474740] shrink-0 h-full overflow-y-auto">
        <div className="p-6 sticky top-0 bg-inverse-surface/90 backdrop-blur-md z-10 border-b border-[#474740]">
          <h2 className="font-headline-md text-[20px] leading-[28px] text-inverse-on-surface tracking-tight">Recent Sessions</h2>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="text-surface-variant font-label-sm text-label-sm uppercase tracking-widest px-2 pt-2 pb-1">Today</div>
          <button className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-surface-tint/20 transition-colors text-left">
            <span className="font-body-md text-label-md text-inverse-on-surface truncate">SaaS Monetization Models</span>
            <span className="font-body-md text-[12px] text-surface-variant truncate">How can I structure tiered pricing...</span>
          </button>
          <button className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-surface-tint/20 transition-colors text-left">
            <span className="font-body-md text-label-md text-inverse-on-surface truncate">Competitor Analysis: Acme Corp</span>
            <span className="font-body-md text-[12px] text-surface-variant truncate">Analyze their Q3 feature releases...</span>
          </button>
          <div className="text-surface-variant font-label-sm text-label-sm uppercase tracking-widest px-2 pt-6 pb-1">Previous 7 Days</div>
          <button className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-surface-tint/20 transition-colors text-left">
            <span className="font-body-md text-label-md text-inverse-on-surface truncate">Landing Page Copy Review</span>
            <span className="font-body-md text-[12px] text-surface-variant truncate">Make the hero section more...</span>
          </button>
          <button className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-surface-tint/20 transition-colors text-left">
            <span className="font-body-md text-label-md text-inverse-on-surface truncate">User Persona Generation</span>
            <span className="font-body-md text-[12px] text-surface-variant truncate">Create 3 distinct profiles for...</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full relative bg-surface">
        <header className="absolute top-0 left-0 w-full p-6 flex justify-center items-center z-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50">
          <h2 className="font-headline-md text-[24px] text-on-surface">Chat with Validator AI</h2>
        </header>

        <div className="flex-1 overflow-y-auto px-6 md:px-container-padding pt-24 pb-48 flex flex-col gap-stack-lg max-w-4xl mx-auto w-full">
          <div className="flex gap-4 self-start max-w-[85%] md:max-w-[75%]">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed border border-tertiary-fixed-dim flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-surface-container-lowest border border-tertiary-fixed rounded-2xl rounded-tl-sm p-5 shadow-sm">
              <p className="font-body-md text-body-md text-on-surface">
                Hello. I'm Validator AI. I've analyzed your current project context regarding the B2B SaaS initiative. How can I assist you with your strategy today?
              </p>
            </div>
          </div>

          <div className="flex gap-4 self-end max-w-[85%] md:max-w-[75%] flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tr-sm p-5 shadow-sm">
              <p className="font-body-md text-body-md text-on-surface">
                We're struggling with our pricing tiers. How can I monetize a feature that currently feels like a 'nice-to-have' rather than a 'must-have'?
              </p>
            </div>
          </div>

          <div className="flex gap-4 self-start max-w-[85%] md:max-w-[75%]">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed border border-tertiary-fixed-dim flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-surface-container-lowest border border-tertiary-fixed rounded-2xl rounded-tl-sm p-5 shadow-sm">
              <p className="font-body-md text-body-md text-on-surface mb-4">
                Monetizing "nice-to-have" features requires shifting the perceived value. Instead of selling the feature itself, you must sell the outcome it produces.
              </p>
              <p className="font-body-md text-body-md text-on-surface mb-4">
                Consider these three structural approaches:
              </p>
              <ul className="flex flex-col gap-3 font-body-md text-body-md text-on-surface pl-4 border-l border-outline-variant">
                <li><strong>1. The Usage Cap:</strong> Include the feature in the base tier but limit its volume. Once they experience the workflow efficiency, charging for higher volume becomes a frictionless upgrade.</li>
                <li><strong>2. The Reporting Pivot:</strong> If the feature generates data, the feature is free, but the advanced reporting and exporting of that data sits in a premium tier.</li>
                <li><strong>3. The Workflow Integration:</strong> The feature is standalone on the free tier, but integrating it directly into Slack, Teams, or Salesforce requires the Pro tier.</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 self-start max-w-[85%] md:max-w-[75%]">
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed border border-tertiary-fixed-dim flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
            </div>
            <div className="bg-surface-container-lowest border border-tertiary-fixed rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1 h-[42px]">
              <div className="w-1.5 h-1.5 bg-tertiary rounded-full" style={{ animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
              <div className="w-1.5 h-1.5 bg-tertiary rounded-full" style={{ animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
              <div className="w-1.5 h-1.5 bg-tertiary rounded-full" style={{ animation: 'typing 1.4s infinite ease-in-out both' }}></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full left-0 bg-gradient-to-t from-surface via-surface to-transparent pt-12 pb-6 px-6 md:px-container-padding flex flex-col items-center pointer-events-none">
          <div className="max-w-4xl w-full pointer-events-auto">
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
              {['How can I monetize?', 'Generate a competitor matrix', 'Draft investor updates'].map((prompt) => (
                <button
                  key={prompt}
                  className="bg-tertiary-fixed hover:bg-tertiary-fixed-dim border border-tertiary-fixed-dim text-on-tertiary-fixed font-body-md text-label-md px-4 py-2 rounded-full whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-2 flex items-end shadow-sm transition-colors focus-within:border-on-surface focus-within:shadow-md">
              <button className="p-3 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <textarea
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-2 font-body-md text-body-md text-on-surface placeholder:text-outline"
                placeholder="Message Validator AI..."
                rows={1}
              ></textarea>
              <button className="p-3 bg-tertiary hover:bg-on-tertiary-fixed text-on-tertiary rounded-[10px] transition-colors ml-2 shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              </button>
            </div>
            <p className="text-center font-body-md text-[12px] text-on-surface-variant mt-3">Validator AI can make mistakes. Verify critical information.</p>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </body>
  )
}
