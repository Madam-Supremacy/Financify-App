import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield, X, Check, Phone, Mail } from "lucide-react";

const scamWarnings = [
  {
    title: "Upfront Fee Scams",
    description: "Never pay fees before receiving your loan",
    warning: "Legitimate lenders deduct fees from your loan amount, not before approval",
    icon: X
  },
  {
    title: "Guaranteed Approval Claims",
    description: "No legitimate lender guarantees approval without credit checks",
    warning: "Responsible lenders must assess your ability to repay",
    icon: X
  },
  {
    title: "Unsolicited Loan Offers",
    description: "Be wary of unexpected calls, SMS, or emails offering loans",
    warning: "Verify the company independently before providing any information",
    icon: Phone
  },
  {
    title: "No Physical Address",
    description: "Legitimate lenders have registered addresses and contact details",
    warning: "Always verify the lender's physical address and NCR registration",
    icon: Mail
  }
];

const safetyTips = [
  "Always check if the lender is registered with the National Credit Regulator (NCR)",
  "Compare interest rates and fees from multiple verified lenders",
  "Read all terms and conditions carefully before signing",
  "Never provide your banking details to unverified sources",
  "Be suspicious of lenders who don't conduct credit checks",
  "Report suspicious lenders to the NCR and financial authorities"
];

export default function ScamWarnings() {
  return (
    <div className="space-y-6">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Warning:</strong> Loan scams are common in South Africa. Protect yourself by only dealing with NCR-registered lenders 
          and never paying upfront fees for loans.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Common Loan Scams
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {scamWarnings.map((scam, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-start">
                    <scam.icon className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800">{scam.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{scam.description}</p>
                      <p className="text-xs text-red-600">{scam.warning}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center text-green-800">
              <Shield className="w-5 h-5 mr-2" />
              How to Stay Safe
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Verify a Lender
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Check NCR Registration</h4>
              <p className="text-sm text-gray-600">
                Visit the NCR website to verify the lender's registration status
              </p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Contact Verification</h4>
              <p className="text-sm text-gray-600">
                Call their official number and verify their physical address
              </p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Read Reviews</h4>
              <p className="text-sm text-gray-600">
                Check online reviews and ratings from verified customers
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Report Suspected Scams</h4>
            <p className="text-sm text-yellow-700 mb-3">
              If you encounter a suspicious lender, report them immediately:
            </p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• National Credit Regulator: 0860 627 627</li>
              <li>• South African Police Service</li>
              <li>• Banking Association of South Africa</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}