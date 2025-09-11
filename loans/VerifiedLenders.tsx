import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Star, ExternalLink, Building2, AlertTriangle } from "lucide-react";

const verifiedLenders = [
  {
    name: "Capitec Bank",
    logo: "🏦",
    rating: 4.5,
    minAmount: 1000,
    maxAmount: 250000,
    interestRate: "20.5% - 27.5%",
    features: ["Quick approval", "Flexible terms", "No hidden fees"],
    trustScore: "Excellent",
    ncrRegistered: true,
    description: "One of SA's most trusted banks with competitive personal loan rates."
  },
  {
    name: "African Bank",
    logo: "🏛️", 
    rating: 4.3,
    minAmount: 2000,
    maxAmount: 300000,
    interestRate: "19.5% - 24.75%",
    features: ["Same day approval", "Debt consolidation", "Personal loans"],
    trustScore: "Excellent",
    ncrRegistered: true,
    description: "Specialized personal loan provider with flexible repayment options."
  },
  {
    name: "Standard Bank",
    logo: "🏪",
    rating: 4.2,
    minAmount: 5000,
    maxAmount: 500000,
    interestRate: "18.25% - 26.75%",
    features: ["Online application", "Quick decisions", "Existing client benefits"],
    trustScore: "Excellent",
    ncrRegistered: true,
    description: "Major bank with comprehensive loan products and competitive rates."
  },
  {
    name: "FNB Personal Loans",
    logo: "🏢",
    rating: 4.1,
    minAmount: 3000,
    maxAmount: 350000,
    interestRate: "20.75% - 28.5%",
    features: ["Digital application", "Flexible repayment", "Pre-approval available"],
    trustScore: "Very Good",
    ncrRegistered: true,
    description: "Digital-first approach with streamlined loan application process."
  }
];

export default function VerifiedLenders() {
  const getTrustColor = (score) => {
    switch (score) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Very Good': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
            NCR Registered & Verified Lenders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            All lenders listed below are registered with the National Credit Regulator (NCR) and 
            comply with South African lending laws. They offer transparent terms and consumer protection.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-white rounded-lg">
              <ShieldCheck className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="font-medium">NCR Compliance</p>
                <p className="text-sm text-gray-600">All lenders are registered</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-white rounded-lg">
              <Building2 className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Established Banks</p>
                <p className="text-sm text-gray-600">Trusted financial institutions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {verifiedLenders.map((lender, index) => (
          <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{lender.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{lender.name}</CardTitle>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(lender.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{lender.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getTrustColor(lender.trustScore)}>
                    {lender.trustScore}
                  </Badge>
                  {lender.ncrRegistered && (
                    <div className="flex items-center mt-1 text-xs text-green-600">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      NCR Registered
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{lender.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Loan Amount:</span>
                  <span className="text-sm font-medium">R{lender.minAmount.toLocaleString()} - R{lender.maxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Interest Rate:</span>
                  <span className="text-sm font-medium">{lender.interestRate}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Key Features:</p>
                <div className="flex flex-wrap gap-2">
                  {lender.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit {lender.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg border-0 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-yellow-800">Important Reminder</h3>
          </div>
          <p className="text-yellow-700 text-sm">
            Remember to compare offers from multiple lenders and read all terms and conditions carefully. 
            Never pay upfront fees for loan applications - legitimate lenders don't require this.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
