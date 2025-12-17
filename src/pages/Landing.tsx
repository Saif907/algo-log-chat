import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, BarChart3, Brain, Shield, Calendar, 
  Layers, BookOpen, MessageSquare, ChevronRight, 
  Play, Check, Star, Zap, Lock, LineChart,
  Target, Award, ArrowRight, Menu, X
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Trade Journal",
    description: "Log every trade with detailed entry/exit points, screenshots, and emotional states. Never forget what worked."
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI analyzes your patterns, identifies mistakes, and provides personalized coaching to improve your edge."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep dive into your performance with R-multiples, win rates, drawdowns, and custom metrics."
  },
  {
    icon: BookOpen,
    title: "Playbook System",
    description: "Create and track strategies. Know exactly which setups make money and which don't."
  },
  {
    icon: Calendar,
    title: "Trade Calendar",
    description: "Visual calendar view of your trading activity. Spot patterns in your best and worst days."
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Track risk per trade, position sizing, and portfolio exposure. Stay disciplined."
  }
];

const testimonials = [
  {
    name: "Alex Thompson",
    role: "Day Trader",
    content: "TradeOmen transformed my trading. The AI insights helped me identify that I was overtrading on Mondays. My win rate improved by 23%.",
    avatar: "AT"
  },
  {
    name: "Sarah Chen",
    role: "Swing Trader",
    content: "Finally a journal that understands traders. The playbook feature alone saved me thousands by showing which setups to avoid.",
    avatar: "SC"
  },
  {
    name: "Michael Roberts",
    role: "Options Trader",
    content: "The psychology tracking is game-changing. I can now see exactly how emotions affect my P&L. Worth every penny.",
    avatar: "MR"
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["50 trades/month", "Basic analytics", "Trade calendar", "Community access"],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious traders",
    features: ["Unlimited trades", "AI analysis & coaching", "Advanced analytics", "Playbook system", "Priority support", "Export data"],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    description: "For trading teams",
    features: ["Everything in Pro", "Team dashboards", "Shared playbooks", "Admin controls", "API access", "Custom integrations"],
    cta: "Contact Sales",
    popular: false
  }
];

const stats = [
  { value: "50K+", label: "Active Traders" },
  { value: "$2.3B", label: "Trades Analyzed" },
  { value: "34%", label: "Avg. Improvement" },
  { value: "4.9/5", label: "User Rating" }
];

export const Landing = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl">TradeOmen</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Demo</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Log In
              </Button>
              <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
                Get Started Free
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">Features</a>
              <a href="#demo" className="block text-sm text-muted-foreground hover:text-foreground">Demo</a>
              <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">Pricing</a>
              <a href="#testimonials" className="block text-sm text-muted-foreground hover:text-foreground">Reviews</a>
              <div className="pt-3 border-t border-border space-y-2">
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>Log In</Button>
                <Button className="w-full" onClick={() => navigate("/auth")}>Get Started Free</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              AI-Powered Trading Journal
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Turn Your Trading Data Into
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"> Profitable Insights</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The smart trading journal that analyzes your patterns, identifies your mistakes, and helps you become consistently profitable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth")} className="w-full sm:w-auto px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">See TradeOmen in Action</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch how traders use our platform to improve their performance
            </p>
          </div>
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <Play className="h-5 w-5" />
                Play Demo Video
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Trade Better</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed by traders, for traders. Stop guessing and start improving.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Lock className="h-3 w-3 mr-1.5" />
                Security First
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Your Data, Your Privacy</h2>
              <p className="text-muted-foreground mb-8">
                We take your privacy seriously. Your trading data is encrypted, never shared, and always under your control.
              </p>
              <div className="space-y-4">
                {[
                  "256-bit AES encryption for all data",
                  "SOC 2 Type II certified",
                  "GDPR compliant",
                  "No data selling, ever",
                  "Export your data anytime"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-card border-border/50 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Bank-Level Security</div>
                    <div className="text-sm text-muted-foreground">Your data is protected 24/7</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Encryption</span>
                    <span className="text-success font-medium">Active</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Two-Factor Auth</span>
                    <span className="text-success font-medium">Enabled</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Backup Status</span>
                    <span className="text-success font-medium">Synced</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Traders Worldwide</h2>
            <p className="text-muted-foreground">Join thousands of traders who improved their performance with TradeOmen</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-card/50 border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">Start free, upgrade when you're ready</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <Card key={i} className={`relative bg-card border-border/50 ${plan.popular ? 'border-primary ring-1 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-lg font-semibold mb-2">{plan.name}</div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <Button 
                    className="w-full mb-6" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                  <div className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of traders who are already using TradeOmen to improve their performance and achieve consistent profitability.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")} className="px-8">
            Start Your Free Trial
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-bold text-xl">TradeOmen</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The AI-powered trading journal that helps you become a better trader.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="block hover:text-foreground">Features</a>
                <a href="#pricing" className="block hover:text-foreground">Pricing</a>
                <a href="#demo" className="block hover:text-foreground">Demo</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground">About</a>
                <a href="#" className="block hover:text-foreground">Blog</a>
                <a href="#" className="block hover:text-foreground">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/legal/privacy" className="block hover:text-foreground">Privacy</a>
                <a href="/legal/terms" className="block hover:text-foreground">Terms</a>
                <a href="/legal/cookies" className="block hover:text-foreground">Cookies</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TradeOmen. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
