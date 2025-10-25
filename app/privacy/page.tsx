"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-e-ukraine-Medium tracking-tighter mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground font-e-ukraine-Light text-lg">
              25th October 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="cosmic-card p-8 rounded-lg">
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-6">
                PayBridge, Inc. (&quot;PayBridge,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and share your information when you use our website, mobile application, and related services (the &quot;Services&quot;).
              </p>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                By using PayBridge, you agree to the practices described in this Privacy Policy.
              </p>
            </div>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                1. Information We Collect
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                We collect the following types of information:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-e-ukraine-Regular tracking-tighter mb-3">
                    a. Personal Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                    <li>Name, email address, phone number</li>
                    <li>Date of birth, government-issued ID (collected via our KYC provider, Persona)</li>
                    <li>Residential address</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-e-ukraine-Regular tracking-tighter mb-3">
                    b. Financial Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                    <li>Wallet addresses and transaction history</li>
                    <li>Bank account details when using fiat ramps (via partners)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-e-ukraine-Regular tracking-tighter mb-3">
                    c. Technical Information
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                    <li>Device information, IP address, and log data</li>
                    <li>Cookies and similar technologies (when applicable)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                2. How We Use Your Information
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                We use your information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>Provide and operate the PayBridge Services</li>
                <li>Verify your identity and comply with legal requirements (KYC/AML)</li>
                <li>Process payments and facilitate transfers</li>
                <li>Detect and prevent fraud or unauthorised activity</li>
                <li>Improve and personalise the Services</li>
                <li>Communicate with you about your account and updates</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                3. How We Share Your Information
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light mb-4">
                <li><strong>Service Providers:</strong> e.g., Persona (identity verification), fiat to USDC conversions, and cloud hosting providers.</li>
                <li><strong>Regulatory and Legal Authorities:</strong> when required to comply with applicable laws, regulations, or legal processes.</li>
                <li><strong>Business Transfers:</strong> if PayBridge undergoes a merger, acquisition, or sale of assets.</li>
              </ul>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                4. Data Retention
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                We retain your personal information for as long as necessary to provide our Services, comply with legal obligations, resolve disputes, and enforce agreements.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                5. Data Security
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                We implement reasonable technical and organisational measures to protect your data from unauthorised access, loss, misuse, or disclosure. However, no system is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                6. Your Rights
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light mb-4">
                <li>Access the personal data we hold about you</li>
                <li>Request corrections or updates</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt out of certain uses of your data</li>
              </ul>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                To exercise these rights, contact us at support@paybridgefinance.com.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                7. International Data Transfers
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                Your information may be transferred to and processed in the United States or other countries where our service providers are located. By using PayBridge, you consent to such transfers.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                8. Updates to This Privacy Policy
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                We reserve the right to update this Privacy Policy from time to time. Changes will be posted on our website and app, with the &quot;Last Updated&quot; date adjusted. Continued use of our Services after updates indicates acceptance of the revised policy.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
