import { useState, type FormEvent } from 'react';
import { AlertCircle, GraduationCap, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Mode = 'sign-in' | 'sign-up';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resetFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const handleEmailAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    if (password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'sign-up') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage('Check your email to confirm your account, then return here to sign in.');
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    resetFeedback();
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl flex flex-col lg:flex-row">
        <section className="flex-1 bg-indigo-600 text-white p-8 sm:p-12 flex flex-col justify-between gap-12">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2.5"><GraduationCap className="h-7 w-7" /></div>
            <div><p className="font-display text-xl font-bold">rebo</p><p className="text-sm text-indigo-100">AI-powered scholarly advisor</p></div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-indigo-100">Your research, organized</p>
            <h1 className="font-display text-4xl font-bold leading-tight text-balance sm:text-5xl">Turn complex data into confident academic decisions.</h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-indigo-100">Securely return to your projects, synthesize evidence, and continue your research from one focused workspace.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-indigo-100"><ShieldCheck className="h-5 w-5" /><span>Authentication securely managed by Supabase</span></div>
        </section>

        <section className="flex-1 p-7 sm:p-12" aria-labelledby="auth-heading">
          <div className="mx-auto max-w-md">
            <h2 id="auth-heading" className="font-display text-3xl font-bold text-slate-900 dark:text-slate-100">{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{mode === 'sign-in' ? 'Sign in to continue to your research workspace.' : 'Start organizing and analyzing your research.'}</p>

            <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="mt-8 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 transition hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer">
              <span className="font-bold text-indigo-600">G</span> Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /><span className="text-xs uppercase tracking-wider text-slate-400">or use email</span><div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /></div>

            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 focus-within:ring-2 focus-within:ring-indigo-500"><Mail className="h-4 w-4 text-slate-400" /><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent py-3 text-sm outline-none text-slate-900 dark:text-slate-100" placeholder="you@university.edu" /></div>
              </label>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password
                <input type="password" required minLength={8} autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-3 text-sm outline-none text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500" placeholder="At least 8 characters" />
              </label>

              {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
              {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

              <button type="submit" disabled={loading} className="mt-1 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">{loading && <LoaderCircle className="h-4 w-4 animate-spin" />}{mode === 'sign-in' ? 'Sign in' : 'Create account'}</button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{mode === 'sign-in' ? 'New to rebo?' : 'Already have an account?'}{' '}<button type="button" onClick={() => { setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in'); resetFeedback(); }} className="font-semibold text-indigo-600 hover:underline cursor-pointer">{mode === 'sign-in' ? 'Create an account' : 'Sign in'}</button></p>
          </div>
        </section>
      </div>
    </main>
  );
}
