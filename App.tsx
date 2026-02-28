import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { User, Club, Applicant, Event, Role, AuditLog, Registration } from './types';
import { db } from './db';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';

// Page Components
import LandingPage from './components/pages/LandingPage';
import Onboarding from './components/pages/Onboarding';
import GlobalStudentDashboard from './components/pages/GlobalStudentDashboard';
import ClubHome from './components/pages/ClubHome';
import ClubMembers from './components/pages/ClubMembers';
import AttendanceControl from './components/pages/AttendanceControl';
import EventOperations from './components/pages/EventOperations';
import ClubFinance from './components/pages/ClubFinance';
import RecruitmentBoard from './components/RecruitmentBoard';
import CertificationGovernance from './components/pages/CertificationGovernance';
import ClubSiteEditor from './components/pages/ClubSiteEditor';
import ClubSettings from './components/pages/ClubSettings';
import MyApplications from './components/pages/MyApplications';
import MyTickets from './components/pages/MyTickets';
import MyPayments from './components/pages/MyPayments';
import MyCertificates from './components/pages/MyCertificates';
import CampusEvents from './components/pages/CampusEvents';
import GlobalClubs from './components/pages/GlobalClubs';
import StudentProfile from './components/pages/StudentProfile';
import FacultyFeed from './components/pages/FacultyFeed';
import FacultyOversight from './components/pages/FacultyOversight';
import InstitutionalKPIs from './components/pages/InstitutionalKPIs';
import SuperAdminHub from './components/pages/SuperAdminHub';
import StudentRegistry from './components/pages/StudentRegistry';
import FacultyRegistry from './components/pages/FacultyRegistry';
import GlobalAnalytics from './components/pages/GlobalAnalytics';
import SystemLogs from './components/pages/SystemLogs';
import Developers from './components/pages/Developers';
import ChatSystem from './components/pages/ChatSystem';
import Notifications from './components/pages/Notifications';
import DevelopedBy from './components/pages/DevelopedBy';

// Public Pages
import { LegalDocs, ReportIssue, FacultyPortalInfo, StudentLeadership } from './components/pages/PublicPages';
import EventRegistry from './components/pages/EventRegistry';
import ClubDirectoryPublic from './components/pages/ClubDirectoryPublic';
import PlatformFeatures from './components/pages/PlatformFeatures';
import LiveFeedPublic from './components/pages/LiveFeedPublic';
import CertificateVerification from './components/pages/CertificateVerification';
import CertificateView from './components/pages/CertificateView';
import AuthCallback from './components/pages/AuthCallback';

