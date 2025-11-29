import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Disclaimer = () => {
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
            <CardTitle className="text-3xl">Disclaimer</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">IMPORTANT NOTICE</h2>
              <p className="font-semibold text-lg text-foreground uppercase">
                PLEASE READ THIS DISCLAIMER CAREFULLY BEFORE USING OUR AI-POWERED TRADING JOURNAL PLATFORM. 
                BY ACCESSING OR USING OUR SERVICE, YOU ACKNOWLEDGE AND AGREE TO THE TERMS OF THIS DISCLAIMER.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">1. No Investment Advice</h2>
              <p className="font-semibold text-foreground">
                THIS IS THE MOST CRITICAL SECTION: Our platform is a personal trade journaling and analytics tool. 
                It is NOT financial advice, investment advisory, or portfolio management.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>No Buy/Sell Signals:</strong> We do NOT provide trading signals, stock recommendations, or investment advice</li>
                <li><strong>Educational Purpose Only:</strong> All trade analysis, AI insights, and performance metrics are for personal education and record-keeping</li>
                <li><strong>Not Licensed Advisors:</strong> We are NOT registered as investment advisors, financial planners, or broker-dealers</li>
                <li><strong>No Guarantee of Profits:</strong> Using our platform does not guarantee trading success or profits</li>
                <li><strong>Your Responsibility:</strong> You are solely responsible for your own trading decisions</li>
                <li><strong>Consult Professionals:</strong> Always consult with licensed financial advisors before making investment decisions</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                Any trade data, insights, or patterns identified by our AI are for your personal analysis only and 
                should NOT be interpreted as investment recommendations.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Trading Risks</h2>
              <p className="font-semibold text-foreground uppercase">
                WARNING: Trading and investing involve substantial risk of loss and are not suitable for everyone.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Risk of Loss:</strong> You can lose some or all of your invested capital</li>
                <li><strong>Past Performance:</strong> Historical performance does NOT guarantee future results</li>
                <li><strong>Volatility:</strong> Markets are unpredictable and can move against your positions rapidly</li>
                <li><strong>Leverage Risks:</strong> Trading with leverage amplifies both gains and losses</li>
                <li><strong>Emotional Factors:</strong> Fear, greed, and stress can negatively impact trading decisions</li>
                <li><strong>No Guaranteed Outcomes:</strong> No trading strategy guarantees profits</li>
              </ul>
              <p className="mt-4 font-semibold text-foreground">
                Only trade with capital you can afford to lose. Never risk money you need for essential expenses 
                (rent, food, medical bills, etc.).
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. AI Insights & Analysis</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>No Guarantees:</strong> AI-generated insights are based on historical data and patterns, not predictions</li>
                <li><strong>Algorithmic Limitations:</strong> AI models can be wrong, biased, or misinterpret market conditions</li>
                <li><strong>Not Financial Advice:</strong> AI insights are for educational purposes, not investment recommendations</li>
                <li><strong>Human Judgment Required:</strong> Always apply critical thinking and independent analysis</li>
                <li><strong>Pattern Recognition Only:</strong> AI identifies patterns in your past trades, not future market movements</li>
                <li><strong>No Liability:</strong> We are not responsible for losses incurred from following AI suggestions</li>
              </ul>
              <p className="mt-4">
                AI technology is a tool to assist your learning process, not a replacement for sound trading judgment.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Accuracy of Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>User-Generated Data:</strong> Trade data and performance metrics are based on your manual entries</li>
                <li><strong>No Verification:</strong> We do not verify the accuracy of trade data you input</li>
                <li><strong>Third-Party Data:</strong> If using broker integrations, data accuracy depends on the broker's API</li>
                <li><strong>Calculation Errors:</strong> While we strive for accuracy, calculation errors may occur</li>
                <li><strong>No Real-Time Data:</strong> Unless explicitly stated, data is not real-time market data</li>
                <li><strong>Your Responsibility:</strong> Verify all data and calculations independently</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. No Warranty or Guarantees</h2>
              <p className="font-semibold text-foreground uppercase">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>No Service Guarantee:</strong> We do not guarantee uninterrupted, error-free, or secure service</li>
                <li><strong>No Outcome Guarantee:</strong> We do not guarantee trading success or improved performance</li>
                <li><strong>No Data Loss Guarantee:</strong> While we implement backups, data loss may occur</li>
                <li><strong>No Feature Guarantee:</strong> Features may change, be removed, or not work as expected</li>
                <li><strong>No Uptime Guarantee:</strong> Service interruptions may occur due to maintenance or technical issues</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Third-Party Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Broker Integrations:</strong> We are not responsible for broker API failures or data inaccuracies</li>
                <li><strong>Payment Processors:</strong> Payment issues with Stripe/Razorpay are outside our control</li>
                <li><strong>External Links:</strong> We are not responsible for content on third-party websites</li>
                <li><strong>No Endorsement:</strong> Integration with third-party services does not constitute endorsement</li>
                <li><strong>Separate Terms:</strong> Third-party services have their own terms and privacy policies</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
              <p className="font-semibold text-foreground uppercase">
                TO THE FULLEST EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY DAMAGES WHATSOEVER.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Trading Losses:</strong> We are NOT liable for financial losses from your trading decisions</li>
                <li><strong>Data Loss:</strong> We are not liable for loss of trade data, screenshots, or account information</li>
                <li><strong>Service Interruptions:</strong> We are not liable for damages from service downtime or outages</li>
                <li><strong>Security Breaches:</strong> While we implement security measures, we are not liable for unauthorized access</li>
                <li><strong>Third-Party Issues:</strong> We are not liable for problems with integrated services or broker APIs</li>
                <li><strong>Indirect Damages:</strong> We are not liable for consequential, incidental, or punitive damages</li>
                <li><strong>Maximum Liability:</strong> Our total liability is limited to the subscription fees you paid in the last 12 months</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Regulatory Compliance</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Your Jurisdiction:</strong> You are responsible for complying with trading laws in your country</li>
                <li><strong>Tax Obligations:</strong> You are responsible for reporting trading income and paying taxes</li>
                <li><strong>No Legal Advice:</strong> We do not provide tax, accounting, or legal advice</li>
                <li><strong>Broker Requirements:</strong> You are responsible for using licensed, regulated brokers</li>
                <li><strong>No SEBI/SEC Registration:</strong> We are not registered with securities regulators</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. User Responsibility</h2>
              <p>By using our platform, you acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have read and understood this Disclaimer in full</li>
                <li>You accept all risks associated with trading and investing</li>
                <li>You will not hold us liable for any trading losses or adverse outcomes</li>
                <li>You are using the platform for personal journaling and education only</li>
                <li>You will conduct independent research before making trading decisions</li>
                <li>You understand that our service is NOT a substitute for professional financial advice</li>
                <li>You are 18+ years old and legally allowed to trade in your jurisdiction</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Forward-Looking Statements</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any projections, forecasts, or future-oriented statements are speculative</li>
                <li>AI predictions or pattern analysis do not guarantee future market behavior</li>
                <li>Historical patterns may not repeat in the future</li>
                <li>Market conditions change constantly and past data may not be relevant</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Community & User-Generated Content</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Not Vetted:</strong> User-shared trades, strategies, and discussions are not verified by us</li>
                <li><strong>No Endorsement:</strong> Shared content does not represent our views or recommendations</li>
                <li><strong>Use at Your Own Risk:</strong> Do not blindly follow other users' strategies or trades</li>
                <li><strong>Not Financial Advice:</strong> Community discussions are educational, not investment guidance</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Technical Errors & Bugs</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Software may contain bugs, errors, or inaccuracies</li>
                <li>Calculations may be incorrect due to coding errors</li>
                <li>Charts and visualizations may render incorrectly</li>
                <li>We strive to fix issues quickly but cannot guarantee error-free service</li>
                <li>Report bugs to support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Changes to Service</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We reserve the right to modify, suspend, or discontinue the service at any time</li>
                <li>Features may be added, changed, or removed without notice</li>
                <li>Pricing and subscription plans may change (existing subscribers notified in advance)</li>
                <li>We may impose usage limits or restrictions as needed</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Indemnification</h2>
              <p>
                You agree to indemnify and hold us harmless from any claims, damages, losses, or expenses (including 
                legal fees) arising from:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your use or misuse of the platform</li>
                <li>Your trading decisions or financial losses</li>
                <li>Your violation of these Terms or applicable laws</li>
                <li>Your violation of third-party rights</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">15. Professional Advice Recommendation</h2>
              <p className="font-semibold text-foreground">
                Before making any financial decisions, we strongly recommend consulting with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Licensed financial advisors or investment professionals</li>
                <li>Certified public accountants (CPAs) for tax advice</li>
                <li>Legal counsel for regulatory compliance questions</li>
                <li>Registered broker-dealers for investment execution</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">16. Jurisdiction-Specific Disclaimers</h2>

              <h3 className="text-lg font-semibold mt-4">India</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>This platform is NOT registered with SEBI (Securities and Exchange Board of India)</li>
                <li>We do NOT offer SEBI-regulated investment advisory services</li>
                <li>Users must comply with Indian income tax laws for capital gains reporting</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">United States</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>This platform is NOT registered with the SEC (Securities and Exchange Commission)</li>
                <li>We do NOT offer SEC-regulated investment advisory services</li>
                <li>Pattern Day Trading (PDT) rules apply - consult your broker</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">European Union</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>We are NOT regulated under MiFID II (Markets in Financial Instruments Directive)</li>
                <li>No investment advice or portfolio management services are provided</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">17. Contact Information</h2>
              <p>If you have questions about this Disclaimer:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Email:</strong> legal@yourtradingjournal.com</li>
                <li><strong>Support:</strong> support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">18. Acceptance of Disclaimer</h2>
              <p className="font-semibold text-foreground">
                BY USING OUR PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO THIS DISCLAIMER. 
                IF YOU DO NOT AGREE, YOU MUST DISCONTINUE USE IMMEDIATELY.
              </p>
              <p className="mt-4">
                This Disclaimer is part of our Terms & Conditions and should be read in conjunction with our Privacy 
                Policy, Refund Policy, and other legal documents.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Disclaimer is effective as of {new Date().toLocaleDateString()} and may be updated periodically. 
                Continued use after updates constitutes acceptance of the revised Disclaimer.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Disclaimer;