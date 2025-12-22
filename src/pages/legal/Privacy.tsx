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
            <p className="text-sm text-muted-foreground">Last Updated: December 22, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                Welcome to TradeOmen ("we," "us," or "our"). This Privacy Policy explains 
                how we collect, use, store, and protect your personal information when you use our web-based trading 
                journal service.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mt-4">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, password, phone number (optional)</li>
                <li><strong>Trading Data:</strong> Trade entries (symbol, prices, notes, P&L)</li>
                <li><strong>Screenshots:</strong> Charts and images uploaded to the platform</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">2.2 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Login times, pages visited, features used, and interaction metrics</li>
                <li><strong>Device Data:</strong> IP address, browser type, operating system, and device identifiers</li>
                <li><strong>Cookies:</strong> Data collected via cookies as described in our Cookie Policy</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide, maintain, and improve our Service</li>
                <li>To generate AI-powered insights and trade analysis</li>
                <li>To process payments and manage subscriptions</li>
                <li>To communicate with you regarding updates, security alerts, and support</li>
                <li>To detect and prevent fraud, abuse, and security incidents</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Data Sharing and Disclosure</h2>
              <p>We do not sell your personal data. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> Third-party vendors who assist with hosting, payments (e.g., Stripe), and analytics</li>
                <li><strong>Legal Requirements:</strong> If required by law, court order, or government authority</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, sale, or asset transfer</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. AI and Data Processing</h2>
              <p>
                Our platform uses Artificial Intelligence (AI) to analyze your trading data. By using the Service, 
                you acknowledge that your trade data (but not personal identification) may be processed by our AI 
                models to generate insights. We prioritize privacy and do not use your data to train public models 
                without your explicit consent.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Data Security</h2>
              <p>
                We implement robust security measures including encryption, access controls, and secure infrastructure 
                to protect your data. However, no method of transmission over the internet is 100% secure, and we 
                cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Data Retention</h2>
              <p>
                We retain your personal information as long as your account is active or as needed to provide the 
                Service. You may request deletion of your account and data at any time.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, correct, or delete your personal data</li>
                <li>Restrict or object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Children's Privacy</h2>
              <p>
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal 
                information from children.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. International Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We take 
                steps to ensure your data is treated securely and in accordance with this policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Third-Party Links</h2>
              <p>
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices 
                or content of such sites.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Contact Us</h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, 
                please contact us:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Privacy Officer:</strong> saifshaikh@tradeomen.com</li>
                <li><strong>Data Protection (DPO):</strong> saifshaikh@tradeomen.com</li>
                <li><strong>General Support:</strong> support@tradeomen.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">14. Governing Law</h2>
              <p>
                This Privacy Policy is governed by the laws of India. Any disputes arising from this policy will be 
                subject to the exclusive jurisdiction of courts in Chhatrapati Sambhajinagar, Maharashtra, India.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                By using TradeOmen, you acknowledge that you have read, understood, and agree 
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