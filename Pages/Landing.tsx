import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Shield, 
  TrendingUp, 
  MessageCircle, 
  PiggyBank,
  Smartphone,
  ArrowRight,
  Check,
  Star
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Smart Payments",
    description: "Send money instantly to friends and family with just a tap. Secure, fast, and fee-free transfers."
  },
  {
    icon: PiggyBank,
    title: "Savings Goals",
    description: "Set and track your financial goals. Our AI helps you save automatically based on your spending patterns."
  },
  {
    icon: TrendingUp,
    title: "Investment Portfolio",
    description: "Build wealth with personalized investment recommendations powered by advanced algorithms."
  },
  {
    icon: MessageCircle,
    title: "AI Assistant",
    description: "Get instant financial advice, track expenses, and manage your money with our intelligent chatbot."
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your financial data is protected with 256-bit encryption and biometric authentication."
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Designed for your lifestyle. Manage your finances anywhere, anytime, with our intuitive mobile app."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    content: "Byte Finance has completely transformed how I manage my finances. The AI insights are incredibly helpful!",
    rating: 5
  },
  {
    name: "Marcus Johnson",
    role: "Small Business Owner",
    content: "The payment system is so smooth. My customers love how easy it is to pay me through the app.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "Graduate Student",
    content: "Finally reached my savings goal thanks to the automatic budgeting features. Couldn't be happier!",
    rating: 5
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const checkExistingUser = useCallback(async () => {
    try {
      const userData = await User.me();
      // If user is authenticated, check if they need onboarding
      // Assuming userData includes a phone_number property that signifies completed onboarding
      if (userData && userData.phone_number) {
        navigate(createPageUrl("Dashboard"));
      } else {
        navigate(createPageUrl("Onboarding"));
      }
    } catch (error) {
      // User not authenticated, stay on landing page
      // Or if User.me() fails, it implies no authenticated user, so nothing to do here.
    }
  }, [navigate]);

  useEffect(() => {
    // Check if the user is coming back from a login redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('fromLogin')) {
        checkExistingUser();
    }
  }, [checkExistingUser]);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      // Redirect to login, then come back here to check onboarding status
      // We append ?fromLogin=true to the callback URL so useEffect can detect return from login.
      const callbackUrl = `${window.location.origin}${createPageUrl('Landing')}?fromLogin=true`;
      
      // Assuming User.loginWithRedirect method exists and handles the authentication redirect
      await User.loginWithRedirect(callbackUrl);
      // The page will redirect, so no need to set isLoading(false) here,
      // unless an error occurs before the redirect.
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false); // Only set loading false if loginWithRedirect fails before actual redirect
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <style>
        {`
          :root {
            --primary-navy: #1e3a8a;
            --primary-blue: #1e40af;
            --accent-yellow: #fbbf24;
            --accent-yellow-light: #fef3c7;
          }
        `}
      </style>

      {/* Header */}
      <header className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <nav className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">Byte Finance</span>
            </div>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-900"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login / Sign Up"}
            </Button>
          </nav>

          {/* Hero Section */}
          <div className="py-20 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Money,
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent block">
                  Simplified
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of personal finance with AI-powered insights, 
                instant payments, and smart savings goals all in one beautiful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-4 text-lg"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                >
                  {isLoading ? "Redirecting to login..." : "Get Started Free"}
                  {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-yellow-400 opacity-10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-400 opacity-10 rounded-full translate-y-36 -translate-x-36"></div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage your finances
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From payments to investments, we've got you covered with cutting-edge technology and intuitive design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by thousands of users
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their Byte Finance experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-8 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Join thousands of users who have already transformed their financial lives with Byte Finance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 hover:from-yellow-500 hover:to-yellow-600 font-semibold px-8 py-4 text-lg"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? "Redirecting to login..." : "Start Your Journey"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-blue-200">
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Free to get started
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              No hidden fees
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-2" />
              Bank-level security
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-lg font-bold">Byte Finance</span>
            </div>
            <p className="text-gray-400 text-center">
              © 2024 Byte Finance. All rights reserved. Made with ❤️ for your financial success.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
