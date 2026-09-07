import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';
import GuidedTourModal from '@/components/common/GuidedTourModal';
import FloatingTutorialHelper from '@/components/common/FloatingTutorialHelper';

export const metadata: Metadata = {
  title: 'TRACEVIDENCE — Trace the Evidence. Measure the Trust.',
  description:
    'Research prototype combining deep evidence provenance (TRACE-X) and reliability/decision intelligence (AIVIDENCE). Explainable claims, origin tracing, and selective prediction.',
  keywords: [
    'Evidence Provenance',
    'Decision Intelligence',
    'TRACE-X',
    'AIVIDENCE',
    'Avishkar Research',
    'Selective Prediction',
    'Hallucination Auditing',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0e1a] text-slate-100 antialiased selection:bg-rose-500 selection:text-white relative">
        {/* Organic Ambient Atmosphere - Red, Blue, Green, White lighting meshes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Crimson / Coral Red Orb */}
          <div className="ambient-rbgw-glow -top-32 -left-32 h-[550px] w-[550px] bg-rose-600/18" />
          {/* Sapphire / Deep Blue Orb */}
          <div className="ambient-rbgw-glow top-1/4 right-0 h-[600px] w-[600px] bg-blue-600/18" />
          {/* Lush Emerald Green Orb */}
          <div className="ambient-rbgw-glow bottom-1/4 left-1/3 h-[500px] w-[500px] bg-emerald-500/15" />
          {/* Luminous Pure White Spotlight */}
          <div className="ambient-rbgw-glow top-10 left-1/2 -translate-x-1/2 h-[350px] w-[350px] bg-white/10 blur-[140px]" />
          {/* Subtle noise/grid blend texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <TooltipProvider>
          <div className="relative z-10 flex min-h-screen flex-col justify-between">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <GuidedTourModal />
          <FloatingTutorialHelper />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '15px',
                fontWeight: '500',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
