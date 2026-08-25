import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // On signup, Supabase may require email confirmation
        alert('Signup successful. Check your email to confirm the address if required.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Successful login triggers onAuth via auth state listener in App
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-white">Sign in to Rebo</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs text-slate-500">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full mt-1 p-2 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60" />
        </div>
        <div>
          <label className="text-xs text-slate-500">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full mt-1 p-2 rounded-md bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60" />
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md" disabled={loading} type="submit">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-sm text-indigo-600">{mode === 'login' ? 'Create account' : 'Have an account? Sign in'}</button>
          </div>
          <button type="button" onClick={async () => {
            if (!email) return alert('Enter your email to receive password reset link.');
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) alert(error.message); else alert('Password reset email sent.');
            setLoading(false);
          }} className="text-sm text-slate-500">Forgot?</button>
        </div>
      </form>
    </div>
  );
}
