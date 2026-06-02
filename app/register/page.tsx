import { registerAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 fade-up">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #60A5FA)' }}>
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>Create account</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Join Mythic Games and start your collection</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <form action={registerAction} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input type="text" name="name" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all placeholder-[var(--text-muted)]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input type="email" name="email" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all placeholder-[var(--text-muted)]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input type="password" name="password" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all placeholder-[var(--text-muted)]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="••••••••" />
            </div>

            <button type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all btn-glow mt-2"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              Create Account
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold transition-colors hover:text-white" style={{ color: '#9D68FF' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
