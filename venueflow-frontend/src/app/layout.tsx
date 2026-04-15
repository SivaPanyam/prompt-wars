import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VenueFlow | The Intelligent Stadium Nervous System',
  description: 'AI-Native stadium management mesh with real-time sentiment telemetry and life-safety orchestration. Engineered for the future of live entertainment.',
  keywords: ['Stadium Management', 'AI', 'IoT Mesh', 'Security', 'Next.js', 'FastAPI'],
  authors: [{ name: 'VenueFlow Engineering' }],
  openGraph: {
    title: 'VenueFlow | AI-Native Stadium Operations',
    description: 'Real-time telemetry and generative AI for large-scale venue management.',
    url: 'https://venueflow-173012947539.us-central1.run.app/',
    siteName: 'VenueFlow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VenueFlow | The Stadium Brain',
    description: 'Transforming stadium blind spots into actionable AI intelligence.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {/* Universal Top Nav for the Prototype */}
        <nav className="glass-panel sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-bold text-white text-lg">V</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-white/90">VenueFlow</span>
          </div>
          <div className="flex gap-4">
            <a href="/dashboard" className="text-sm font-medium text-white/70 hover:text-blue-400 transition-colors">Staff Command</a>
            <a href="/attendee" className="text-sm font-medium text-white/70 hover:text-cyan-400 transition-colors">Attendee App</a>
          </div>
        </nav>
        
        <main className="flex-grow flex flex-col items-center p-6 relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="w-full max-w-6xl z-10">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
