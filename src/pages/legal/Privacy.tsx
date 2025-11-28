import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                Welcome to our AI-powered Trading Journal platform ("we," "us," or "our"). This Privacy Policy explains 
                how we collect, use, store, and protect your personal information when you use our web-based trading 
                journal service. We are committed to protecting your privacy and handling your data transparently and 
                securely.
              </p>
              <p>
                By using our platform, you consent to the data practices described in this policy. If you do not agree 
                with our practices, please discontinue use of our services immediately.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Information We Collect</h2>
              
              <h3 className="text-lg font-semibold mt-4">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password, phone number (optional)</li>
                <li><strong>Trading Data:</strong> Trade entries (symbol, entry/exit prices, dates, quantities, P&L, notes)</li>
                <li><strong>Performance Data:</strong> Win rate, strategy performance, risk/reward ratios, analytics</li>
                <li><strong>Screenshots & Documents:</strong> Trade charts, screenshots, uploaded images, and files</li>
                <li><strong>User Preferences:</strong> Settings, preferences, notification choices, customization options</li>
                <li><strong>Payment Information:</strong> Billing details (processed securely via third-party payment processors)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent, interaction patterns</li>
                <li><strong>Device Information:</strong> Browser type, operating system, device type, IP address</li>
                <li><strong>Log Data:</strong> Access times, errors, API calls, system activity</li>
                <li><strong>Cookies & Tracking:</strong> Session management, analytics, preferences (see Cookie Policy)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">2.3 Information from Integrations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Broker API Data:</strong> If you connect broker accounts, we may access trade history and account data</li>
                <li><strong>Third-Party Services:</strong> Data from integrated services (OAuth providers like Google)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
              <p>We use collected data for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Delivery:</strong> Provide core trading journal functionality, analytics, and AI insights</li>
                <li><strong>Personalization:</strong> Customize your dashboard, preferences, and recommendations</li>
                <li><strong>AI Processing:</strong> Generate trade analysis, pattern recognition, habit tracking, and insights</li>
                <li><strong>Communication:</strong> Send account updates, newsletters, feature announcements, support responses</li>
                <li><strong>Payment Processing:</strong> Process subscriptions, invoices, and billing inquiries</li>
                <li><strong>Security:</strong> Detect fraud, prevent abuse, secure accounts, and monitor for suspicious activity</li>
                <li><strong>Analytics & Improvement:</strong> Analyze usage patterns to improve features and user experience</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations, tax regulations, and government requests</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. How We Share Your Information</h2>
              <p>We do NOT sell your personal data to third parties. We may share data in the following limited circumstances:</p>

              <h3 className="text-lg font-semibold mt-4">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cloud Hosting:</strong> Infrastructure providers for data storage and application hosting</li>
                <li><strong>Payment Processors:</strong> Stripe, Razorpay, UPI for secure payment processing</li>
                <li><strong>AI Services:</strong> Third-party AI providers for generating trade insights (under strict NDAs)</li>
                <li><strong>Analytics Tools:</strong> Privacy-focused analytics to improve service quality</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.2 Legal Requirements</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>When required by law, court order, or government regulation</li>
                <li>To enforce our Terms & Conditions or protect our legal rights</li>
                <li>To prevent fraud, security breaches, or illegal activities</li>
                <li>During investigations of policy violations</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.3 Business Transfers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>In the event of a merger, acquisition, or sale of assets, your data may be transferred</li>
                <li>You will be notified in advance and given options regarding your data</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.4 With Your Consent</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you explicitly authorize us to share data with specific third parties</li>
                <li>When using community features where you choose to share trades publicly</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encryption:</strong> All data transmission uses TLS/SSL (HTTPS)</li>
                <li><strong>Password Protection:</strong> Passwords are hashed using bcrypt/Argon2</li>
                <li><strong>Access Controls:</strong> Row-level security ensures users can only access their own data</li>
                <li><strong>Regular Backups:</strong> Automated backups to prevent data loss</li>
                <li><strong>Monitoring:</strong> 24/7 monitoring for security threats and anomalies</li>
                <li><strong>Compliance:</strong> Following GDPR, CCPA, and Indian IT Rules</li>
              </ul>
              <p className="mt-4">
                However, no system is 100% secure. While we strive to protect your data, we cannot guarantee absolute 
                security. You are responsible for maintaining the confidentiality of your password.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Data Retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Active Accounts:</strong> Data is retained as long as your account is active</li>
                <li><strong>After Cancellation:</strong> Data is retained for 90 days after account cancellation</li>
                <li><strong>Permanent Deletion:</strong> After 90 days, all personal data is permanently deleted</li>
                <li><strong>Legal Requirements:</strong> Some data (e.g., payment records) may be retained longer for tax/legal compliance</li>
                <li><strong>Anonymized Data:</strong> Aggregated, anonymized analytics may be retained indefinitely for research</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Your Privacy Rights</h2>
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of all data we hold about you</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request permanent deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your trade data in CSV/JSON format</li>
                <li><strong>Objection:</strong> Object to certain types of data processing (e.g., marketing)</li>
                <li><strong>Restriction:</strong> Request limited processing of your data</li>
                <li><strong>Withdraw Consent:</strong> Revoke consent for optional data processing</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, contact us at <strong>privacy@yourtradingjournal.com</strong>. 
                We will respond within 30 days.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Cookies & Tracking Technologies</h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for login, session management, and core functionality</li>
                <li><strong>Analytics Cookies:</strong> To understand usage patterns and improve the platform</li>
                <li><strong>Preference Cookies:</strong> To remember your settings and customization</li>
              </ul>
              <p className="mt-4">
                You can control cookies through your browser settings. However, disabling essential cookies may 
                impact functionality. For detailed information, see our <strong>Cookie Policy</strong>.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. International Data Transfers</h2>
              <p>
                Your data may be processed and stored in servers located in different countries. If you are located 
                outside India, your data may be transferred to and processed in India or other jurisdictions. We ensure 
                that adequate safeguards are in place to protect your data during international transfers, in compliance 
                with GDPR, CCPA, and other applicable laws.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Children's Privacy</h2>
              <p>
                Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from minors. If we discover that we have inadvertently collected data from a child, we will 
                delete it immediately. Parents or guardians who believe their child has provided us with personal 
                information should contact us at <strong>privacy@yourtradingjournal.com</strong>.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites or services (e.g., broker integrations, 
                educational resources). We are not responsible for the privacy practices of these third parties. 
                We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Updates to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, legal 
                requirements, or service features. We will notify you of significant changes via email or 
                in-platform notification. The "Last Updated" date at the top of this policy indicates when it was 
                last revised. Continued use of our platform after updates constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, 
                please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> privacy@yourtradingjournal.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@yourtradingjournal.com</li>
                <li><strong>Support:</strong> support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Governing Law</h2>
              <p>
                This Privacy Policy is governed by the laws of India. Any disputes arising from this policy will be 
                subject to the exclusive jurisdiction of courts in [Your City], India.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                By using our Trading Journal platform, you acknowledge that you have read, understood, and agree 
                to this Privacy Policy.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;