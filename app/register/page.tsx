import { registerAction } from '@/app/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md bg-[hsl(var(--card))] p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center mb-6 uppercase tracking-tighter text-glow">
          Create Account
        </h1>
        <form action={registerAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/80 text-white font-bold py-3 rounded-lg transition-all hover-glow border-glow mt-4"
          >
            Sign Up Now
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[hsl(var(--secondary))] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
