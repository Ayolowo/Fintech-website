import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-e-ukraine-Medium tracking-tighter mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground font-e-ukraine-Light text-lg">
              16th June 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div className="cosmic-card p-8 rounded-lg">
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                These Terms of Service ("Terms") govern your access to and use of PayBridge's mobile application, website, and related services (collectively, the "Services"). By creating an account or using our Services, you agree to be bound by these Terms.
              </p>
            </div>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                1. Company Information
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                PayBridge Inc. ("PayBridge," "we," "us," or "our") is a company incorporated in the State of Delaware, United States.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                2. Eligibility
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>You must complete identity verification (KYC) through our third-party provider (Persona) before accessing certain features.</li>
                <li>By using PayBridge, you confirm that you are not subject to any trade sanctions, restrictions, or laws that prohibit your use of our Services.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                3. Accounts and Security
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>You are responsible for safeguarding your PayBridge account, login credentials, and devices.</li>
                <li>You must notify us immediately if you suspect unauthorised access or activity.</li>
                <li>We may suspend or terminate accounts if we suspect fraud, illegal activity, or violations of these Terms.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                4. Our Services
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                PayBridge provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light mb-4">
                <li><strong>Digital Wallet Services:</strong> Sending, receiving, and storing supported stablecoins (e.g., USDC, EURC) on the Solana blockchain.</li>
                <li><strong>Fiat Ramps:</strong> Where available, you may convert between fiat currency (e.g., Canadian Dollars) and digital assets.</li>
                <li><strong>User Tools:</strong> PayTags and wallet management features for easier transfers.</li>
              </ul>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                We may add or remove features at any time.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                5. Fees
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>Currently, PayBridge does not charge user fees for sending or receiving digital assets.</li>
                <li>Third-party providers (e.g., exchanges, banks) may apply their own fees.</li>
                <li>If PayBridge introduces fees, we will notify users in advance.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                6. Prohibited Activities
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                You may not use PayBridge to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>Violate any laws, regulations, or sanctions.</li>
                <li>Engage in fraud, scams, money laundering, or terrorist financing.</li>
                <li>Interfere with or disrupt the security of our Services.</li>
                <li>Use PayBridge in any way that could harm us, our partners, or other users.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                7. Compliance and Verification
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>We work with third parties like Persona (for KYC) and YellowCard (for fiat ramps). By using our Services, you agree that your information may be shared with them as necessary.</li>
                <li>You must provide accurate and truthful information during registration and verification.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                8. Termination and Suspension
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>We may suspend or terminate your account at any time for violation of these Terms, suspected fraud, or unlawful activity.</li>
                <li>You may close your account at any time by contacting us.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                9. Disclaimers
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>PayBridge provides its Services "as is" and "as available," without warranties of any kind.</li>
                <li>We do not guarantee uninterrupted, error-free, or risk-free Services.</li>
                <li>Digital assets involve risks, including potential loss of value. You are solely responsible for your financial decisions.</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                10. Limitation of Liability
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground font-e-ukraine-Light">
                <li>PayBridge shall not be liable for indirect, incidental, or consequential damages.</li>
                <li>Our total liability to you for any claims shall not exceed the amount you paid to use the Services in the past 12 months (if any).</li>
              </ul>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                11. Governing Law and Dispute Resolution
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                These Terms shall be governed by and construed following the laws of the State of Delaware, United States, without regard to its conflict of laws principles. Any disputes arising out of or relating to these Terms shall first be attempted to be resolved informally by contacting PayBridge. If not resolved, disputes may be brought in the state or federal courts located in Delaware, unless otherwise required by applicable law.
              </p>
            </section>

            <section className="cosmic-card p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-e-ukraine-Regular tracking-tighter mb-6">
                12. Changes to These Terms
              </h2>
              <p className="text-foreground font-e-ukraine-Light leading-relaxed text-lg">
                We may update these Terms from time to time. We will notify you by updating the "Last Updated" date above or by other means. Continued use of our Services after changes take effect constitutes acceptance of the new Terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;