const App: React.FC = () => {
  // Boot Sequence State
  const [isBooting, setIsBooting] = useState(true);
  
  // App State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Light Mode

  // Data State
  const [data, setData] = useState<{
    users: User[];
    clubs: Club[];
    events: Event[];
    registrations: Registration[];
    applicants: Applicant[];
    logs: AuditLog[];
  }>({
    users: [],
    clubs: [],
    events: [],
    registrations: [],
    applicants: [],
    logs: []
  });

  const navigate = useNavigate();

  // --- BOOT SEQUENCE EFFECT ---
  useEffect(() => {
    setTimeout(() => setIsBooting(false), 1500);
  }, []);

  // --- AUTH STATE LISTENER ---
  useEffect(() => {
    const checkSession = async () => {
        try {
            // Check if we have a token in local storage
            const token = localStorage.getItem('authToken');
            if (token) {
                // Ideally verify token with backend, but for now just try to fetch user profile if we have an ID stored?
                // Or just rely on the fact that if we have a token, we might be logged in.
                // But we need the user object.
                // Let's try to fetch the user if we have a stored user ID or just wait for login.
                // Actually, db.login returns the user.
                // If we reload, we lose the user object in state.
                // We need a way to restore session.
                // For this refactor, let's assume if no user in state, we are logged out, unless we implement a /me endpoint.
                // The previous firebase implementation handled this via onAuthStateChanged.
                // With custom auth, we need to fetch user profile on load if token exists.
                
                // Simplified: If token exists, try to fetch "me" (not implemented yet) or just clear token.
                // For now, let's just clear session on reload to be safe, or implement a simple restore if we had a user ID stored.
                // Let's clear for now as we don't have a /me endpoint ready in the snippet.
                // localStorage.removeItem('authToken');
                setCurrentUser(null);
            } else {
                setCurrentUser(null);
            }
        } catch (e) {
            console.error("Session Check Failed:", e);
            setCurrentUser(null);
        }
    };
    checkSession();
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    const init = async () => {
      try {
        await db.initialize();
        const [clubs, events, logs] = await Promise.all([
          db.getClubs(),
          db.getEvents(),
          db.getLogs()
        ]);
        setData(prev => ({ ...prev, clubs, events, logs }));
        refreshData();
      } catch (err) {
        console.error("Initialization Failed:", err);
      }
    };
    if (!isBooting) init();
  }, [isBooting]);

  const refreshData = async () => {
    try {
        const [clubs, events] = await Promise.all([
          db.getClubs(),
          db.getEvents()
        ]);

        let users: User[] = [];
        let registrations: Registration[] = [];
        let applicants: Applicant[] = [];
        let logs: AuditLog[] = [];

        if (currentUser) {
            [users, registrations, applicants, logs] = await Promise.all([
                db.getUsers(),
                db.getRegistrations(),
                db.getApplicants(),
                db.getLogs()
            ]);
        } else {
            logs = await db.getLogs();
        }

        setData({ users, clubs, events, registrations, applicants, logs });
    } catch (e) {
        console.error("Data Refresh Failed:", e);
    }
  };

  const handleLogout = async () => {
    // Clear session
    setCurrentUser(null);
    navigate('/auth');
  };

  // --- BOOT SCREEN ---
  if (isBooting) {
    return (
      <div className="h-screen w-full bg-[#F2F3F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-16 h-16 bg-black rounded-[1.5rem] animate-pulse"></div>
           <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">System Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <LandingPage 
          events={data.events} 
          clubs={data.clubs} 
          onLogin={() => navigate('/auth')} 
          onRegister={() => navigate('/auth')} 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
          onOpenDeveloper={() => navigate('/developer-profile')} 
          onOpenProfile={() => navigate('/developed-by')} 
          onNavigate={(page) => navigate(`/${page}`)} 
        />
      } />
      
      <Route path="/auth" element={
        <Onboarding 
          onSelectRole={(user) => {
            setCurrentUser(user);
            navigate('/dashboard');
          }} 
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onOpenDeveloper={() => navigate('/developer-profile')}
          onOpenProfile={() => navigate('/developed-by')}
          onNavigate={(page) => navigate(`/${page}`)}
        />
      } />
      
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route path="/developed-by" element={<DevelopedBy isDarkMode={isDarkMode} onBack={() => navigate(-1)} />} />

      <Route path="/events" element={<EventRegistry events={data.events} clubs={data.clubs} onBack={() => navigate('/')} />} />
      <Route path="/clubs" element={<ClubDirectoryPublic clubs={data.clubs} onBack={() => navigate('/')} />} />
      <Route path="/leadership" element={<StudentLeadership clubs={data.clubs} users={data.users} onBack={() => navigate('/')} />} />
      <Route path="/features" element={<PlatformFeatures onBack={() => navigate('/')} />} />
      <Route path="/live" element={<LiveFeedPublic events={data.events} logs={data.logs} onBack={() => navigate('/')} />} />
      <Route path="/verify" element={<CertificateVerification onBack={() => navigate('/')} />} />
      <Route path="/verify/:id" element={<CertificateVerification onBack={() => navigate('/')} />} />
      <Route path="/certificate/:id" element={<CertificateView />} />
      <Route path="/privacy" element={<LegalDocs type="privacy" onBack={() => navigate('/')} />} />
      <Route path="/tos" element={<LegalDocs type="tos" onBack={() => navigate('/')} />} />
      <Route path="/report" element={<ReportIssue onBack={() => navigate('/')} />} />
      <Route path="/faculty-portal" element={<FacultyPortalInfo onLogin={() => navigate('/auth')} onBack={() => navigate('/')} />} />
      <Route path="/developer-profile" element={<Developers mode="public" isDarkMode={isDarkMode} onBack={() => navigate('/')} />} />

      {/* Protected Dashboard Routes */}
      {currentUser ? (
        <Route path="/dashboard" element={
          <DashboardLayout 
            user={currentUser} 
            clubs={data.clubs} 
            isDarkMode={isDarkMode} 
            onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
            onLogout={handleLogout} 
          />
        }>
          <Route index element={
            <GlobalStudentDashboard 
              user={currentUser} 
              events={data.events} 
              clubs={data.clubs} 
              certCount={0}
              onRegister={(eventId) => navigate(`/events?id=${eventId}`)}
              isDarkMode={isDarkMode}
              logs={data.logs}
              registrations={data.registrations}
              applicants={data.applicants}
            />
          } />
          <Route path="events" element={
            <CampusEvents 
              events={data.events} 
              clubs={data.clubs}
              registrations={data.registrations}
              onRegister={async (eventId, proxyData) => {
                // Handle registration logic here or pass a handler
                console.log('Registering for', eventId, proxyData);
                // For now, just refresh data
                await refreshData();
              }}
              isDarkMode={isDarkMode}
              user={currentUser}
            />
          } />
          <Route path="clubs" element={
            <GlobalClubs 
              clubs={data.clubs} 
              isDarkMode={isDarkMode}
              onEnterClub={(id) => navigate(`/clubs/${id}`)} 
            />
          } />
          <Route path="chat" element={<ChatSystem currentUser={currentUser} />} />
          <Route path="notifications" element={<Notifications user={currentUser} isDarkMode={isDarkMode} />} />
          
          {/* Student Routes */}
          <Route path="recruitment" element={
            <MyApplications 
              applicants={data.applicants} 
              clubs={data.clubs} 
              userName={currentUser.name}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="tickets" element={
            <MyTickets 
              registrations={data.registrations} 
              events={data.events} 
              clubs={data.clubs}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="certificates" element={
            <MyCertificates 
              registrations={data.registrations} 
              clubs={data.clubs} 
              events={data.events} 
            />
          } />
          <Route path="payments" element={
            <MyPayments 
              registrations={data.registrations} 
              applicants={data.applicants} 
              events={data.events} 
              clubs={data.clubs}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="profile" element={
            <StudentProfile 
              user={currentUser} 
              onSave={async (u) => { 
                await db.saveUser(u);
                setCurrentUser(u); 
                refreshData(); 
              }} 
              isDarkMode={isDarkMode}
              registrations={data.registrations}
              applicants={data.applicants}
              events={data.events}
            />
          } />
          
          {/* Faculty Routes */}
          <Route path="faculty-dashboard" element={
            <FacultyFeed 
              user={currentUser} 
              clubs={data.clubs} 
              onManageClub={(clubId) => navigate(`/clubs/${clubId}`)} 
            />
          } />
          <Route path="approvals" element={
            <FacultyOversight 
              clubs={data.clubs} 
              events={data.events} 
              onApprove={async (id) => {
                await db.approveEvent(id);
                refreshData();
              }}
            />
          } />
          <Route path="reports" element={
            <InstitutionalKPIs 
              clubs={data.clubs} 
              events={data.events} 
              registrations={data.registrations} 
              applicants={data.applicants} 
            />
          } />
          
          {/* Admin Routes */}
          <Route path="admin-dashboard" element={
            <SuperAdminHub 
              clubs={data.clubs} 
              allUsers={data.users} 
              onFreeze={async (id) => {
                await db.toggleClubFreeze(id);
                refreshData();
              }}
              onEnterClub={(id) => navigate(`/clubs/${id}`)}
              onAddClub={async (club) => {
                await db.saveClub(club);
                refreshData();
              }}
              onAppointPresident={async (clubId, studentId) => {
                await db.appointPresident(clubId, studentId);
                refreshData();
              }}
              onAssignFaculty={async (clubId, faculty) => {
                await db.assignFaculty(clubId, faculty);
                refreshData();
              }}
              onAddUser={async (user) => {
                await db.saveUser(user);
                refreshData();
              }}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="student-registry" element={
            <StudentRegistry 
              allUsers={data.users} 
              onAddUser={async (user) => {
                await db.saveUser(user);
                refreshData();
              }}
              onUpdateUser={async (user) => {
                await db.saveUser(user);
                refreshData();
              }}
              onRemoveUser={async (id) => {
                await db.deleteUser(id);
                refreshData();
              }}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="faculty-registry" element={
            <FacultyRegistry 
              allUsers={data.users} 
              onAddUser={async (user) => {
                await db.saveUser(user);
                refreshData();
              }}
              onUpdateUser={async (user) => {
                await db.saveUser(user);
                refreshData();
              }}
              onRemoveUser={async (id) => {
                await db.deleteUser(id);
                refreshData();
              }}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="analytics" element={
            <GlobalAnalytics 
              clubs={data.clubs} 
              events={data.events} 
              users={data.users} 
              registrations={data.registrations}
              applicants={data.applicants}
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="global-audit" element={
            <SystemLogs 
              logs={data.logs} 
              isDarkMode={isDarkMode}
            />
          } />
          <Route path="developers" element={<Developers mode="console" isDarkMode={isDarkMode} onBack={() => navigate('/dashboard')} />} />
        </Route>
      ) : (
        <Route path="/dashboard/*" element={<Navigate to="/auth" replace />} />
      )}

      {/* Protected Club Routes */}
      {currentUser ? (
        <Route path="/clubs/:clubId" element={
          <DashboardLayout 
            user={currentUser} 
            clubs={data.clubs} 
            isDarkMode={isDarkMode} 
            onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
            onLogout={handleLogout} 
          />
        }>
          <Route index element={<ClubHomeWrapper clubs={data.clubs} currentUser={currentUser} events={data.events} />} />
          <Route path="members" element={<ClubMembersWrapper clubs={data.clubs} currentUser={currentUser} allUsers={data.users} applicants={data.applicants} />} />
          <Route path="events" element={<EventOperationsWrapper clubs={data.clubs} currentUser={currentUser} events={data.events} registrations={data.registrations} />} />
          <Route path="finance" element={<ClubFinanceWrapper clubs={data.clubs} currentUser={currentUser} />} />
          <Route path="recruitment" element={<RecruitmentBoardWrapper clubs={data.clubs} currentUser={currentUser} applicants={data.applicants} />} />
          <Route path="certificates" element={<CertificationGovernanceWrapper clubs={data.clubs} currentUser={currentUser} />} />
          <Route path="site-editor" element={<ClubSiteEditorWrapper clubs={data.clubs} currentUser={currentUser} />} />
          <Route path="settings" element={<ClubSettingsWrapper clubs={data.clubs} currentUser={currentUser} />} />
          <Route path="attendance" element={<AttendanceControlWrapper clubs={data.clubs} currentUser={currentUser} events={data.events} registrations={data.registrations} />} />
          <Route path="chat" element={<ChatSystemWrapper clubs={data.clubs} currentUser={currentUser} />} />
        </Route>
      ) : (
        <Route path="/clubs/*" element={<Navigate to="/auth" replace />} />
      )}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// --- Wrapper Components to handle useParams and props ---

const ClubHomeWrapper = ({ clubs, currentUser, events }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  return <ClubHome club={club} currentUser={currentUser} events={events} />;
};

const ClubMembersWrapper = ({ clubs, currentUser, allUsers, applicants }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  
  const membership = currentUser?.clubMemberships.find((m: any) => m.clubId === clubId);
  const clubRole = membership ? membership.role : null;

  return (
    <ClubMembers 
      clubId={clubId}
      clubName={club.name}
      isDarkMode={false}
      clubRole={clubRole}
      allUsers={allUsers}
      onUpdateUser={async (user: User) => { await db.saveUser(user); }}
      applicants={applicants || []}
    />
  );
};

const EventOperationsWrapper = ({ clubs, currentUser, events, registrations }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;

  const clubEvents = events ? events.filter((e: Event) => e.clubId === clubId) : [];
  const clubRegistrations = registrations ? registrations.filter((r: Registration) => clubEvents.some((e: Event) => e.id === r.eventId)) : [];
  const isFaculty = currentUser?.globalRole === Role.FACULTY || currentUser?.id === club.facultyCoordinatorId;

  return (
    <EventOperations 
      events={clubEvents}
      registrations={clubRegistrations}
      onCreateEvent={async (evt: Event) => { await db.saveEvent(evt); }}
      onDeleteEvent={async (id: string) => { 
          // Implement delete if needed, or just pass empty for now
      }}
      onRegister={async (eventId: string, proxy?: any) => {
          if (proxy) {
              await db.saveRegistration({
                  id: `reg-${Date.now()}`,
                  eventId,
                  studentId: 'proxy',
                  studentName: proxy.name,
                  studentRoll: proxy.roll,
                  studentBranch: proxy.branch,
                  status: 'Approved',
                  paymentType: 'Free'
              });
          }
      }}
      onUpdateRegistration={async (reg: Registration) => { await db.saveRegistration(reg); }}
      isDarkMode={false}
      isDirectApprovalEnabled={isFaculty}
      clubId={clubId}
      isFaculty={isFaculty}
    />
  );
};

const ClubFinanceWrapper = ({ clubs, currentUser }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  return <ClubFinance club={club} currentUser={currentUser} />;
};

const RecruitmentBoardWrapper = ({ clubs, currentUser, applicants }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  
  if (!club) return <div>Club not found</div>;

  const clubApplicants = applicants ? applicants.filter((a: Applicant) => a.clubId === clubId) : [];
  
  const membership = currentUser?.clubMemberships.find((m: any) => m.clubId === clubId);
  const clubRole = membership ? membership.role : null;
  const isFaculty = currentUser?.globalRole === Role.FACULTY || currentUser?.id === club.facultyCoordinatorId;

  return (
    <RecruitmentBoard 
      applicants={clubApplicants}
      onMove={async (id: string, stage: Applicant['stage']) => {
         const app = clubApplicants.find((a: Applicant) => a.id === id);
         if (app) await db.saveApplicant({ ...app, stage });
      }}
      onUpdateDomain={async (id: string, domain: string) => {
         const app = clubApplicants.find((a: Applicant) => a.id === id);
         if (app) await db.saveApplicant({ ...app, domain });
      }}
      clubRole={clubRole}
      isFaculty={isFaculty}
      clubThemeColor={club.themeColor}
    />
  );
};

const CertificationGovernanceWrapper = ({ clubs, currentUser }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  return <CertificationGovernance club={club} currentUser={currentUser} />;
};

const ClubSiteEditorWrapper = ({ clubs, currentUser }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  return <ClubSiteEditor club={club} onSave={() => {}} />;
};

const ClubSettingsWrapper = ({ clubs, currentUser }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  return <ClubSettings club={club} onUpdate={() => {}} />;
};

const AttendanceControlWrapper = ({ clubs, currentUser, events, registrations }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;

  // Filter registrations for this club's events
  const clubEvents = events ? events.filter((e: Event) => e.clubId === clubId) : [];
  const clubRegistrations = registrations ? registrations.filter((r: Registration) => clubEvents.some((e: Event) => e.id === r.eventId)) : [];

  return (
    <AttendanceControl 
      registrations={clubRegistrations}
      onMark={async (id: string, status: boolean) => {
          const reg = clubRegistrations.find((r: Registration) => r.id === id);
          if (reg) {
              await db.saveRegistration({ ...reg, attendanceMarked: status });
              if (status && !reg.certificateId) {
                  // Auto-generate certificate
                  await db.generateCertificate(reg.id);
              }
          }
      }}
      onFinalize={() => { alert("Session finalized."); }}
      isDarkMode={false}
    />
  );
};

const ChatSystemWrapper = ({ clubs, currentUser }: any) => {
  const { clubId } = useParams();
  const club = clubs.find((c: any) => c.id === clubId);
  if (!club) return <div>Club not found</div>;
  return <ChatSystem currentUser={currentUser} activeClubId={clubId} />;
};

export default App;
