'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginWithEmail, useLoginWithOAuth } from '@privy-io/react-auth';
import { useWallets, useCreateWallet } from '@privy-io/react-auth/solana';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessProfile } from '@/hooks/useBusinessData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function BusinessRegisterPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const { sendCode, loginWithCode, state } = useLoginWithEmail();
  const { initOAuth } = useLoginWithOAuth();
  const { authenticated, ready } = useAuth();
  const { wallets, ready: walletsReady } = useWallets();
  const { createWallet } = useCreateWallet();
  const router = useRouter();

  // Only fetch profile after authentication - enabled conditionally
  const { data: profile, isLoading: profileLoading } = useBusinessProfile(
    authenticated && ready // Only fetch when authenticated
  );

  // Create wallet after authentication if user doesn't have one (only once)
  const [walletCreationAttempted, setWalletCreationAttempted] = useState(false);

  useEffect(() => {
    async function ensureWallet() {
      if (ready && authenticated && walletsReady && wallets.length === 0 && !walletCreationAttempted) {
        setWalletCreationAttempted(true);
        try {
          await createWallet();
        } catch (error) {
          // Ignore error if wallet already exists
          if (error instanceof Error && error.message.includes('already has an embedded wallet')) {
            console.log('Wallet already exists, continuing...');
            // Force re-check of wallets
            return;
          }
          console.error('Failed to create wallet:', error);
        }
      }
    }
    ensureWallet();
  }, [ready, authenticated, walletsReady, wallets.length, walletCreationAttempted, createWallet]);

  useEffect(() => {
    // Only redirect when user is authenticated and wallets are ready
    // If no wallet after creation attempt, still proceed (wallet might exist but not loaded yet)
    if (ready && authenticated && walletsReady && (wallets.length > 0 || walletCreationAttempted)) {
      // If still loading profile, wait
      if (profileLoading) return;

      if (profile) {
        // User already has a profile, go to dashboard
        router.push('/business/dashboard');
      } else {
        // New user, go to onboarding
        router.push('/business/onboarding');
      }
    }
  }, [authenticated, ready, walletsReady, wallets.length, walletCreationAttempted, profile, profileLoading, router]);

  const handleSendCode = async () => {
    setError('');
    setSendingCode(true);
    try {
      await sendCode({ email });
      setCodeSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegisterWithCode = async () => {
    setError('');
    try {
      await loginWithCode({ code });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      initOAuth({ provider: 'google' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register with Google');
    }
  };

  const isLoading = sendingCode || state.status === 'sending-code' || state.status === 'submitting-code';
  const isAwaitingCode = codeSent || state.status === 'awaiting-code-input' || state.status === 'submitting-code';

  // Show loading while Privy is initializing
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show loading when authenticated and waiting for wallet creation or checking profile
  // OR when ready but not showing the form (happens during OAuth callback)
  if (authenticated || (ready && !isAwaitingCode && state.status === 'initial')) {
    if (authenticated && (!walletsReady || wallets.length === 0 || profileLoading)) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Setting up your account...</p>
        </div>
      );
    }
    // If authenticated but wallet is ready and profile loaded, the useEffect will redirect
    // Don't show form in this state
    if (authenticated) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-600">Setting up your account...</p>
        </div>
      );
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Business Account</CardTitle>
          <CardDescription>
            Get started with PayBridge for your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isAwaitingCode ? (
            <>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Business Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleSendCode}
                disabled={!email || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="code" className="text-sm font-medium">
                  Verification Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter code from email"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleRegisterWithCode}
                disabled={!code || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setCode('');
                  setError('');
                  setCodeSent(false);
                }}
                className="w-full"
              >
                Use Different Email
              </Button>
            </>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleRegister}
            disabled={isLoading}
            className="w-full"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/business/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
