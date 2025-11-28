import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CommunityGuidelines = () => {
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
            <CardTitle className="text-3xl">Community Guidelines</CardTitle>
            <p className="text-sm text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Welcome to Our Community</h2>
              <p>
                Welcome to the Trading Journal community! These guidelines apply to all interactive features including 
                AI chat, forums, comments, shared trades, and any other community spaces. Our goal is to create a 
                supportive, educational, and respectful environment for traders to learn and grow together.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Core Principles</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Respect:</strong> Treat all members with courtesy, regardless of experience level</li>
                <li><strong>Learning:</strong> Foster a culture of continuous learning and knowledge sharing</li>
                <li><strong>Honesty:</strong> Share authentic experiences, both wins and losses</li>
                <li><strong>Privacy:</strong> Respect the privacy and confidentiality of other traders</li>
                <li><strong>No Financial Advice:</strong> Share experiences, not investment recommendations</li>
                <li><strong>Constructive Feedback:</strong> Provide helpful, actionable feedback without judgment</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. Expected Behavior</h2>
              
              <h3 className="text-lg font-semibold mt-4">3.1 Be Respectful & Professional</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use polite and professional language in all interactions</li>
                <li>Welcome newcomers and help them feel comfortable</li>
                <li>Acknowledge different trading styles, strategies, and risk tolerances</li>
                <li>Disagree respectfully without personal attacks or hostility</li>
                <li>Use appropriate tone in AI chat interactions</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.2 Share Knowledge Responsibly</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Share your trading experiences, lessons learned, and personal insights</li>
                <li>Provide context when sharing trade setups or analysis</li>
                <li>Clarify that shared strategies are educational, not financial advice</li>
                <li>Credit sources when sharing third-party content or analysis</li>
                <li>Focus on process and methodology rather than specific stock picks</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.3 Maintain Privacy & Confidentiality</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not share other users' trades, data, or personal information without consent</li>
                <li>Protect your own sensitive information (account balances, personal details)</li>
                <li>Be mindful about what trade details you share publicly</li>
                <li>Respect the confidential nature of AI chat conversations</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">3.4 Contribute Constructively</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Add value to discussions with thoughtful, relevant contributions</li>
                <li>Ask clarifying questions to better understand others' perspectives</li>
                <li>Share both successful and unsuccessful trades for learning purposes</li>
                <li>Provide actionable feedback when helping others improve</li>
                <li>Celebrate others' progress and milestones</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Strictly Prohibited Behavior</h2>
              
              <h3 className="text-lg font-semibold mt-4">4.1 No Financial Advice or Pump Schemes</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>NEVER</strong> provide buy/sell signals or specific investment recommendations</li>
                <li>Do not guarantee returns or promise specific outcomes from trades</li>
                <li>No pump-and-dump schemes, market manipulation, or coordinated trading</li>
                <li>Avoid "hot tips," insider information, or undisclosed paid promotions</li>
                <li>Do not position yourself as a financial advisor unless properly licensed</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.2 No Harassment or Abuse</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>No bullying, harassment, threats, or intimidation of any kind</li>
                <li>No hate speech, discrimination, or offensive content based on race, gender, religion, etc.</li>
                <li>Do not mock or ridicule others for trading losses or mistakes</li>
                <li>No doxxing (sharing private information without consent)</li>
                <li>No sexual harassment or inappropriate advances</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.3 No Spam or Self-Promotion</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>No unsolicited advertising, promotional links, or affiliate schemes</li>
                <li>Do not spam forums or chat with repetitive messages</li>
                <li>No recruiting for external trading groups, courses, or paid services without permission</li>
                <li>Avoid excessive self-promotion or boasting about trading gains</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.4 No Misinformation or Fraud</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not spread false or misleading trading information</li>
                <li>No fabricated or manipulated trade screenshots</li>
                <li>Be honest about your experience level and qualifications</li>
                <li>Do not impersonate other users, companies, or officials</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">4.5 No Platform Abuse</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not abuse AI chat by submitting spam, offensive content, or jailbreak attempts</li>
                <li>No attempts to manipulate, exploit, or hack community features</li>
                <li>Respect rate limits and fair use policies</li>
                <li>Do not create fake accounts or sockpuppets to manipulate discussions</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. AI Chat Guidelines</h2>
              <p>When using AI-powered features for trade analysis and insights:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use AI responsibly for personal learning and analysis</li>
                <li>Do not attempt to manipulate AI to generate financial advice for others</li>
                <li>Understand that AI insights are tools, not guarantees of trading success</li>
                <li>Report any AI-generated content that appears harmful or inappropriate</li>
                <li>Do not share AI chat conversations that contain sensitive information</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Moderation & Enforcement</h2>
              
              <h3 className="text-lg font-semibold mt-4">6.1 Moderation Process</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Community moderators and automated systems monitor interactions</li>
                <li>Reports are reviewed within 24-48 hours</li>
                <li>Decisions are made based on context and severity of violations</li>
                <li>Users may appeal moderation decisions through official channels</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">6.2 Consequences</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>First Offense:</strong> Warning and content removal</li>
                <li><strong>Second Offense:</strong> Temporary suspension (7-30 days)</li>
                <li><strong>Severe or Repeated Violations:</strong> Permanent ban from community features</li>
                <li><strong>Account Termination:</strong> For egregious violations (fraud, harassment, illegal activity)</li>
              </ul>
              <p className="mt-4">
                Moderation decisions do not affect your personal trade data, which remains accessible even if community 
                access is restricted.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Reporting Violations</h2>
              <p>If you witness behavior that violates these guidelines:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the "Report" button available on all community posts and comments</li>
                <li>Email: community@yourtradingjournal.com</li>
                <li>Provide context and evidence (screenshots if possible)</li>
                <li>Do not engage or retaliate against violators</li>
              </ul>
              <p className="mt-4">
                All reports are confidential and will be investigated promptly. False or malicious reports may result 
                in consequences for the reporter.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Protecting Yourself</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Critical Thinking:</strong> Evaluate all information critically before acting on it</li>
                <li><strong>Due Diligence:</strong> Research independently before making trading decisions</li>
                <li><strong>Privacy Settings:</strong> Use privacy controls to limit visibility of your trades and profile</li>
                <li><strong>Block Users:</strong> Use blocking features if you feel uncomfortable with another user</li>
                <li><strong>Report Concerns:</strong> Report suspicious or concerning behavior immediately</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Disclaimer</h2>
              <p className="font-semibold text-foreground">
                IMPORTANT: Content shared in community features reflects the personal opinions and experiences of 
                individual users. It is NOT professional financial advice and should NOT be treated as such.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>We are not responsible for trading decisions made based on community content</li>
                <li>Past performance shared by users does not guarantee future results</li>
                <li>Always consult with licensed financial advisors before making investment decisions</li>
                <li>Trade at your own risk and never risk money you cannot afford to lose</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Updates to Guidelines</h2>
              <p>
                These Community Guidelines may be updated periodically to reflect community needs and platform evolution. 
                Significant changes will be announced via email and in-platform notifications.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Contact Us</h2>
              <p>Questions about these guidelines?</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Community Team:</strong> community@yourtradingjournal.com</li>
                <li><strong>General Support:</strong> support@yourtradingjournal.com</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground italic">
                Thank you for being part of our trading community! Together, we can create a positive, educational, 
                and supportive environment where traders of all levels can learn and grow.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityGuidelines;