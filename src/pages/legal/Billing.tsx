import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillingPolicy = () => {
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
            <CardTitle className="text-3xl">Subscription Billing Policy</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                This Subscription Billing Policy explains how billing works for your Trading Journal subscription, 
                including payment processing, billing cycles, renewals, upgrades, downgrades, and cancellations. 
                By subscribing to our service, you agree to these billing terms.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Subscription Plans</h2>
              <p>We offer the following subscription tiers:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Free Plan:</strong> Limited features, no payment required</li>
                <li><strong>Basic Plan:</strong> Core journaling features with limited AI insights</li>
                <li><strong>Pro Plan:</strong> Advanced analytics, unlimited AI insights, and integrations</li>
                <li><strong>Premium Plan:</strong> All Pro features plus priority support and custom features</li>
                <li><strong>Enterprise Plan:</strong> Custom pricing for teams and organizations</li>
              </ul>
              <p className="mt-4">
                All paid plans are available on <strong>monthly</strong> or <strong>yearly</strong> billing cycles. 
                Yearly plans typically offer a discount compared to monthly billing.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Payment Methods</h2>
              <p>We accept the following payment methods based on your region:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, American Express, Rupay (processed via Stripe/Razorpay)</li>
                <li><strong>UPI:</strong> All UPI-enabled apps for Indian users</li>
                <li><strong>Net Banking:</strong> Major Indian banks via Razorpay</li>
                <li><strong>International Payments:</strong> Stripe for users outside India</li>
              </ul>
              <p className="mt-4">
                Payment information is securely processed by our third-party payment partners. We do not store full 
                credit card details on our servers.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Billing Cycles & Renewal</h2>
              
              <h3 className="text-lg font-semibold mt-4">4.1 Monthly Subscriptions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Billed every 30 days from your subscription start date</li>
                <li>Automatically renews unless cancelled before the renewal date</li>
                <li>Example: Subscribe on January 15 → Next billing on February 15</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.2 Yearly Subscriptions</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Billed annually on the anniversary of your subscription start date</li>
                <li>Automatically renews unless cancelled before the renewal date</li>
                <li>Typically offers 15-20% savings compared to monthly billing</li>
                <li>Example: Subscribe on January 15, 2024 → Next billing on January 15, 2025</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.3 Automatic Renewal</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All subscriptions auto-renew by default to ensure uninterrupted service</li>
                <li>You will receive an email reminder 7 days before renewal</li>
                <li>You can cancel auto-renewal anytime from your account settings</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Payment Processing & Timing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Immediate Charge:</strong> New subscriptions are charged immediately upon signup</li>
                <li><strong>Renewal Charge:</strong> Charged on the renewal date (may take 24-48 hours to process)</li>
                <li><strong>Failed Payments:</strong> If payment fails, we retry 3 times over 7 days</li>
                <li><strong>Grace Period:</strong> 7-day grace period before service suspension for failed payments</li>
                <li><strong>Service Restoration:</strong> Update payment method and service resumes immediately</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Upgrades & Downgrades</h2>
              
              <h3 className="text-lg font-semibold mt-4">6.1 Upgrading Your Plan</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upgrades take effect immediately</li>
                <li>You are charged the prorated difference for the remaining billing period</li>
                <li>Your next renewal will be at the new plan price</li>
                <li>Example: Upgrade from Basic ($10/mo) to Pro ($30/mo) mid-cycle → Pay prorated $10 for 15 days remaining</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">6.2 Downgrading Your Plan</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Downgrades take effect at the end of the current billing period</li>
                <li>You continue to enjoy current plan benefits until renewal</li>
                <li>No refunds or credits issued for downgrade requests</li>
                <li>Data exceeding new plan limits (e.g., AI usage) may be restricted after downgrade</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">6.3 Switching Billing Cycles</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can switch from monthly to yearly (or vice versa) anytime</li>
                <li>Changes take effect at the end of the current billing period</li>
                <li>No prorated refunds when switching from yearly to monthly</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Cancellation Policy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can cancel your subscription anytime from account settings</li>
                <li>No cancellation fees or penalties</li>
                <li>Access continues until the end of your current billing period</li>
                <li>No refunds for the remaining days of a partially used billing cycle</li>
                <li>After cancellation, your account reverts to the Free plan</li>
                <li>Your trade data is retained for 90 days after cancellation, then permanently deleted</li>
              </ul>
              <p className="mt-4">
                <strong>Important:</strong> Cancellation must be done before the renewal date to avoid being charged 
                for the next billing cycle. Cancellations made after renewal are not eligible for refunds (except as 
                outlined in the Refund Policy).
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Free Trials</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>New users may receive a 7-14 day free trial for paid plans</li>
                <li>Payment information is required upfront for trial activation</li>
                <li>You will NOT be charged during the trial period</li>
                <li>Auto-renewal begins after the trial ends unless cancelled</li>
                <li>Cancel anytime during the trial with no charges</li>
                <li>Free trials are limited to one per user/email address</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Taxes & Additional Fees</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>GST (India):</strong> 18% GST is added to all subscription prices for Indian users</li>
                <li><strong>VAT (EU):</strong> Applicable VAT rates for European Union users</li>
                <li><strong>Sales Tax (US):</strong> State-specific sales tax where applicable</li>
                <li><strong>Currency Conversion:</strong> International payments may incur currency conversion fees by your bank</li>
                <li><strong>Payment Gateway Fees:</strong> Included in the subscription price (no extra charges)</li>
              </ul>
              <p className="mt-4">
                All prices displayed include applicable taxes. Invoices are generated automatically and sent via email.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Invoices & Receipts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Invoices are automatically generated after each payment</li>
                <li>Sent to your registered email address within 24 hours</li>
                <li>Accessible from your account dashboard under "Billing History"</li>
                <li>Include GST/Tax details for compliance and expense reporting</li>
                <li>Company name and GST number can be added in billing settings for business users</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Payment Failures & Account Suspension</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Retry Attempts:</strong> We automatically retry failed payments 3 times over 7 days</li>
                <li><strong>Notification:</strong> You'll receive email alerts for each failed attempt</li>
                <li><strong>Grace Period:</strong> 7-day grace period to update payment method</li>
                <li><strong>Service Suspension:</strong> After grace period, access to premium features is suspended</li>
                <li><strong>Account Downgrade:</strong> Account reverts to Free plan after 30 days of non-payment</li>
                <li><strong>Restoration:</strong> Update payment method to immediately restore access</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Promotional Offers & Discounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Promotional codes can be applied during checkout</li>
                <li>Discounts apply to the first billing cycle only (unless specified)</li>
                <li>Cannot be combined with other offers or existing subscriptions</li>
                <li>Limited to one use per user/account</li>
                <li>Discounts do not apply to renewal periods after expiration</li>
                <li>Promotional terms are subject to change without notice</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Price Changes</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We reserve the right to change subscription prices at any time</li>
                <li>Price increases do NOT affect existing subscribers during their current billing cycle</li>
                <li>You will be notified 30 days in advance of any price changes affecting your renewal</li>
                <li>You may cancel before renewal to avoid the new pricing</li>
                <li>Continued use after notification constitutes acceptance of the new price</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Refund Policy Reference</h2>
              <p>
                For detailed information on refunds and eligible circumstances, please refer to our separate 
                <strong> Refund Policy</strong>. Key points:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No refunds after subscription renewal (unless required by law)</li>
                <li>Refunds available for accidental duplicate payments</li>
                <li>Refunds processed within 7-10 business days</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">15. Enterprise & Custom Plans</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Custom billing arrangements available for Enterprise customers</li>
                <li>Annual contracts with flexible payment terms (quarterly, yearly)</li>
                <li>Custom invoicing and purchase order (PO) support</li>
                <li>Dedicated account manager for billing inquiries</li>
                <li>Contact sales@yourtradingjournal.com for Enterprise pricing</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">16. Contact Billing Support</h2>
              <p>For billing questions, payment issues, or invoice requests:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> billing@yourtradingjournal.com</li>
                <li><strong>General Support:</strong> support@yourtradingjournal.com</li>
                <li><strong>Response Time:</strong> 24-48 hours for billing inquiries</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">17. Legal & Compliance</h2>
              <p>
                This Subscription Billing Policy is subject to the terms outlined in our <strong>Terms & Conditions</strong>. 
                By subscribing, you agree to both policies. Disputes related to billing are governed by Indian law and 
                subject to arbitration as outlined in our Terms.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Subscription Billing Policy is effective as of {new Date().toLocaleDateString()} and applies 
                to all subscription transactions on the Trading Journal platform.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPolicy;