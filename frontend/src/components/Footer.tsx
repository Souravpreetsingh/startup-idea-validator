'use client'

import { useRouter } from 'next/navigation'

export default function Footer() {
  const router = useRouter()

  return (
    <footer className="bg-inverse-surface text-inverse-on-surface py-[80px] px-[40px] border-t border-on-surface-variant w-full mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-[24px]">
        <div className="md:col-span-1">
          <div className="font-display-lg text-[40px] md:text-display-lg text-inverse-on-surface mb-6">Validator AI</div>
          <p className="font-body-md text-surface-variant mb-6 text-sm">Editorial-grade startup validation for the modern founder.</p>
          <p className="font-body-md text-surface-variant text-sm">&copy; 2024 Validator AI. All rights reserved.</p>
        </div>
        <div>
          <h4 className="font-label-md mb-4 text-cream-paper uppercase tracking-widest text-xs">Product</h4>
          <ul className="space-y-3 font-body-md">
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Features</button></li>
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Pricing</button></li>
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Case Studies</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md mb-4 text-cream-paper uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-3 font-body-md">
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">API Docs</button></li>
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Blog</button></li>
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Contact Support</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-label-md mb-4 text-cream-paper uppercase tracking-widest text-xs">Legal</h4>
          <ul className="space-y-3 font-body-md">
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Privacy Policy</button></li>
            <li><button className="text-surface-variant hover:text-primary-fixed-dim transition-colors opacity-80 hover:opacity-100">Terms of Service</button></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
