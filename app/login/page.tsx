import { loginAction } from '@/app/actions/auth';
import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 fade-up">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #60A5FA)' }}>
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.03em' }}>Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to your Mythic Games account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <form action={loginAction} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <input type="email" name="email" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all focus:border-[#7C3AED] placeholder-[var(--text-muted)]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input type="password" name="password" required
                className="w-full px-4 py-3 rounded-xl text-sm text-white font-medium outline-none transition-all focus:border-[#7C3AED] placeholder-[var(--text-muted)]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                placeholder="••••••••" />
            </div>

            <button type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all btn-glow mt-2"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' }}>
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold transition-colors hover:text-white" style={{ color: '#9D68FF' }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="rounded-xl p-4 text-xs text-center" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', color: 'var(--text-muted)' }}>
          <strong style={{ color: '#9D68FF' }}>Admin:</strong> admin@mythicgames.com / adminpassword
        </div>
      </div>
    </div>
  );
}
