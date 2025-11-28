import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AcceptableUse = () => {
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
            <CardTitle className="text-3xl">Acceptable Use Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Purpose</h2>
              <p>
                This Acceptable Use Policy (AUP) defines the rules and guidelines for using our AI-powered Trading 
                Journal platform. By accessing or using our service, you agree to comply with this policy. Violations 
                may result in account suspension or termination without refund.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Permitted Uses</h2>
              <p>You may use our platform to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log and track your personal trading activities and performance</li>
                <li>Upload trade screenshots, charts, and relevant trading documentation</li>
                <li>Analyze your trading patterns using our analytics and AI-powered insights</li>
                <li>Access dashboards, performance metrics, and trade statistics</li>
                <li>Use AI features for trade analysis, pattern recognition, and habit tracking</li>
                <li>Export your own trade data for personal record-keeping</li>
                <li>Integrate with supported broker APIs (if applicable)</li>
                <li>Participate in community features in a respectful and constructive manner</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Prohibited Uses</h2>
              <p>You may NOT use our platform to:</p>
              
              <h3 className="text-lg font-semibold mt-4">3.1 Illegal Activities</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Engage in any illegal activities or facilitate violations of laws or regulations</li>
                <li>Use the platform for money laundering, fraud, or other financial crimes</li>
                <li>Manipulate markets or engage in insider trading activities</li>
                <li>Violate securities laws, trading regulations, or financial compliance rules</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.2 Misuse of Platform</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide investment advice, buy/sell signals, or financial recommendations to others</li>
                <li>Resell, redistribute, or commercialize access to the platform without authorization</li>
                <li>Share your account credentials with unauthorized users</li>
                <li>Use the platform for any purpose other than personal trading journal management</li>
                <li>Create multiple accounts to bypass subscription limits or abuse free trials</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.3 Technical Abuse</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Attempt to hack, breach, or compromise platform security</li>
                <li>Reverse engineer, decompile, or extract source code from the platform</li>
                <li>Use bots, scrapers, or automated tools to extract data without authorization</li>
                <li>Overload servers with excessive API requests or denial-of-service attacks</li>
                <li>Circumvent usage limits, access controls, or security measures</li>
                <li>Inject malicious code, viruses, or malware into the platform</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.4 Content Violations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload offensive, abusive, hateful, or discriminatory content</li>
                <li>Share copyrighted material without proper authorization</li>
                <li>Post spam, phishing links, or deceptive content</li>
                <li>Upload pornographic, violent, or otherwise inappropriate material</li>
                <li>Impersonate other users, entities, or misrepresent your identity</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.5 Data Misuse</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access or attempt to access another user's trade data or account</li>
                <li>Use the platform to collect data for competing services</li>
                <li>Share or publish other users' data without their explicit consent</li>
                <li>Use AI features to generate misleading or fraudulent trade records</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Fair Use Limits</h2>
              <p>To ensure service quality for all users, the following fair use limits apply:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Trade Logs:</strong> Unlimited trades per month (reasonable personal use)</li>
                <li><strong>AI Insights:</strong> Subject to plan-based limits (e.g., 100-500 AI analyses per month)</li>
                <li><strong>Storage:</strong> Up to 10 GB per account for screenshots and documents</li>
                <li><strong>API Calls:</strong> Rate-limited to prevent abuse (e.g., 1000 requests/hour)</li>
                <li><strong>Exports:</strong> Limited to reasonable frequency (e.g., 10 exports per day)</li>
              </ul>
              <p className="mt-4">
                Excessive usage beyond fair use may result in temporary throttling or upgrade requirements. 
                Enterprise plans are available for higher usage needs.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Community Guidelines (AI Chat & Forums)</h2>
              <p>If using community or AI chat features:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Be Respectful:</strong> Treat all users with courtesy and professionalism</li>
                <li><strong>No Financial Advice:</strong> Do not provide investment advice or trading signals to others</li>
                <li><strong>Constructive Feedback:</strong> Share experiences constructively, avoid toxic behavior</li>
                <li><strong>Privacy:</strong> Do not share sensitive personal or financial information publicly</li>
                <li><strong>No Spam:</strong> Avoid promotional content, referral links, or unsolicited advertising</li>
                <li><strong>Accurate Information:</strong> Do not spread misinformation or manipulate data</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Account Responsibilities</h2>
              <p>As an account holder, you are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Security:</strong> Keeping your password secure and confidential</li>
                <li><strong>Activity Monitoring:</strong> All actions taken under your account credentials</li>
                <li><strong>Accurate Information:</strong> Providing truthful registration and billing information</li>
                <li><strong>Compliance:</strong> Following all applicable laws and regulations in your jurisdiction</li>
                <li><strong>Reporting:</strong> Immediately reporting suspicious activity or security breaches</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>The platform, including code, design, and AI models, is our proprietary property</li>
                <li>You retain ownership of your trade data and content uploaded to the platform</li>
                <li>By uploading content, you grant us a limited license to store, process, and display it for service delivery</li>
                <li>Do not copy, reproduce, or redistribute platform features without authorization</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Consequences of Violations</h2>
              <p>Violations of this Acceptable Use Policy may result in:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Warning:</strong> First-time minor violations may receive a warning</li>
                <li><strong>Temporary Suspension:</strong> Account access may be suspended for 7-30 days</li>
                <li><strong>Permanent Termination:</strong> Severe or repeated violations result in account deletion</li>
                <li><strong>No Refunds:</strong> Subscriptions are not refunded for policy violations</li>
                <li><strong>Legal Action:</strong> We reserve the right to pursue legal action for serious violations</li>
                <li><strong>Data Deletion:</strong> Upon termination, your data may be permanently deleted</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Reporting Violations</h2>
              <p>
                If you become aware of any violations of this policy by other users, please report them to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> abuse@yourtradingjournal.com</li>
                <li><strong>Support Portal:</strong> In-app support ticket system</li>
              </ul>
              <p className="mt-4">
                All reports will be investigated promptly and handled confidentially.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Modifications</h2>
              <p>
                We reserve the right to modify this Acceptable Use Policy at any time. Changes will be communicated 
                via email or platform notifications. Continued use after updates constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Contact Us</h2>
              <p>For questions about this policy, contact:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> legal@yourtradingjournal.com</li>
                <li><strong>Support:</strong> support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                By using our Trading Journal platform, you acknowledge that you have read, understood, and agree 
                to comply with this Acceptable Use Policy.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptableUse;