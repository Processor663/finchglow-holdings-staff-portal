import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PortalProvider } from './context';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HomePage, ApplicationsPage, NewsPage } from './pages/Views';
import { HelpPage } from './pages/HelpPage';
import { AppDetailPage } from './pages/AppDetailPage';

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8">
          <Routes>
          
          </Routes>
          <footer className="mt-10 bg-red border-t border-ink-200 pt-5 text-[11px] text-ink-400 dark:border-ink-800">
            Finchglow Holdings Group Staff Portal. 
          </footer>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <Shell />
    </PortalProvider>
  );
}
