
import React, { useState, useEffect, useCallback } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw,
  CreditCard,
  Calendar,
  Percent
} from "lucide-react";

const mockCreditData = {
  score: 685,
  rating: "Good",
  factors: [
    { factor: "Payment History", impact: "Positive", description: "You make payments on time" },
    { factor: "Credit Utilization", impact: "Neutral", description: "Using 45% of available credit" },
    { factor: "Length of Credit History", impact: "Positive", description: "7 years average account age" },
    { factor: "Credit Mix", impact: "Positive", description: "Good variety of credit types" },
    { factor: "New Credit", impact: "Negative", description: "Recent credit inquiries" }
  ],
  recommendations: [
    "Keep credit card balances below 30% of your limit",
    "Continue making all payments on time",
    "Avoid opening new credit accounts for now",
    "Consider paying down existing balances"
  ],
  loanEligibility: {
    personalLoan: { eligible: true, maxAmount: 250000, rate: "20.5% - 24.5%" },
    homeLoan: { eligible: true, maxAmount: 2000000, rate: "11.5% - 13.5%" },
    vehicleLoan: { eligible: true, maxAmount: 800000, rate: "13.5% - 16.5%" }
  }
};

export default function CreditScoreCheck({ user }) {
  const [creditData, setCreditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadCreditScore = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real app, this would connect to credit bureaus like TransUnion, Experian, etc.
      // For now, we'll use AI to generate realistic credit information
      const response = await InvokeLLM({
        prompt: `Generate a realistic South African credit score report for a user with the following profile:
        - Name: ${user.full_name}
        - Monthly income: R${user.monthly_budget || 15000}
        - Current balance: R${user.balance || 0}
        
        Include:
        1. Credit score (300-850 range)
        2. Rating (Poor, Fair, Good, Very Good, Excellent)
        3. Key factors affecting the score
        4. Loan eligibility for personal, home, and vehicle loans
        5. Improvement recommendations
        
        Make it realistic based on South African credit scoring.`,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number" },
            rating: { type: "string" },
            factors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  factor: { type: "string" },
                  impact: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Use AI response if available, otherwise fallback to mock data
      setCreditData(response.score ? response : mockCreditData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error loading credit score:", error);
      setCreditData(mockCreditData);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, [user.full_name, user.monthly_budget, user.balance]); // Dependencies for useCallback

  useEffect(() => {
    loadCreditScore();
  }, [loadCreditScore]); // Now loadCreditScore is a dependency

  const getScoreColor = (score) => {
    if (score >= 750) return "text-green-600 bg-green-50";
    if (score >= 650) return "text-blue-600 bg-blue-50";
    if (score >= 550) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getImpactIcon = (impact) => {
    switch (impact.toLowerCase()) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'negative': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <TrendingUp className="w-4 h-4 text-yellow-500" />;
    }
  };

  if (isLoading && !creditData) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Checking Your Credit Score...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creditData) return null;

  return (
    <div className="space-y-6">
      {/* Credit Score Overview */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Credit Score</h3>
              <p className="text-blue-100">
                {lastUpdated && `Updated ${lastUpdated.toLocaleDateString()}`}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={loadCreditScore}
              disabled={isLoading}
              className="text-blue-200 hover:text-white hover:bg-blue-700"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-40 h-40 rounded-full border-8 border-white border-opacity-20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold">{creditData.score}</p>
                  <p className="text-blue-100 text-sm">{creditData.rating}</p>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-white animate-pulse"></div>
            </div>
          </div>

          <div className="mt-6">
            <Progress value={(creditData.score / 850) * 100} className="h-2 bg-blue-800" />
            <div className="flex justify-between text-xs text-blue-200 mt-2">
              <span>300</span>
              <span>850</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credit Factors */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>What's Affecting Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {creditData.factors.map((factor, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getImpactIcon(factor.impact)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{factor.factor}</p>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                  </div>
                  <Badge className={
                    factor.impact.toLowerCase() === 'positive' ? 'bg-green-100 text-green-800' :
                    factor.impact.toLowerCase() === 'negative' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {factor.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loan Eligibility */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Loan Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockCreditData.loanEligibility && Object.entries(mockCreditData.loanEligibility).map(([loanType, details]) => (
                <div key={loanType} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">
                      {loanType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <Badge className={details.eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {details.eligible ? 'Eligible' : 'Not Eligible'}
                    </Badge>
                  </div>
                  {details.eligible && (
                    <div className="text-sm text-gray-600">
                      <p>Max Amount: R{details.maxAmount.toLocaleString()}</p>
                      <p>Interest Rate: {details.rate}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Improvement Tips */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            How to Improve Your Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {creditData.recommendations.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
