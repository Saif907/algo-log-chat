import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cancellation = () => {
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
            <CardTitle className="text-3xl">Cancellation Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                This Cancellation Policy explains how to cancel your subscription to our AI-powered Trading Journal 
                platform, what happens after cancellation, and your options for pausing or downgrading your account. 
                We believe in providing flexible subscription management without hidden fees or penalties.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Your Right to Cancel</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may cancel your subscription at any time for any reason</li>
                <li>No cancellation fees or penalties</li>
                <li>No questions asked - cancellation is instant and hassle-free</li>
                <li>Cancellation can be done entirely through your account settings</li>
                <li>No need to contact customer support (though we're here to help if needed)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. How to Cancel Your Subscription</h2>
              
              <h3 className="text-lg font-semibold mt-4">3.1 Self-Service Cancellation</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to your Trading Journal account</li>
                <li>Navigate to <strong>Settings → Billing</strong></li>
                <li>Click on <strong>"Manage Subscription"</strong></li>
                <li>Select <strong>"Cancel Subscription"</strong></li>
                <li>Confirm your cancellation when prompted</li>
                <li>Receive instant email confirmation</li>
              </ol>

              <h3 className="text-lg font-semibold mt-4">3.2 Contact Support for Cancellation</h3>
              <p>If you prefer assistance or encounter any issues:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: support@yourtradingjournal.com</li>
                <li>Include your account email and request cancellation</li>
                <li>We will process your request within 24 hours</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. When Cancellation Takes Effect</h2>
              
              <h3 className="text-lg font-semibold mt-4">4.1 During Active Subscription Period</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellation is effective <strong>at the end of your current billing period</strong></li>
                <li>You continue to have full access until the paid period expires</li>
                <li>You will NOT be charged for the next billing cycle</li>
                <li>Example: Cancel on Jan 15, subscription ends Feb 1 → Access until Feb 1</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.2 During Free Trial</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellation is effective immediately</li>
                <li>You will NOT be charged when the trial ends</li>
                <li>Your account reverts to Free plan immediately</li>
                <li>You can re-activate anytime during the trial period</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.3 After Payment Failure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If your payment fails, your account may be auto-downgraded after the grace period</li>
                <li>Formal cancellation is not required in this case</li>
                <li>Update payment method to reactivate if desired</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. What Happens After Cancellation</h2>

              <h3 className="text-lg font-semibold mt-4">5.1 Account Status</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your account automatically downgrades to the <strong>Free Plan</strong></li>
                <li>You can still log in and access Free plan features</li>
                <li>Premium features (AI insights, advanced analytics) become unavailable</li>
                <li>Your account remains active unless you delete it manually</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">5.2 Data Retention</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Immediate Access:</strong> All your trade data remains accessible on the Free plan</li>
                <li><strong>90-Day Retention:</strong> Full data retained for 90 days after cancellation</li>
                <li><strong>Re-subscription:</strong> Re-subscribe anytime within 90 days to restore premium features</li>
                <li><strong>After 90 Days:</strong> Data may be archived or deleted (you can export before this)</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">5.3 Feature Access Changes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Keep:</strong> Core trade journaling, basic charts, manual trade logging</li>
                <li><strong>Lose:</strong> AI insights, advanced analytics, unlimited trade logs, integrations, premium support</li>
                <li><strong>Limited:</strong> Storage may be reduced to Free plan limits (e.g., 1 GB vs 10 GB)</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Refunds After Cancellation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Automatic Refunds:</strong> Cancellation does not entitle you to a refund for the current billing period</li>
                <li><strong>Access Retained:</strong> You keep access until the end of your paid period</li>
                <li><strong>Eligible Refunds:</strong> See our separate <strong>Refund Policy</strong> for eligible scenarios (e.g., duplicate charges)</li>
                <li><strong>No Prorated Refunds:</strong> Canceling mid-cycle does not result in partial refunds</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Alternatives to Cancellation</h2>
              <p>Before cancelling, consider these options:</p>

              <h3 className="text-lg font-semibold mt-4">7.1 Downgrade Your Plan</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Switch to a lower-tier plan (e.g., Pro → Basic)</li>
                <li>Keep core features at a lower cost</li>
                <li>Downgrade takes effect at the end of your current billing period</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">7.2 Switch Billing Frequency</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change from monthly to yearly (or vice versa)</li>
                <li>Yearly plans offer significant savings (15-20% discount)</li>
                <li>Takes effect at next billing cycle</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">7.3 Pause Subscription (If Available)</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Some plans may offer a pause option for up to 3 months</li>
                <li>Your data is retained, and billing is suspended</li>
                <li>Resume anytime during the pause period</li>
                <li>Contact support to inquire about pause eligibility</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">7.4 Contact Support for Custom Solutions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If cost is an issue, we may offer temporary discounts or payment plans</li>
                <li>If specific features are lacking, share feedback for future improvements</li>
                <li>Email: support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Reactivating After Cancellation</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can re-subscribe at any time through <strong>Settings → Billing</strong></li>
                <li>Choose any available plan (not required to pick your previous plan)</li>
                <li>If within 90 days, your data and settings are fully restored</li>
                <li>If after 90 days, you start fresh but can import historical data</li>
                <li>Previous pricing may not apply if promotional rates have expired</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Exporting Your Data Before Cancellation</h2>
              <p>We recommend exporting your data before cancelling:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navigate to <strong>Settings → Data Export</strong></li>
                <li>Download your complete trade history in CSV or JSON format</li>
                <li>Export includes: trades, notes, performance metrics, tags</li>
                <li>Screenshots and documents can be downloaded from your file storage</li>
                <li>Exports are available on both Free and Paid plans</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Deleting Your Account (Permanent)</h2>
              <p>If you want to permanently delete your account (not just cancel subscription):</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Navigate to <strong>Settings → Account → Delete Account</strong></li>
                <li><strong>Warning:</strong> This is irreversible and deletes ALL your data permanently</li>
                <li>You will receive a confirmation email before deletion is finalized</li>
                <li>You have 7 days to cancel the deletion request</li>
                <li>After deletion, you can create a new account but previous data cannot be recovered</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Cancellation During Promotional Periods</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you subscribed with a discount or promotional code, cancellation rules remain the same</li>
                <li>Promotional pricing does not extend after reactivation</li>
                <li>Limited-time offers cannot be reinstated after cancellation</li>
                <li>Lifetime deals (if offered) may have separate cancellation terms - see specific offer details</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Cancellation by Us (Company-Initiated)</h2>
              <p>We may cancel or suspend your subscription in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Terms Violation:</strong> Breach of Terms & Conditions or Acceptable Use Policy</li>
                <li><strong>Payment Issues:</strong> Repeated payment failures after grace period</li>
                <li><strong>Fraudulent Activity:</strong> Suspected fraud, chargebacks, or abuse</li>
                <li><strong>Service Discontinuation:</strong> If we discontinue the service (rare, with advance notice)</li>
              </ul>
              <p className="mt-4">
                In such cases, you will receive email notification and may be eligible for prorated refunds (except for policy violations).
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Important Notes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cancel Before Renewal:</strong> To avoid being charged, cancel at least 24 hours before your renewal date</li>
                <li><strong>Email Reminders:</strong> You receive renewal reminders 7 days before billing</li>
                <li><strong>Multiple Subscriptions:</strong> If you have multiple accounts, cancel each separately</li>
                <li><strong>Family/Team Plans:</strong> Cancellation affects all members on the plan</li>
                <li><strong>No Hidden Clauses:</strong> There are no hidden cancellation requirements or terms</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Feedback & Improvement</h2>
              <p>
                We value your feedback! When you cancel, you'll have the option to share why you're leaving. This helps 
                us improve the platform for all users. Your feedback is optional but greatly appreciated.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">15. Contact Us</h2>
              <p>Need help with cancellation or have questions?</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> support@yourtradingjournal.com</li>
                <li><strong>Billing Support:</strong> billing@yourtradingjournal.com</li>
                <li><strong>Response Time:</strong> 24-48 hours</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Cancellation Policy is effective as of {new Date().toLocaleDateString()} and is subject to 
                our Terms & Conditions. We may update this policy with advance notice.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cancellation;