import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Shield, AlertCircle, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = searchParams.get('redirect') || '';

  const sanitizeRedirect = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('/') && !path.startsWith('//') && !path.includes('://')) {
      return path;
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const success = await login(email);
      if (success) {
        // Find active role from auth store state
        const role = useAuthStore.getState().activeRole;
        const cleanRedirect = sanitizeRedirect(redirectPath);
        navigate(cleanRedirect || `/dashboard/${role}`);
      } else {
        setError('No matched account found in the pre-seeded lists. See help card below for pre-seeded emails.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const seedAccounts = [
    { role: 'Author Mode', email: 'yusuf.chen1@university.edu', desc: 'Manage submissions, view peer reviews, revise papers.' },
    { role: 'Reviewer Mode', email: 'reviewer.smith1@reviewers.org', desc: 'Accept invitations, write scores and comments.' },
    { role: 'Editor Mode', email: 'editor.novak1@auctores.org', desc: 'Assign papers, manage reviews, make decisions.' },
    { role: 'Admin Mode', email: 'admin@auctores.org', desc: 'Global stats, user roles management, cms.' }
  ];

  return (
    <div className="mx-auto max-w-md px-6 py-16 flex flex-col gap-6 font-sans">
      
      {/* Brand Icon & Heading */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-950 dark:text-white mt-2">
          Sign In to Auctores
        </h1>
        <p className="text-xs text-slate-400">
          Access your personalized scholarly workspace and dashboards
        </p>
      </div>

      <Card variant="default">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/80 rounded-lg text-rose-600 text-xs flex items-start gap-2 leading-relaxed">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Academic Email Address"
              placeholder="e.g. author@university.edu"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                disabled
                helperText="Simulated authentication. Password is not checked - any input is accepted."
              />
            </div>

            <Button variant="primary" type="submit" loading={loading} className="h-11 bg-primary text-white mt-2">
              Sign In to Workspace
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Do not have an account yet?{' '}
            <Link to="/register" className="text-[#8B0000] font-bold hover:underline">
              Join Auctores
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Pre-seeded seed accounts list help card */}
      <Card variant="flat" className="p-5 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mb-3 uppercase tracking-wider">
          <Shield className="h-4 w-4 text-[#8B0000]" /> Pre-seeded Demo Accounts
        </h4>
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-500">
          {seedAccounts.map((acc) => (
            <div 
              key={acc.role} 
              onClick={() => setEmail(acc.email)}
              className="p-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-lg hover:border-primary cursor-pointer transition-all flex flex-col gap-0.5"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">{acc.role}</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Click to fill</span>
              </div>
              <p className="font-mono text-[11px] text-primary">{acc.email}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{acc.desc}</p>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
};
