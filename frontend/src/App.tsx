import React, { useState, useEffect } from 'react';
import { ScreenType } from './types';
import { NavigationHeader } from './components/NavigationHeader';
import { ConciergeHomeView } from './views/ConciergeHomeView';
import { ConciergeChatView } from './views/ConciergeChatView';
import { LoginView } from './views/LoginView';
import { AdminView } from './views/AdminView';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('concierge-home');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('sunu_auth') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sunu_admin_role') === 'admin';
  });
  const [activeChatQuery, setActiveChatQuery] = useState<string>('I need some information about student insurance for studying abroad. Specifically Visa Études.');
  const { theme } = useTheme();

  // Handle URL hash changes for direct linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenType;
      if (['login', 'concierge-home', 'concierge-chat', 'admin'].includes(hash)) {
        setCurrentScreen(hash);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.location.hash = screen;
  };

  const handleLoginSuccess = (role?: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('sunu_auth', 'true');
    if (role) {
      localStorage.setItem('sunu_admin_role', role);
      setIsAdmin(role === 'admin');
    }
    // Admins vont directement au panneau admin
    navigateTo(role === 'admin' ? 'admin' : 'concierge-home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('sunu_auth');
    localStorage.removeItem('sunu_admin_token');
    localStorage.removeItem('sunu_admin_role');
    navigateTo('login');
  };

  const handleStartChat = (query: string) => {
    setActiveChatQuery(query);
    navigateTo('concierge-chat');
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-[#E21E26] selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#131313] text-[#e2e2e2]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* Top Universal Navigation */}
      <NavigationHeader
        currentScreen={currentScreen}
        onNavigate={navigateTo}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* Screen Renderers */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentScreen === 'concierge-home' && (
          <ConciergeHomeView
            onStartChat={handleStartChat}
          />
        )}

        {currentScreen === 'concierge-chat' && (
          <ConciergeChatView
            initialMessage={activeChatQuery}
            onNavigateHome={() => navigateTo('concierge-home')}
          />
        )}

        {currentScreen === 'admin' && (
          <AdminView onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
