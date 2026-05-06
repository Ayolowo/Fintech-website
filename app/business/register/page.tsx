'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginWithEmail, useLoginWithOAuth } from '@privy-io/react-auth';
import { useWallets, useCreateWallet } from '@privy-io/react-auth/solana';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessProfile } from '@/hooks/useBusinessData';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/assets/light-logo';
import Image from 'next/image';
import borders from '@/assets/login/borders.jpeg';
import { ArrowLeft } from 'lucide-react';

const features = [
  'Secure transfers',
  'End-to-end encrypted',
  '140+ countries supported',
];

export default function BusinessRegisterPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [walletCreationAttempted, setWalletCreationAttempted] = useState(false);

  const { sendCode, loginWithCode, state } = useLoginWithEmail();
  const { initOAuth } = useLoginWithOAuth();
  const { authenticated, ready } = useAuth();
  const { wallets, ready: walletsReady } = useWallets();
  const { createWallet } = useCreateWallet();
  const router = useRouter();

  const { data: profile, isLoading: profileLoading } = useBusinessProfile(
    authenticated && ready
  );

  useEffect(() => {
    async function ensureWallet() {
      if (ready && authenticated && walletsReady && wallets.length === 0 && !walletCreationAttempted) {
        setWalletCreationAttempted(true);
        try {
          await createWallet();
        } catch (error) {
          if (error instanceof Error && error.message.includes('already has an embedded wallet')) return;
          console.error('Failed to create wallet:', error);
        }
      }
    }
    ensureWallet();
  }, [ready, authenticated, walletsReady, wallets.length, walletCreationAttempted, createWallet]);

  useEffect(() => {
    if (ready && authenticated && walletsReady && (wallets.length > 0 || walletCreationAttempted)) {
      if (profileLoading) return;
      router.push(profile ? '/business/dashboard' : '/business/onboarding');
    }
  }, [authenticated, ready, walletsReady, wallets.length, walletCreationAttempted, profile, profileLoading, router]);

  const handleSendCode = async () => {
    setError('');
    setSendingCode(true);
    try { await sendCode({ email }); setCodeSent(true); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to send code'); }
    finally { setSendingCode(false); }
  };

  const handleRegisterWithCode = async () => {
    setError('');
    try { await loginWithCode({ code }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to register'); }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try { initOAuth({ provider: 'google' }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Failed to register with Google'); }
  };

  const isLoading = sendingCode || state.status === 'sending-code' || state.status === 'submitting-code';
  const isAwaitingCode = codeSent || state.status === 'awaiting-code-input' || state.status === 'submitting-code';

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#faf9f9' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#083400' }} />
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3" style={{ backgroundColor: '#faf9f9' }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#083400' }} />
        <p className="text-sm text-gray-500">Setting up your account...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative" style={{ backgroundColor: '#faf9f9' }}>
      <Link href="/business" className="absolute top-6 left-6 flex items-center gap-2 text-base font-semibold text-black transition-opacity hover:opacity-70">
        <ArrowLeft className="w-5 h-5" />
        Back
      </Link>
      <div className="flex w-full max-w-5xl min-h-[680px] rounded-3xl overflow-hidden shadow-lg">

        {/* Left — image panel */}
        <div className="hidden md:flex flex-col justify-between w-[42%] shrink-0 p-14 relative overflow-hidden" style={{ backgroundColor: '#0d1f0d' }}>
          <Image src={borders} alt="" fill className="object-cover object-center" />
          <div className="absolute inset-0" />
          <div className="relative z-10">
            <h1 className="text-4xl font-black text-white leading-tight">
              Money without <span style={{ color: '#9FE870' }}>borders.</span>
            </h1>
          </div>
          <ul className="relative z-10 flex flex-col gap-4">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-base text-white -mt-1.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full shrink-0" style={{ backgroundColor: 'rgba(120, 236, 48, 0.2)' }}>
                  <Check className="w-3 h-3" style={{ color: '#62ff00' }} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — white form panel */}
        <div className="flex-1 bg-white p-14 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-10">
            <Logo />
            <span className="text-xl font-extrabold" style={{ color: '#163300' }}>PayBridge</span>
          </div>

          <h2 className="text-3xl font-black text-black mb-2">Create an account</h2>
          <p className="text-base text-gray-800 mb-8">Get started with PayBridge for your business.</p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isAwaitingCode ? (
            <>
              <div className="mb-4">
                <label className="block text-base font-medium text-black mb-2">Business email</label>
                <input
                  type="email"
                  placeholder="business@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && email && handleSendCode()}
                  className="w-full px-4 py-4 rounded-xl border border-black/10 text-base outline-none focus:border-[#9FE870] focus:ring-1 focus:ring-[#9FE870] transition-all bg-white"
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={!email || isLoading}
                className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
                style={{ backgroundColor: '#9FE870', color: '#083400' }}
              >
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Sending code...</> : 'Create account'}
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-black/8" />
                <span className="text-lg text-gray-800">or</span>
                <div className="flex-1 h-px bg-black/8" />
              </div>

              <button
                onClick={handleGoogleRegister}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-medium text-base border border-black/10 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-base font-medium text-black mb-2">Verification code</label>
                <input
                  type="text"
                  placeholder="Enter code from your email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  onKeyDown={(e) => e.key === 'Enter' && code && handleRegisterWithCode()}
                  className="w-full px-4 py-4 rounded-xl border border-black/10 text-base outline-none focus:border-[#9FE870] focus:ring-1 focus:ring-[#9FE870] transition-all bg-white"
                />
                <p className="text-xs text-gray-400 mt-1.5">Code sent to {email}</p>
              </div>

              <button
                onClick={handleRegisterWithCode}
                disabled={!code || isLoading}
                className="w-full py-4 rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                style={{ backgroundColor: '#9FE870', color: '#083400' }}
              >
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" />Creating account...</> : 'Create account'}
              </button>

              <button
                onClick={() => { setCode(''); setEmail(''); setError(''); setCodeSent(false); }}
                className="w-full py-4 rounded-xl font-medium text-base border border-black/10 hover:bg-gray-50 transition-all"
                style={{ color: '#163300' }}
              >
                Use a different email
              </button>
            </>
          )}

          <p className="text-center text-base text-gray-800 mt-8">
            Already have an account?{' '}
            <Link href="/business/login" className="font-semibold underline underline-offset-2" style={{ color: '#083400' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
