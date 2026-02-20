'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useWallets } from '@privy-io/react-auth/solana';
import { useCreateBusinessProfile } from '@/hooks/useBusinessData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const onboardingSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_type: z.string().min(2, 'Business type must be at least 2 characters'),
  registration_no: z.string().min(1, 'Registration number is required'),
  country: z.string().min(2, 'Please select a country'),
  business_email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function BusinessOnboardingPage() {
  const { user } = useAuth();
  const { wallets, ready: walletsReady } = useWallets();
  const { mutate: createProfile, isPending } = useCreateBusinessProfile();
  const router = useRouter();
  const { toast } = useToast();

  // Get the first Solana wallet (embedded wallet created on login)
  const solanaWallet = wallets[0];

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      business_name: '',
      business_type: '',
      registration_no: '',
      country: 'Nigeria',
      business_email: '',
      phone: '',
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    if (!user?.id || !user?.email?.address) {
      toast({
        title: 'Error',
        description: 'User authentication required. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    // Validate and format phone number for Nigeria
    let formattedPhone = data.phone || '';
    if (formattedPhone && data.country === 'Nigeria') {
      // Remove all non-digit characters except +
      const cleaned = formattedPhone.replace(/[^\d+]/g, '');

      // Check if it starts with +234
      if (!cleaned.startsWith('+234')) {
        toast({
          title: 'Invalid Phone Number',
          description: 'Nigerian phone numbers must start with +234',
          variant: 'destructive',
        });
        return;
      }

      // Extract digits after +234
      const digitsAfter234 = cleaned.substring(4);

      // Ensure no leading zero after +234
      if (digitsAfter234.startsWith('0')) {
        toast({
          title: 'Invalid Phone Number',
          description: 'Remove the leading 0 after +234. Format: +234XXXXXXXXX',
          variant: 'destructive',
        });
        return;
      }

      formattedPhone = cleaned;
    }

    // Match RN app payload structure for /api/save-kyc
    const profileData = {
      customer_type: 'business' as const,
      name: data.business_name, // Required field for INSERT operation
      business_name: data.business_name,
      business_type: data.business_type,
      registration_no: data.registration_no,
      phone_number: formattedPhone,
      country: data.country,
      email: user.email.address, // Privy authentication email
      business_email: data.business_email, // Business communication email
      wallet_address: solanaWallet?.address || '',
      privy_user_id: user.id,
      status: 'complete' as const,
    };

    createProfile(profileData, {
      onSuccess: async () => {
        toast({
          title: 'Success',
          description: 'Business profile created successfully',
        });
        // Wait a moment for the profile to be saved before redirecting
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push('/business/dashboard');
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create profile',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Business Profile</CardTitle>
          <CardDescription>
            Tell us about your business to get started with PayBridge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Business *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Auto Dealers, Food Company, Retail Store" {...field} />
                    </FormControl>
                    <FormDescription>
                      What type of business do you operate?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registration_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your business registration number"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Nigeria">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇳🇬</span> Nigeria
                          </span>
                        </SelectItem>
                        <SelectItem value="United States">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇺🇸</span> United States
                          </span>
                        </SelectItem>
                        <SelectItem value="United Kingdom">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇬🇧</span> United Kingdom
                          </span>
                        </SelectItem>
                        <SelectItem value="Canada">
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇨🇦</span> Canada
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="business@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be used for business communications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder={form.watch('country') === 'Nigeria' ? '+234 812 345 6789' : '+1 XXX XXX XXXX'}
                        {...field}
                      />
                    </FormControl>
                    {form.watch('country') === 'Nigeria' && (
                      <FormDescription>
                        Must start with +234 (no 0 after +234)
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-gray-600 text-center">
                By continuing, you agree to our{' '}
                <a href="https://paybridgefinance.com/terms" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="https://paybridgefinance.com/privacy" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full hover:opacity-90 !border-0 !outline-none !ring-0 focus:!ring-0 hover:!border-0"
                style={{ backgroundColor: isPending ? '#163300' : '#9FE870', color: isPending ? '#9FE870' : '#163300', border: 'none', outline: 'none' }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
