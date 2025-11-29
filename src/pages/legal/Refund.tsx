import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Refund = () => {
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
            <CardTitle className="text-3xl">Refund Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Overview</h2>
              <p>
                This Refund Policy outlines the terms and conditions under which refunds are issued for subscriptions 
                to our AI-powered Trading Journal platform. As a digital service delivered instantly, most subscription 
                fees are non-refundable except in specific circumstances outlined below.
              </p>
              <p>
                By subscribing to our service, you acknowledge and agree to this Refund Policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. General Refund Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Refunds After Renewal:</strong> Once a subscription renews (monthly or yearly), refunds are NOT issued for that billing cycle</li>
                <li><strong>Digital Service:</strong> Our service is delivered instantly upon payment, making standard refunds impractical</li>
                <li><strong>Cancellation vs Refund:</strong> You may cancel your subscription anytime, but this does not entitle you to a refund for the current billing period</li>
                <li><strong>Access Until Period Ends:</strong> After cancellation, you retain access until the end of your paid period</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Eligible Refund Scenarios</h2>
              <p>Refunds may be issued in the following limited circumstances:</p>

              <h3 className="text-lg font-semibold mt-4">3.1 Accidental Duplicate Payments</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you are charged twice for the same subscription period due to a technical error</li>
                <li>Must be reported within 7 days of the duplicate charge</li>
                <li>Requires proof of duplicate transactions (bank statement or payment receipt)</li>
                <li>Full refund of the duplicate charge will be issued</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.2 Technical Service Failure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If the service is completely unavailable for more than 72 consecutive hours</li>
                <li>Excludes scheduled maintenance or minor issues with specific features</li>
                <li>Prorated refund may be issued for the affected period</li>
                <li>Must be reported within 14 days of the outage</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.3 Billing Errors</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>If you are charged an incorrect amount due to our pricing error</li>
                <li>If your account is charged after successful cancellation</li>
                <li>Must be reported within 30 days of the erroneous charge</li>
                <li>Full refund of the incorrect amount will be issued</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.4 Legal Requirements</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds required by consumer protection laws in your jurisdiction</li>
                <li>Subject to verification and compliance with local regulations</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Non-Refundable Situations</h2>
              <p className="font-semibold text-foreground">Refunds will NOT be issued in the following cases:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Change of Mind:</strong> Deciding you no longer want the service after subscription renewal</li>
                <li><strong>Unused Service:</strong> Not using the platform during a paid period</li>
                <li><strong>Feature Expectations:</strong> Dissatisfaction with features or functionality that were clearly described</li>
                <li><strong>Account Violations:</strong> Account termination due to Terms & Conditions violations</li>
                <li><strong>Forgot to Cancel:</strong> Failure to cancel before automatic renewal</li>
                <li><strong>Plan Downgrades:</strong> Switching to a lower-tier plan mid-billing cycle</li>
                <li><strong>Trading Losses:</strong> Financial losses incurred from personal trading decisions</li>
                <li><strong>Third-Party Issues:</strong> Problems with broker integrations, external APIs, or third-party services</li>
                <li><strong>Partial Period Usage:</strong> Using the service for part of a billing cycle before cancelling</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Free Trial Refunds</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Free trials are provided at no cost, so no refunds are applicable</li>
                <li>Cancel anytime during the trial to avoid being charged</li>
                <li>If charged during a trial period due to our error, full refund will be issued</li>
                <li>One free trial per user - subsequent trials are not eligible for refund considerations</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Refund Request Process</h2>
              <p>To request a refund for an eligible scenario:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Contact Support:</strong> Email billing@yourtradingjournal.com within the specified timeframe</li>
                <li><strong>Provide Details:</strong> Include transaction ID, date of charge, and reason for refund request</li>
                <li><strong>Submit Evidence:</strong> Attach relevant proof (screenshots, bank statements, error logs)</li>
                <li><strong>Wait for Review:</strong> Our team will review your request within 3-5 business days</li>
                <li><strong>Receive Decision:</strong> You will be notified via email of approval or denial</li>
                <li><strong>Refund Processing:</strong> If approved, refunds are processed within 7-10 business days</li>
              </ol>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Refund Processing Timeline</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Review Period:</strong> 3-5 business days after request submission</li>
                <li><strong>Approval Notification:</strong> Within 24 hours of decision</li>
                <li><strong>Refund Initiation:</strong> Within 2 business days of approval</li>
                <li><strong>Bank Processing:</strong> 5-10 business days depending on your payment method and bank</li>
                <li><strong>Total Time:</strong> Expect 7-15 business days from approval to funds appearing in your account</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Refund Methods</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds are issued to the original payment method used</li>
                <li><strong>Credit/Debit Cards:</strong> Refunded to the same card</li>
                <li><strong>UPI/Net Banking:</strong> Refunded to the source account</li>
                <li><strong>Alternative Methods:</strong> If original method is unavailable, bank transfer may be arranged</li>
                <li>Refunds are issued in the same currency as the original charge</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Prorated Refunds</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>In eligible cases, refunds may be prorated based on unused service time</li>
                <li>Calculation: (Days remaining in billing cycle / Total days in cycle) × Subscription cost</li>
                <li>Minimum refund amount: $5 USD or ₹100 INR (smaller amounts not processed)</li>
                <li>Applies only to specific service failure scenarios</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Chargebacks</h2>
              <p className="font-semibold text-foreground">
                IMPORTANT: Filing a chargeback without contacting us first may result in account suspension.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Always contact our support team before initiating a chargeback</li>
                <li>Disputed chargebacks may result in permanent account termination</li>
                <li>Chargeback fees may be pursued for fraudulent disputes</li>
                <li>Valid refund requests will be processed faster through our support channels</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Taxes & Fees</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds include applicable taxes (GST, VAT, sales tax) paid originally</li>
                <li>Currency conversion fees charged by banks are NOT refunded</li>
                <li>Payment gateway processing fees are NOT refunded</li>
                <li>If taxes are refunded, corresponding tax credits are adjusted</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Regional Variations</h2>
              <p>
                Consumer protection laws vary by region. Additional refund rights may apply based on your location:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>European Union:</strong> 14-day cooling-off period under EU Consumer Rights Directive (for new subscriptions)</li>
                <li><strong>Australia:</strong> Australian Consumer Law provides additional guarantees</li>
                <li><strong>California, USA:</strong> CCPA may provide additional consumer rights</li>
                <li><strong>India:</strong> Consumer Protection Act, 2019 provisions apply</li>
              </ul>
              <p className="mt-4">
                Contact us if you believe you have additional refund rights under local laws.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Account Access After Refund</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Full refunds result in immediate account downgrade to Free plan</li>
                <li>Partial refunds may allow continued access for the remaining paid period</li>
                <li>Trade data is retained for 90 days after refund (see Data Retention Policy)</li>
                <li>You may re-subscribe at any time after receiving a refund</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Refund Abuse</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Repeated refund requests may be flagged as abuse</li>
                <li>Accounts with excessive refund requests may be suspended or terminated</li>
                <li>We reserve the right to deny refunds if abuse is suspected</li>
                <li>Fraudulent refund claims may result in legal action</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">15. Modifications to This Policy</h2>
              <p>
                We may update this Refund Policy to reflect changes in our practices or legal requirements. Material 
                changes will be communicated via email. Continued use after updates constitutes acceptance of the 
                revised policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">16. Contact Information</h2>
              <p>For refund requests or questions about this policy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> billing@yourtradingjournal.com</li>
                <li><strong>Refund Requests:</strong> refunds@yourtradingjournal.com</li>
                <li><strong>Support:</strong> support@yourtradingjournal.com</li>
                <li><strong>Response Time:</strong> 3-5 business days</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Refund Policy is effective as of {new Date().toLocaleDateString()} and is subject to the 
                terms outlined in our Terms & Conditions.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Refund;