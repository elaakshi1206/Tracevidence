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
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black">
        <TooltipProvider>
          <div className="relative flex min-h-screen flex-col justify-between">
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
                background: '#0d1424',
                color: '#f1f5f9',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontSize: '13px',
              },
            }}
          />
        </TooltipProvider>
      </body>
    </html>
  );
}
