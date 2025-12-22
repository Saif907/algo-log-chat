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
            <p className="text-sm text-muted-foreground">Last Updated: December 22, 2025</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                This Cookie Policy explains how our AI-powered Trading Journal platform uses cookies and similar 
                tracking technologies. By using our service, you consent to the use of cookies as described in this 
                policy.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. What are Cookies?</h2>
              <p>
                Cookies are small text files that are stored on your device (computer or mobile) when you visit a 
                website. They allow the website to recognize your device and remember your preferences and actions 
                over time.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. How We Use Cookies</h2>
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Necessary for the website to function (e.g., login sessions).</li>
                <li><strong>Performance Cookies:</strong> To analyze how users use our site and improve performance.</li>
                <li><strong>Functional Cookies:</strong> To remember your preferences (e.g., theme, language).</li>
                <li><strong>Analytics Cookies:</strong> To track metrics like visitor count and page views.</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Types of Cookies We Use</h2>
              <h3 className="text-lg font-semibold mt-4">4.1 Session Cookies</h3>
              <p>These are temporary cookies that expire when you close your browser.</p>

              <h3 className="text-lg font-semibold mt-4">4.2 Persistent Cookies</h3>
              <p>These remain on your device for a set period or until you delete them.</p>

              <h3 className="text-lg font-semibold mt-4">4.3 Third-Party Cookies</h3>
              <p>
                Cookies set by third-party services we use, such as payment processors or analytics providers.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Managing Cookies</h2>
              <p>
                You can control and manage cookies through your browser settings. You can choose to block or delete 
                cookies, but please note that doing so may affect the functionality of our Service.
              </p>
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
                <li><strong>Privacy Officer:</strong> saifshaikh@tradeomen.com</li>
                <li><strong>Support:</strong> support@tradeomen.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                This Cookie Policy is effective as of December 22, 2025 and applies to all users 
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