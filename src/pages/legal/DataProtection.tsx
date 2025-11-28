import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DataProtection = () => {
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
            <CardTitle className="text-3xl">Data Protection & Security Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                This Data Protection & Security Policy outlines how we protect, store, and manage your trading data 
                on our AI-powered Trading Journal platform. We are committed to implementing industry-standard security 
                measures to safeguard your sensitive trading information.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Data We Protect</h2>
              <p>We implement security measures for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Trade Data:</strong> Entry prices, exit prices, stop losses, targets, trade notes, screenshots</li>
                <li><strong>Performance Metrics:</strong> P&L calculations, win rates, analytics, dashboard statistics</li>
                <li><strong>Personal Information:</strong> Email addresses, profile details, account settings</li>
                <li><strong>AI Processing Data:</strong> Trade analysis inputs, AI-generated insights, pattern recognition data</li>
                <li><strong>Authentication Data:</strong> Encrypted passwords, session tokens, login history</li>
                <li><strong>Payment Information:</strong> Processed securely through third-party payment gateways (we do not store full payment details)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Security Measures</h2>
              <h3 className="text-lg font-semibold mt-4">3.1 Technical Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encryption:</strong> All data transmission uses TLS/SSL encryption (HTTPS)</li>
                <li><strong>Password Security:</strong> Passwords are hashed using industry-standard algorithms (bcrypt/Argon2)</li>
                <li><strong>Database Security:</strong> Row-level security (RLS) policies ensure users can only access their own data</li>
                <li><strong>API Security:</strong> Authentication tokens, rate limiting, and input validation on all endpoints</li>
                <li><strong>File Storage:</strong> Uploaded screenshots and documents are stored securely with access controls</li>
                <li><strong>Infrastructure:</strong> Hosted on secure cloud infrastructure with regular security updates</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.2 Access Controls</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Multi-factor authentication (MFA) available for enhanced account security</li>
                <li>Session management with automatic timeout after inactivity</li>
                <li>IP-based monitoring for suspicious login attempts</li>
                <li>User-specific data isolation - no user can access another user's trades or data</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.3 Monitoring & Incident Response</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>24/7 automated monitoring for security threats and anomalies</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Incident response plan for handling data breaches</li>
                <li>Logging of system access for audit trails</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. AI Data Processing</h2>
              <p>When using AI features for trade analysis and insights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your trade data is processed securely to generate AI insights</li>
                <li>AI processing occurs in isolated, encrypted environments</li>
                <li>We do not train AI models on your personal trading data without explicit consent</li>
                <li>AI-generated insights are stored securely and accessible only to you</li>
                <li>Third-party AI providers (if used) are bound by strict data processing agreements</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Data Storage & Retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Storage Location:</strong> Data is stored in secure data centers with geographic redundancy</li>
                <li><strong>Backup:</strong> Regular automated backups to prevent data loss</li>
                <li><strong>Retention Period:</strong> Active account data is retained for the duration of your subscription</li>
                <li><strong>Account Deletion:</strong> Upon account deletion, data is permanently removed within 30 days</li>
                <li><strong>Legal Retention:</strong> Some data may be retained longer if required by law (tax records, legal compliance)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. User Responsibilities</h2>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Password Security:</strong> Creating strong passwords and keeping them confidential</li>
                <li><strong>Account Access:</strong> Not sharing your login credentials with others</li>
                <li><strong>Suspicious Activity:</strong> Immediately reporting any unauthorized access to your account</li>
                <li><strong>Device Security:</strong> Securing devices used to access the platform</li>
                <li><strong>Logout:</strong> Logging out after using shared or public computers</li>
                <li><strong>Software Updates:</strong> Keeping your browser and devices updated with security patches</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Third-Party Services</h2>
              <p>We use trusted third-party services that process data on our behalf:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processors:</strong> Stripe, Razorpay, UPI (they have their own security standards)</li>
                <li><strong>Cloud Infrastructure:</strong> Secure hosting with enterprise-grade security</li>
                <li><strong>AI Services:</strong> Third-party AI providers bound by data processing agreements</li>
                <li><strong>Analytics:</strong> Privacy-focused analytics to improve service quality</li>
              </ul>
              <p>All third parties are vetted and required to maintain comparable security standards.</p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Data Breach Protocol</h2>
              <p>In the unlikely event of a data breach:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will investigate immediately and contain the breach</li>
                <li>Affected users will be notified within 72 hours</li>
                <li>Relevant authorities will be informed as required by law</li>
                <li>We will provide guidance on protective measures you can take</li>
                <li>A detailed incident report will be prepared and shared</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Compliance</h2>
              <p>We comply with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Indian IT Rules:</strong> Information Technology Act, 2000 and IT Rules, 2011</li>
                <li><strong>GDPR (EU):</strong> General Data Protection Regulation for European users</li>
                <li><strong>CCPA (California):</strong> California Consumer Privacy Act for California residents</li>
                <li><strong>ISO Standards:</strong> Following industry best practices for data security</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Your Data Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request a copy of all your data we hold</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request permanent deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your trade data in a standard format</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
                <li><strong>Restriction:</strong> Request limited processing of your data</li>
              </ul>
              <p className="mt-4">To exercise these rights, contact us at privacy@yourtradingjournal.com</p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Children's Data</h2>
              <p>
                Our platform is not intended for users under 18 years of age. We do not knowingly collect data 
                from minors. If we discover such data has been collected, it will be deleted immediately.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Updates to This Policy</h2>
              <p>
                We may update this Data Protection & Security Policy to reflect changes in security practices 
                or legal requirements. Major changes will be communicated via email. Continued use of the platform 
                after updates constitutes acceptance.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Contact Information</h2>
              <p>For security concerns or data protection inquiries:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> security@yourtradingjournal.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@yourtradingjournal.com</li>
                <li><strong>Security Incident Reporting:</strong> incidents@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Data Protection & Security Policy is effective as of {new Date().toLocaleDateString()} and 
                governs the security and protection of data on the Trading Journal platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataProtection;