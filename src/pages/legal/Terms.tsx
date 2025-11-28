import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
            <CardTitle className="text-3xl">Terms & Conditions</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p>
                Welcome to our AI-powered Trading Journal platform ("Service," "we," "us," or "our"). By accessing 
                or using our web-based trading journal service, you agree to be bound by these Terms & Conditions 
                ("Terms"). If you do not agree to all the terms, you may not access or use the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and 
                our company. Please read them carefully.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Description of Service</h2>
              <p>
                Our Trading Journal is a web-based SaaS platform that enables users to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manually log and track personal trading activities</li>
                <li>Sync trade data via broker integrations (where available)</li>
                <li>Analyze trading performance through dashboards, charts, and metrics</li>
                <li>Use AI-powered insights for trade analysis, pattern recognition, and habit tracking</li>
                <li>Upload screenshots, charts, and trade-related documentation</li>
                <li>Access historical trade data and performance reports</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                IMPORTANT: This Service is for personal trade journaling and analysis only. We do NOT provide 
                investment advice, financial recommendations, buy/sell signals, or portfolio management services.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Eligibility</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 18 years old to use this Service</li>
                <li>You must provide accurate and complete registration information</li>
                <li>You must have the legal capacity to enter into binding contracts</li>
                <li>You must not be prohibited from using the Service under applicable laws</li>
                <li>Corporate accounts must be authorized by an appropriate representative</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. User Accounts</h2>
              
              <h3 className="text-lg font-semibold mt-4">4.1 Account Creation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must create an account to access most features of the Service</li>
                <li>You agree to provide truthful, accurate, and current information</li>
                <li>You are responsible for maintaining the confidentiality of your password</li>
                <li>You may not share your account with others or create multiple accounts</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.2 Account Security</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are solely responsible for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access or security breaches</li>
                <li>We are not liable for losses due to unauthorized use of your account</li>
                <li>Use strong, unique passwords and enable two-factor authentication when available</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.3 Account Termination</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
                <li>You may cancel your account anytime through account settings</li>
                <li>Upon termination, your access to the Service will cease immediately</li>
                <li>Data retention follows our Privacy Policy and Data Protection Policy</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Subscriptions & Payments</h2>
              
              <h3 className="text-lg font-semibold mt-4">5.1 Subscription Plans</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We offer Free and Paid subscription tiers with varying features</li>
                <li>Paid subscriptions are available on monthly or yearly billing cycles</li>
                <li>Subscription details and pricing are available at time of purchase</li>
                <li>Prices are subject to change with 30 days' notice to existing subscribers</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">5.2 Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payments are processed through Stripe, Razorpay, or UPI based on region</li>
                <li>You authorize us to charge your payment method for subscription fees</li>
                <li>All fees are non-refundable except as required by law or our Refund Policy</li>
                <li>Applicable taxes (GST, VAT, sales tax) will be added to subscription costs</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">5.3 Automatic Renewal</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscriptions automatically renew at the end of each billing cycle</li>
                <li>You will be charged automatically unless you cancel before renewal</li>
                <li>Email reminders are sent 7 days before renewal</li>
                <li>Cancel anytime through account settings to prevent future charges</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">5.4 Failed Payments</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We will retry failed payments up to 3 times over 7 days</li>
                <li>Accounts with failed payments may be downgraded or suspended</li>
                <li>Update payment information promptly to avoid service interruption</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Disclaimer of Investment Advice</h2>
              <p className="font-semibold text-foreground">
                THIS IS CRITICAL: Our Service is a personal trading journal tool ONLY. It is NOT financial advice, 
                investment advisory, or portfolio management.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>We do NOT provide buy/sell signals, stock recommendations, or investment advice</li>
                <li>All trade analysis, AI insights, and performance metrics are for educational purposes only</li>
                <li>Past performance does NOT guarantee future results</li>
                <li>Trading involves substantial risk of loss and is not suitable for everyone</li>
                <li>You are solely responsible for your own trading decisions and outcomes</li>
                <li>Consult with licensed financial advisors before making investment decisions</li>
                <li>We are NOT registered as investment advisors or financial planners</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                By using this Service, you acknowledge that you trade at your own risk and will not hold us liable 
                for any trading losses.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. User Responsibilities</h2>
              <p>As a user of this Service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service only for lawful purposes</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the Service for illegal activities, fraud, or market manipulation</li>
                <li>Not provide investment advice to other users</li>
                <li>Not attempt to hack, reverse engineer, or compromise the platform</li>
                <li>Not upload malicious code, viruses, or harmful content</li>
                <li>Not share copyrighted material without authorization</li>
                <li>Respect other users' privacy and data</li>
                <li>Use AI features responsibly and ethically</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Intellectual Property</h2>
              
              <h3 className="text-lg font-semibold mt-4">8.1 Our Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Service, including code, design, logos, and AI models, is our proprietary property</li>
                <li>All trademarks, service marks, and branding belong to us</li>
                <li>You may not copy, reproduce, distribute, or create derivative works without permission</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">8.2 Your Content</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You retain ownership of your trade data, notes, screenshots, and uploaded content</li>
                <li>By using the Service, you grant us a limited license to store, process, and display your content</li>
                <li>This license is solely for providing the Service and generating AI insights</li>
                <li>We will not use your trading data for purposes outside of service delivery without consent</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Data Privacy</h2>
              <p>
                Your privacy is important to us. Our collection, use, and protection of your personal information is 
                governed by our <strong>Privacy Policy</strong>. By using the Service, you consent to our data practices 
                as outlined in the Privacy Policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
              <p className="font-semibold text-foreground uppercase">
                TO THE FULLEST EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>The Service is provided "AS IS" without warranties of any kind, express or implied</li>
                <li>We do NOT guarantee uninterrupted, error-free, or secure service</li>
                <li>We are NOT liable for trading losses, financial damages, or lost profits</li>
                <li>We are NOT liable for data loss, security breaches, or technical failures</li>
                <li>We are NOT liable for third-party integrations, broker API failures, or external services</li>
                <li>Our maximum liability is limited to the amount you paid in subscription fees in the last 12 months</li>
              </ul>
              <p className="mt-4">
                Some jurisdictions do not allow liability limitations. In such cases, our liability is limited to the 
                fullest extent permitted by law.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold us harmless from any claims, damages, losses, or expenses 
                (including legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or misuse of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any laws or regulations</li>
                <li>Infringement of third-party rights</li>
                <li>Your trading decisions or financial losses</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Material changes will be communicated via 
                email or in-platform notification. Continued use of the Service after changes constitutes acceptance 
                of the revised Terms. If you do not agree, you must discontinue use and cancel your account.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Service Availability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We strive for 99.9% uptime but do not guarantee continuous availability</li>
                <li>Maintenance, updates, or technical issues may cause temporary interruptions</li>
                <li>We reserve the right to suspend or discontinue the Service at any time</li>
                <li>No compensation is provided for service downtime</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Dispute Resolution</h2>
              
              <h3 className="text-lg font-semibold mt-4">14.1 Governing Law</h3>
              <p>
                These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive 
                jurisdiction of courts in [Your City], India.
              </p>

              <h3 className="text-lg font-semibold mt-4">14.2 Arbitration</h3>
              <p>
                Any disputes arising from these Terms shall be resolved through binding arbitration in accordance with 
                Indian arbitration laws, rather than in court. Each party shall bear their own costs.
              </p>

              <h3 className="text-lg font-semibold mt-4">14.3 Class Action Waiver</h3>
              <p>
                You agree to resolve disputes individually and waive the right to participate in class action lawsuits.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">15. Severability</h2>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions 
                shall remain in full force and effect.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">16. Contact Information</h2>
              <p>For questions about these Terms, contact us at:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> legal@yourtradingjournal.com</li>
                <li><strong>Support:</strong> support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                By using our Trading Journal platform, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms & Conditions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;