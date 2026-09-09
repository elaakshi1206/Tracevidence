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
    <html lang="en">
      <body className="min-h-screen bg-[#f8fafc] text-[#0f172a] antialiased selection:bg-[#0f766e] selection:text-white relative">
        {/* Soft Ambient Teal & Coral Atmosphere */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Soft Deep Teal Orb */}
          <div className="ambient-glow -top-32 -left-32 h-[500px] w-[500px] bg-teal-200/40" />
          {/* Soft Coral Orb */}
          <div className="ambient-glow top-1/4 right-0 h-[500px] w-[500px] bg-orange-100/50" />
          {/* Subtle Emerald Tint */}
          <div className="ambient-glow bottom-1/4 left-1/3 h-[450px] w-[450px] bg-emerald-100/30" />
          {/* Pure White Central Wash */}
          <div className="ambient-glow top-10 left-1/2 -translate-x-1/2 h-[350px] w-[350px] bg-white/80" />
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
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
