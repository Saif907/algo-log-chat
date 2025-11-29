import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cookies = () => {
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
            <CardTitle className="text-3xl">Cookie Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                This Cookie Policy explains how our AI-powered Trading Journal platform uses cookies and similar 
                tracking technologies. By using our service, you consent to the use of cookies as described in this 
                policy.
              </p>
              <p>
                Cookies help us provide a better user experience, secure your account, and understand how you use 
                our platform. You have control over cookie preferences as outlined below.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. What Are Cookies?</h2>
              <p>
                Cookies are small text files stored on your device (computer, smartphone, tablet) by your web browser 
                when you visit a website. They help websites remember your preferences, login status, and browsing 
                behavior.
              </p>
              <p><strong>Key characteristics:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies do NOT contain viruses or malware</li>
                <li>They cannot access other files on your device</li>
                <li>They are specific to the website that sets them</li>
                <li>Most cookies are harmless and improve user experience</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Types of Cookies We Use</h2>

              <h3 className="text-lg font-semibold mt-4">3.1 Strictly Necessary Cookies</h3>
              <p><strong>Purpose:</strong> Essential for the platform to function properly</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Authentication:</strong> Remember your login status and session</li>
                <li><strong>Security:</strong> Protect against cross-site request forgery (CSRF) attacks</li>
                <li><strong>Load Balancing:</strong> Route requests to the correct server</li>
                <li><strong>Form Data:</strong> Temporarily store form inputs to prevent data loss</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                These cookies cannot be disabled as they are required for core functionality.
              </p>

              <h3 className="text-lg font-semibold mt-4">3.2 Functional Cookies</h3>
              <p><strong>Purpose:</strong> Remember your preferences and settings</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Theme Preferences:</strong> Remember if you chose light or dark mode</li>
                <li><strong>Language:</strong> Store your language preference</li>
                <li><strong>Dashboard Layout:</strong> Save your customized dashboard configuration</li>
                <li><strong>Chart Settings:</strong> Remember your preferred chart types and indicators</li>
                <li><strong>Notification Settings:</strong> Store your notification preferences</li>
              </ul>
              <p className="mt-4">These cookies can be disabled, but functionality will be limited.</p>

              <h3 className="text-lg font-semibold mt-4">3.3 Analytics Cookies</h3>
              <p><strong>Purpose:</strong> Understand how users interact with our platform</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Tracking:</strong> Pages visited, features used, time spent</li>
                <li><strong>Performance Monitoring:</strong> Identify slow pages and technical issues</li>
                <li><strong>User Journey:</strong> Understand navigation patterns and user flows</li>
                <li><strong>Feature Adoption:</strong> Track which features are most/least used</li>
              </ul>
              <p className="mt-4">
                We use privacy-focused analytics that anonymize data. These cookies can be disabled in settings.
              </p>

              <h3 className="text-lg font-semibold mt-4">3.4 Performance Cookies</h3>
              <p><strong>Purpose:</strong> Optimize platform speed and reliability</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Caching:</strong> Store frequently accessed data locally for faster loading</li>
                <li><strong>CDN Routing:</strong> Deliver content from the nearest server location</li>
                <li><strong>Error Tracking:</strong> Monitor and fix bugs quickly</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Third-Party Cookies</h2>
              <p>We use trusted third-party services that may set their own cookies:</p>

              <h3 className="text-lg font-semibold mt-4">4.1 Payment Processors</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Stripe / Razorpay:</strong> For secure payment processing</li>
                <li><strong>Purpose:</strong> Fraud detection, payment verification, compliance</li>
                <li><strong>Control:</strong> Managed by the payment provider</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.2 Authentication Providers</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>OAuth Providers:</strong> Google, Facebook (if social login is enabled)</li>
                <li><strong>Purpose:</strong> Enable single sign-on functionality</li>
                <li><strong>Control:</strong> Managed by the OAuth provider</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.3 Analytics Services</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Privacy-focused analytics:</strong> To understand aggregate usage patterns</li>
                <li><strong>Purpose:</strong> Improve user experience and platform performance</li>
                <li><strong>Data:</strong> Anonymized and aggregated (no personally identifiable information)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.4 CDN & Hosting</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cloud Infrastructure:</strong> For content delivery and hosting</li>
                <li><strong>Purpose:</strong> Fast, reliable access from anywhere in the world</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Cookie Duration</h2>

              <h3 className="text-lg font-semibold mt-4">5.1 Session Cookies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Lifetime:</strong> Deleted when you close your browser</li>
                <li><strong>Purpose:</strong> Temporary data needed for current session</li>
                <li><strong>Examples:</strong> Shopping cart, form inputs, login status</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">5.2 Persistent Cookies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Lifetime:</strong> Remain until expiration date or manual deletion</li>
                <li><strong>Purpose:</strong> Remember settings across sessions</li>
                <li><strong>Examples:</strong> "Remember me" login, theme preferences</li>
                <li><strong>Typical Duration:</strong> 30 days to 1 year</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. What We Do NOT Use Cookies For</h2>
              <p className="font-semibold text-foreground">We do NOT use cookies for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Selling Your Data:</strong> We never sell cookie data to third parties</li>
                <li><strong>Targeted Advertising:</strong> We do not run ads or use cookies for ad tracking</li>
                <li><strong>Cross-Site Tracking:</strong> We do not track you across other websites</li>
                <li><strong>Behavioral Profiling:</strong> We do not build profiles for marketing purposes</li>
                <li><strong>Social Media Tracking:</strong> No Facebook Pixel or similar tracking pixels</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Managing Cookie Preferences</h2>

              <h3 className="text-lg font-semibold mt-4">7.1 In-Platform Controls</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navigate to <strong>Settings → Privacy → Cookie Preferences</strong></li>
                <li>Toggle optional cookies on/off (analytics, functional)</li>
                <li>Strictly necessary cookies cannot be disabled</li>
                <li>Changes take effect immediately</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">7.2 Browser Settings</h3>
              <p>You can control cookies through your browser settings:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>
              <p className="mt-4">
                <strong>Warning:</strong> Blocking all cookies will prevent you from logging in and using the platform.
              </p>

              <h3 className="text-lg font-semibold mt-4">7.3 Clearing Cookies</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use your browser's "Clear browsing data" feature</li>
                <li>Select "Cookies and other site data"</li>
                <li>Choose time range (last hour, 24 hours, all time)</li>
                <li>You will be logged out after clearing cookies</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Do Not Track (DNT) Signals</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We respect browser "Do Not Track" (DNT) signals</li>
                <li>When DNT is enabled, we disable non-essential tracking</li>
                <li>Strictly necessary cookies remain active for functionality</li>
                <li>Enable DNT in your browser privacy settings</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Cookies and Personal Data</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Most cookies do not contain personally identifiable information</li>
                <li>Authentication cookies contain session tokens (not passwords)</li>
                <li>Analytics cookies use anonymized, aggregated data</li>
                <li>Cookie data is covered by our Privacy Policy</li>
                <li>You can request deletion of cookie data via privacy@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Mobile App Considerations</h2>
              <p>If we release mobile apps in the future:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Apps may use similar technologies (local storage, device IDs)</li>
                <li>Cookie Policy principles apply to all platforms</li>
                <li>Mobile-specific controls will be available in app settings</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Legal Compliance</h2>
              <p>Our cookie usage complies with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>GDPR (EU):</strong> ePrivacy Directive and General Data Protection Regulation</li>
                <li><strong>CCPA (California):</strong> California Consumer Privacy Act</li>
                <li><strong>Indian IT Rules:</strong> Information Technology Act, 2000</li>
                <li><strong>Cookie Consent:</strong> Obtained via banner on first visit</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Cookie Consent Banner</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>New visitors see a cookie consent banner on first visit</li>
                <li>You can accept all, reject optional, or customize preferences</li>
                <li>Consent is remembered for 12 months</li>
                <li>You can update preferences anytime in Settings</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy to reflect changes in technology, legal requirements, or our practices. 
                Material changes will be communicated via email or in-platform notification. Continued use after updates 
                constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Contact Us</h2>
              <p>For questions about cookies or this policy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> privacy@yourtradingjournal.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@yourtradingjournal.com</li>
                <li><strong>Support:</strong> support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Cookie Policy is effective as of {new Date().toLocaleDateString()} and applies to all users 
                of the Trading Journal platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cookies;