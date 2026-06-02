import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserCheck, AlertCircle, BookOpen } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent } from '../components/ui/Card';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [role, setRole] = useState<'author' | 'reviewer'>('author');
  const [orcid, setOrcid] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !affiliation) return;

    setLoading(true);
    setError('');

    try {
      const success = await register({
        name,
        email,
        affiliation,
        role,
        orcid: role === 'author' ? orcid : undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });

      if (success) {
        navigate(`/dashboard/${role}`);
      } else {
        setError('Failed to create account. Email address may already exist.');
      }
    } catch (err) {
      setError('An error occurred during account registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-6 py-12 flex flex-col gap-6 font-sans">
      
      {/* Header Info */}
      <div className="text-center flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-md">
          <BookOpen className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-950 dark:text-white mt-2">
          Create Auctores Profile
        </h1>
        <p className="text-xs text-slate-400">
          Join our global network of researchers, reviewers, and scientific leaders
        </p>
      </div>

      <Card variant="default">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-800/85 rounded-lg text-rose-600 text-xs flex items-start gap-2 leading-relaxed">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Scientific Name"
                placeholder="Dr. Aria Chen"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                required
              />
              
              <Input
                label="Academic Email"
                type="email"
                placeholder="aria.chen@university.edu"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
              />
            </div>

            <Input
              label="Primary Affiliation / University"
              placeholder="e.g. Stanford University, CA, USA"
              value={affiliation}
              onChange={(e: any) => setAffiliation(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Primary Workspace Role"
                options={[
                  { value: 'author', label: 'Author (Submit & Revise Papers)' },
                  { value: 'reviewer', label: 'Peer Reviewer (Critique Papers)' }
                ]}
                value={role}
                onChange={(e: any) => setRole(e.target.value as any)}
              />

              {/* Conditional ORCID field for authors */}
              {role === 'author' && (
                <Input
                  label="ORCID iD (Optional)"
                  placeholder="0000-0002-1234-5678"
                  value={orcid}
                  onChange={(e: any) => setOrcid(e.target.value)}
                  helperText="Unique author identification profile"
                />
              )}
            </div>

            <div className="flex flex-col gap-1 mt-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                disabled
                helperText="Simulated registration. Any password is automatically saved."
              />
            </div>

            <Button variant="primary" type="submit" loading={loading} className="h-11 bg-primary text-white mt-4">
              <UserCheck className="h-4 w-4 mr-2" /> Complete Scholar Registration
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Already have an active profile?{' '}
            <Link to="/login" className="text-[#8B0000] font-bold hover:underline">
              Sign In Instead
            </Link>
          </p>
        </CardContent>
      </Card>

    </div>
  );
};
