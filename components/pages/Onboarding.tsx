import React, { useState, useEffect } from 'react';
import { Role, User } from '../../types';
import { db } from '../../db';
import Footer from '../Footer';
import { 
  ShieldCheck, 
  GraduationCap, 
  Lock,
  ArrowLeft,
  Mail,
  Key,
  User as UserIcon,
  Loader2,
  ShieldAlert,
  Globe,
  Fingerprint,
  Zap,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react';

interface Props {
  onSelectRole: (user: User) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDeveloper?: () => void;
  onOpenProfile?: () => void;
  onNavigate?: (page: string) => void;
}

type OnboardingStep = 'role' | 'auth';

const Onboarding: React.FC<Props> = ({ onSelectRole, isDarkMode, onToggleTheme, onOpenDeveloper, onOpenProfile, onNavigate }) => {
  const [step, setStep] = useState<OnboardingStep>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'password' | 'magicLink' | 'forgotPassword'>('password');
  
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    enrollment: '',
    branch: ''
  });

  const branches = [
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Electronics Engineering",
    "Chemical Engineering",
    "Computer Science & Engineering",
    "Information Technology",
    "Electronics & Telecommunication Engineering",
    "Automobile Engineering",
    "Artificial Intelligence",
    "Artificial Intelligence & Data Science",
    "Artificial Intelligence & Machine Learning",
    "Computer Science & Design",
    "Computer Science & Business Systems",
    "Internet of Things",
    "Mathematics & Computing",
    "IT (AI & Robotics)",
    "Electrical Engineering (IoT)",
    "Computer Science & Technology"
  ];

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
        try {
            // This would be a call to db.checkSession() if implemented, 
            // or we rely on App.tsx to handle initial auth state.
            // For now, we do nothing here as App.tsx handles the initial user load.
        } catch (e) {
            console.error(e);
        }
    };
    checkSession();
  }, []);

  const roles = [
    {
      role: Role.STUDENT,
      title: 'Student',
      description: 'Access events, clubs, and portfolio.',
      icon: GraduationCap,
    },
    {
      role: Role.FACULTY,
      title: 'Faculty',
      description: 'Manage approvals and oversight.',
      icon: ShieldCheck,
    },
    {
      role: Role.SUPER_ADMIN,
      title: 'Admin',
      description: 'System configuration and logs.',
      icon: Lock,
    }
  ];

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsSignUp(true);
    setStep('auth');
    setErrorMsg(null);
  };

  const handleGoToLogin = () => {
    setSelectedRole(null);
    setIsSignUp(false);
    setStep('auth');
    setErrorMsg(null);
  };

  const handleGoogleLogin = async () => {
    alert("Institutional SSO (Google) is currently under maintenance. Please use manual entry.");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (authMode === 'magicLink') {
        await db.sendMagicLink(authData.email);
        setSuccessMsg('Magic link sent! Check your email.');
        return;
      }

      if (authMode === 'forgotPassword') {
        await db.resetPasswordForEmail(authData.email);
        setSuccessMsg('Password reset link sent! Check your email.');
        return;
      }

      let result;
      if (isSignUp) {
        result = await db.register({
            email: authData.email,
            password: authData.password,
            name: authData.name,
            globalRole: selectedRole || Role.STUDENT,
            enrollmentNumber: authData.enrollment,
            branch: authData.branch
        });
      } else {
        result = await db.login(authData.email, authData.password);
      }

      onSelectRole(result.user);

    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('Registration successful')) {
          setSuccessMsg(err.message);
          setIsSignUp(false); // Switch to login view
          setStep('auth');
      } else {
          setErrorMsg(err.message || "Authentication Failed.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Theme Toggle */}
      <button
        onClick={onToggleTheme}
        className={`fixed top-6 right-6 z-50 p-2.5 rounded-full transition-all ${isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Left Panel - Branding */}
      <div className={`hidden lg:flex w-1/2 relative flex-col justify-between p-16 border-r ${isDarkMode ? 'border-white/5 bg-[#09090b]' : 'border-slate-100 bg-slate-50/50'}`}>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
                    <Zap size={16} fill="currentColor" />
                </div>
                <span className="text-lg font-bold tracking-tight">CLIX</span>
            </div>
            
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
                The Operating System <br />
                <span className="text-slate-400">for Campus Life.</span>
            </h1>
            <p className={`text-lg max-w-md leading-relaxed ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Seamlessly manage your academic journey, club activities, and institutional credentials in one secure environment.
            </p>
        </div>

        <div className="relative z-10">
            <div className="flex gap-8">
                <div>
                    <p className="text-3xl font-bold">40+</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Active Clubs</p>
                </div>
                <div>
                    <p className="text-3xl font-bold">10k+</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">Students</p>
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel - Auth */}
      <div className={`w-full lg:w-1/2 h-full flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto ${isDarkMode ? 'bg-[#09090b]' : 'bg-white'}`}>
        <div className="w-full max-w-sm space-y-8">
            
            {/* Header */}
            <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {step === 'role' ? 'Welcome to CLIX' : (isSignUp ? 'Create Account' : 'Welcome Back')}
                </h2>
                <p className="text-sm text-slate-500">
                    {step === 'role' ? 'Choose your portal to get started.' : (isSignUp ? 'Enter your details to register.' : 'Sign in to your account.')}
                </p>
            </div>

            {step === 'role' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid gap-4">
                        {roles.map((r) => (
                            <button
                                key={r.role}
                                onClick={() => handleRoleSelect(r.role)}
                                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:border-black/20 hover:bg-slate-50 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200'}`}
                            >
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
                                    <r.icon size={20} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{r.title}</h3>
                                    <p className="text-xs text-slate-500">{r.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="pt-4 text-center">
                        <button 
                            onClick={handleGoToLogin}
                            className="text-sm font-medium text-slate-500 hover:text-black transition-colors"
                        >
                            Already have an account? <span className="text-blue-600">Sign in</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                        onClick={() => setStep('role')} 
                        className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft size={14} /> Back
                    </button>

                    {successMsg && (
                        <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium flex items-center gap-2 border border-emerald-100">
                            <CheckCircle2 size={14} />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium flex items-center gap-2 border border-rose-100">
                            <ShieldAlert size={14} />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                        {authMode === 'password' && isSignUp && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-500">Full Name</label>
                                    <input 
                                        required
                                        type="text"
                                        value={authData.name}
                                        onChange={e => setAuthData({...authData, name: e.target.value})}
                                        className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-black transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200'}`}
                                        placeholder="John Doe"
                                    />
                                </div>

                                {(selectedRole === Role.STUDENT || selectedRole === Role.FACULTY) && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Branch / Department</label>
                                        <select
                                            required
                                            value={authData.branch}
                                            onChange={e => setAuthData({...authData, branch: e.target.value})}
                                            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-black transition-all appearance-none ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200'}`}
                                        >
                                            <option value="" disabled>Select Branch</option>
                                            {branches.map(b => (
                                                <option key={b} value={b} className={isDarkMode ? 'bg-[#09090b]' : 'bg-white'}>{b}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {selectedRole === Role.STUDENT && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Enrollment Number</label>
                                        <input 
                                            required
                                            type="text"
                                            value={authData.enrollment}
                                            onChange={e => setAuthData({...authData, enrollment: e.target.value})}
                                            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-black transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200'}`}
                                            placeholder="0901..."
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Email Address</label>
                            <input 
                                required
                                type="email"
                                value={authData.email}
                                onChange={e => setAuthData({...authData, email: e.target.value})}
                                className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-black transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200'}`}
                                placeholder="name@example.com"
                            />
                        </div>

                        {authMode === 'password' && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-slate-500">Password</label>
                                    {!isSignUp && (
                                        <button 
                                            type="button"
                                            onClick={() => { setAuthMode('forgotPassword'); setErrorMsg(null); setSuccessMsg(null); }}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <input 
                                    required
                                    type="password"
                                    value={authData.password}
                                    onChange={e => setAuthData({...authData, password: e.target.value})}
                                    className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none focus:border-black transition-all ${isDarkMode ? 'bg-white/5 border-white/10 focus:border-white' : 'bg-white border-slate-200'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button 
                            disabled={isSubmitting}
                            className="w-full py-2.5 bg-black text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (
                                authMode === 'magicLink' ? 'Send Magic Link' :
                                authMode === 'forgotPassword' ? 'Send Reset Link' :
                                (isSignUp ? 'Create Account' : 'Sign In')
                            )}
                        </button>

                        {authMode !== 'password' && (
                            <button 
                                type="button"
                                onClick={() => { setAuthMode('password'); setErrorMsg(null); setSuccessMsg(null); }}
                                className="w-full py-2 text-xs font-medium text-slate-500 hover:text-black transition-colors"
                            >
                                Back to Password Login
                            </button>
                        )}
                    </form>

                    {authMode === 'password' && (
                        <>
                            <div className="relative text-center">
                                <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDarkMode ? 'border-white/10' : 'border-slate-100'}`}></div></div>
                                <span className={`relative px-2 text-xs text-slate-400 ${isDarkMode ? 'bg-[#09090b]' : 'bg-white'}`}>Or continue with</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={handleGoogleLogin}
                                    disabled={isSubmitting}
                                    className={`w-full py-2.5 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-slate-50 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200'}`}
                                >
                                    <Globe size={16} /> Google
                                </button>
                                <button 
                                    onClick={() => { setAuthMode('magicLink'); setErrorMsg(null); setSuccessMsg(null); }}
                                    disabled={isSubmitting}
                                    className={`w-full py-2.5 rounded-lg border font-medium text-sm flex items-center justify-center gap-2 transition-all hover:bg-slate-50 ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-slate-200'}`}
                                >
                                    <Mail size={16} /> Magic Link
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <button 
                                    onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); setSuccessMsg(null); }}
                                    className="text-xs font-medium text-slate-500 hover:text-black transition-colors"
                                >
                                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
