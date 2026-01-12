"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-e-ukraine-Medium tracking-tighter mb-4">
              Support
            </h1>
            <p className="text-muted-foreground font-e-ukraine-Light text-lg">
              Need help with your PayBridge account or have questions about the app? 
              Our team is here to help.
            </p>
          </div>

          <div className="cosmic-card p-8 rounded-lg space-y-6">
            <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
              You can contact PayBridge support anytime via email. We aim to respond as quickly as possible.
            </p>

            <div className="space-y-2">
              <p className="text-sm uppercase tracking-wide text-muted-foreground font-e-ukraine-Light">
                Email
              </p>
              <a
                href="mailto:support@paybridgefinance.com"
                className="text-lg font-e-ukraine-Regular text-primary hover:underline break-all"
              >
                support@paybridgefinance.com
              </a>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="mailto:support@paybridgefinance.com">
                  Email Support
                </a>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground font-e-ukraine-Light">
              When you contact us, please include the email address linked to your PayBridge account 
              and a brief description of your issue so we can assist you faster.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
