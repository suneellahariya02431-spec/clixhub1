import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../../db';
import { Loader2, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'recovery'>('loading');
  const [message, setMessage] = useState('Verifying your session...');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Simulate verification delay
    const verify = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      processSession();
    };
    verify();
  }, []);

  const processSession = () => {
    const type = searchParams.get('type');
    
    if (type === 'recovery') {
      setStatus('recovery');
      setMessage('Please set a new password.');
    } else if (type === 'magiclink') {
      setStatus('success');
      setMessage('Magic link verified! Redirecting...');
      // Simulate login
      localStorage.setItem('authToken', 'mock-magic-token');
      setTimeout(() => navigate('/dashboard'), 2000);
    } else {
      // Default (e.g. email confirmation)
      setStatus('success');
      setMessage('Email verified! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus('loading');
      setMessage('Updating password...');
      await db.updatePassword(newPassword);
      setStatus('success');
      setMessage('Password updated successfully! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h2 className="text-xl font-bold text-slate-800">Verifying...</h2>
            <p className="text-slate-500">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Success!</h2>
            <p className="text-slate-500">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Verification Failed</h2>
            <p className="text-slate-500">{message}</p>
            <button 
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'recovery' && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <Lock size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Reset Password</h2>
            <p className="text-slate-500 mb-4">{message}</p>
            
            <form onSubmit={handlePasswordUpdate} className="w-full space-y-4">
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-blue-500 transition-all"
                required
                minLength={6}
              />
              <button 
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
              >
                Update Password
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthCallback;
