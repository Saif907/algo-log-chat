import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
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
            <CardTitle className="text-3xl">Shipping & Delivery Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Nature of Service</h2>
              <p className="font-semibold text-lg text-foreground">
                Our AI-powered Trading Journal is a 100% DIGITAL SERVICE delivered entirely online. There are NO 
                physical products, shipments, or deliveries involved.
              </p>
              <p>
                This Shipping & Delivery Policy clarifies how our digital service is delivered and what you can 
                expect upon subscription or purchase.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Digital Service Delivery</h2>
              
              <h3 className="text-lg font-semibold mt-4">2.1 Instant Access</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Immediate Availability:</strong> Access is granted instantly upon successful payment</li>
                <li><strong>No Waiting Period:</strong> There are no shipping times, delivery windows, or delays</li>
                <li><strong>Global Access:</strong> Available worldwide via internet connection</li>
                <li><strong>24/7 Availability:</strong> Access your account anytime, anywhere from any device</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">2.2 How Delivery Works</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Complete registration and select a subscription plan</li>
                <li>Enter payment information (credit card, UPI, net banking)</li>
                <li>Payment is processed securely through our payment partners</li>
                <li>Upon successful payment, your account is instantly upgraded</li>
                <li>Log in immediately to access all premium features</li>
                <li>Receive email confirmation with subscription details</li>
              </ol>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Access Requirements</h2>
              <p>To access our digital service, you need:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Internet Connection:</strong> Stable broadband or mobile data connection</li>
                <li><strong>Web Browser:</strong> Modern browser (Chrome, Firefox, Safari, Edge)</li>
                <li><strong>Device:</strong> Desktop, laptop, tablet, or smartphone</li>
                <li><strong>Account Credentials:</strong> Valid email and password for login</li>
              </ul>
              <p className="mt-4">
                No downloads, installations, or software setup required. Access the platform directly through your 
                web browser.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Service Availability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Uptime Goal:</strong> 99.9% service availability</li>
                <li><strong>Maintenance Windows:</strong> Occasional scheduled maintenance (announced in advance)</li>
                <li><strong>No Outage Compensation:</strong> Service interruptions do not constitute delivery failure</li>
                <li><strong>Status Updates:</strong> Real-time status available at status.yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Delivery Confirmation</h2>
              <p>Upon successful subscription, you will receive:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Welcome Email:</strong> Confirmation of account activation</li>
                <li><strong>Subscription Receipt:</strong> Invoice with payment details and GST/tax information</li>
                <li><strong>Getting Started Guide:</strong> Tips for using the platform effectively</li>
                <li><strong>Login Credentials:</strong> Reminder of your registered email (password set during signup)</li>
              </ul>
              <p className="mt-4">
                If you do not receive confirmation within 5 minutes, check your spam folder or contact support.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. No Physical Shipments</h2>
              <p className="font-semibold text-foreground">
                IMPORTANT: We do NOT ship any physical products. This means:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No shipping addresses required (except for billing purposes)</li>
                <li>No courier services, tracking numbers, or delivery partners involved</li>
                <li>No customs duties, import taxes, or shipping fees</li>
                <li>No delivery delays due to logistics, weather, or location</li>
                <li>No damaged or lost shipments</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Geographic Availability</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Worldwide Access:</strong> Available in all countries with internet connectivity</li>
                <li><strong>Payment Methods:</strong> Vary by region (UPI for India, Stripe for international)</li>
                <li><strong>Language:</strong> Currently available in English (additional languages may be added)</li>
                <li><strong>Compliance:</strong> Service complies with local data protection laws (GDPR, CCPA, Indian IT Rules)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Free Trial Delivery</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free trials are activated instantly upon signup</li>
                <li>No payment required upfront for trial activation</li>
                <li>Access all premium features immediately during the trial period</li>
                <li>Trial converts to paid subscription automatically unless cancelled</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Delivery Issues & Troubleshooting</h2>
              <p>If you experience access issues after payment:</p>

              <h3 className="text-lg font-semibold mt-4">9.1 Common Issues</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Processing Delay:</strong> Allow 5-10 minutes for payment confirmation</li>
                <li><strong>Browser Cache:</strong> Clear cache and cookies, then refresh the page</li>
                <li><strong>Incorrect Login:</strong> Verify you're using the correct email and password</li>
                <li><strong>Account Not Upgraded:</strong> Log out and log back in to refresh account status</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">9.2 Technical Support</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: support@yourtradingjournal.com with payment receipt</li>
                <li>Include transaction ID, payment date, and registered email</li>
                <li>Our team will resolve access issues within 24 hours</li>
                <li>Manual account activation if automatic upgrade fails</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Upgrades & Plan Changes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Instant Upgrades:</strong> Plan upgrades take effect immediately after payment</li>
                <li><strong>Downgrades:</strong> Take effect at the end of current billing period</li>
                <li><strong>Feature Unlocks:</strong> New features become accessible instantly upon upgrade</li>
                <li><strong>No Re-delivery:</strong> Changing plans does not require re-delivery or new access</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Data Syncing & Cloud Delivery</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Real-Time Sync:</strong> All trade data syncs instantly to the cloud</li>
                <li><strong>Multi-Device Access:</strong> Access from multiple devices simultaneously</li>
                <li><strong>No Local Storage Required:</strong> Everything is stored securely online</li>
                <li><strong>Automatic Backups:</strong> Data is backed up continuously (no manual action needed)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Third-Party Integrations</h2>
              <p>If using broker integrations or third-party services:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Integration setup may take 5-10 minutes for initial connection</li>
                <li>External API delays are beyond our control</li>
                <li>Historical data import may take time depending on data volume</li>
                <li>We are not responsible for third-party service availability</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Service Discontinuation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>In the unlikely event we discontinue the service, we will provide 90 days' notice</li>
                <li>You will have the opportunity to export all your data before shutdown</li>
                <li>Prorated refunds will be issued for prepaid subscriptions</li>
                <li>Migration assistance may be provided to alternative platforms</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Export & Portability (Your Data Delivery)</h2>
              <p>You can "deliver" your own data to yourself anytime:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navigate to <strong>Settings → Data Export</strong></li>
                <li>Download complete trade history in CSV or JSON format</li>
                <li>Export includes trades, notes, performance metrics, tags, and more</li>
                <li>Available on both Free and Paid plans</li>
                <li>Instant download - no waiting period</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">15. Refund Policy Reference</h2>
              <p>
                Since this is a digital service delivered instantly, standard refund policies apply. Please refer to 
                our separate <strong>Refund Policy</strong> for details on eligible refund scenarios (e.g., duplicate 
                charges, technical failures).
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery completion does not affect refund eligibility for valid cases</li>
                <li>No refunds for "change of mind" after instant delivery</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">16. Contact Information</h2>
              <p>For questions about service delivery or access issues:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> support@yourtradingjournal.com</li>
                <li><strong>Technical Support:</strong> tech@yourtradingjournal.com</li>
                <li><strong>Response Time:</strong> 24-48 hours</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Shipping & Delivery Policy is effective as of {new Date().toLocaleDateString()}. As a digital 
                service provider, we are committed to instant, hassle-free access to our platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Shipping;