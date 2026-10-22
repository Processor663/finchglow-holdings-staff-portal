import { lazy, Suspense } from "react";
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "./components/Loading";
import { PortalProvider } from "./context";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";

// Lazy load pages for code splitting
const HomePage = lazy(() =>
  import("./pages/Views").then((module) => ({ default: module.HomePage })),
);
const ApplicationsPage = lazy(() =>
  import("./pages/Views").then((module) => ({ default: module.ApplicationsPage })),
);
const NewsPage = lazy(() =>
  import("./pages/Views").then((module) => ({
    default: module.NewsPage,
  })),
);
const AppDetailPage = lazy(() =>
  import("./pages/AppDetailPage").then((module) => ({
    default: module.AppDetailPage,
  })),
);
const HelpPage = lazy(() =>
  import("./pages/HelpPage").then((module) => ({
    default: module.HelpPage,
  })),
);

function Shell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar onOpenMenu={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/apps/:appId" element={<AppDetailPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <footer className="mt-10 border-t border-ink-200 pt-5 text-[11px] text-ink-400 dark:border-ink-800">
              Finchglow Holdings Group Staff Portal · Prototype with mock data ·
              Not connected to live systems.
            </footer>
          </main>
        </div>
      </div>
    </Suspense>
  );
}

export default function App() {
  return (
    <PortalProvider>
      <Shell />
    </PortalProvider>
  );
}
