import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import MobileNav from '../MobileNav';
import { User, Club, Role, ClubRole } from '../../types';

interface DashboardLayoutProps {
  user: User;
  clubs: Club[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  clubs,
  isDarkMode,
  onToggleTheme,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { clubId } = useParams();

  // Determine active context and tab based on URL
  const isClubContext = !!clubId;
  const activeContext = isClubContext ? (clubs.find(c => c.id === clubId)?.name || 'Club') : 'Global';
  
  // Extract active tab from path
  // e.g. /dashboard/events -> 'events'
  // e.g. /clubs/123/members -> 'members'
  const pathParts = location.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  // Map URL parts to sidebar IDs if they differ
  let activeTab = lastPart;
  if (location.pathname === '/dashboard') activeTab = 'dashboard';
  if (location.pathname.startsWith('/clubs/') && pathParts.length === 3) activeTab = 'club-dashboard';

  // Determine user's role in the current club context
  const currentClubMembership = isClubContext 
    ? user.clubMemberships.find(m => m.clubId === clubId)
    : null;
  const clubRole = currentClubMembership?.role as ClubRole || null;

  const handleContextChange = (contextId: string) => {
    if (contextId === 'Global') {
      navigate('/dashboard');
    } else {
      // Navigate to specific club dashboard
      // Note: Sidebar passes the club ID or 'Global'
      // If it's a club ID, we need to find it. 
      // But Sidebar currently passes 'Global' or... wait, Sidebar logic needs update.
      // For now, let's assume if we want to switch to a club, we'd need a way to select it.
      // The current Sidebar implementation might need a club switcher or we rely on the user navigating via the Club Directory.
      // However, the Sidebar usually shows context. 
      // Let's assume for now context switching happens via navigation elsewhere or a specific switcher.
      // If the Sidebar has a "Club HQ" button, it implies we are already in a club.
      // If we are in Global, we go to Dashboard.
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-[#0B1437] text-white' : 'bg-[#F2F3F5] text-slate-900'}`}>
      <Sidebar
        user={user}
        clubs={clubs}
        activeContext={activeContext}
        onContextChange={handleContextChange}
        userRole={user.globalRole as Role}
        clubRole={clubRole}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // Navigation logic based on tab ID
          if (isClubContext) {
            if (tab === 'club-dashboard') navigate(`/clubs/${clubId}`);
            else if (tab === 'chat') navigate(`/clubs/${clubId}/chat`);
            else navigate(`/clubs/${clubId}/${tab}`);
          } else {
            if (tab === 'dashboard') navigate('/dashboard');
            else if (tab === 'chat') navigate('/dashboard/chat');
            else navigate(`/dashboard/${tab}`);
          }
        }}
        isDarkMode={isDarkMode}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar
          user={user}
          clubs={clubs}
          activeContext={activeContext}
          onLogout={onLogout}
          isDarkMode={isDarkMode}
          onToggleTheme={onToggleTheme}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onOpenProfile={() => navigate('/dashboard/profile')}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <MobileNav 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // Reuse the same navigation logic
          if (isClubContext) {
            if (tab === 'club-dashboard') navigate(`/clubs/${clubId}`);
            else if (tab === 'chat') navigate(`/clubs/${clubId}/chat`);
            else navigate(`/clubs/${clubId}/${tab}`);
          } else {
            if (tab === 'dashboard') navigate('/dashboard');
            else if (tab === 'chat') navigate('/dashboard/chat');
            else navigate(`/dashboard/${tab}`);
          }
        }}
        onToggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default DashboardLayout;
