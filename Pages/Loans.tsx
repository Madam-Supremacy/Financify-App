import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { LoanApplication } from "@/entities/LoanApplication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  AlertTriangle, 
  Calculator,
  Building2,
  CreditCard,
  BarChart3 
} from "lucide-react";
import { toast } from "sonner"; // New import

import LoanCalculator from "../components/loans/LoanCalculator";
import VerifiedLenders from "../components/loans/VerifiedLenders";
import ScamWarnings from "../components/loans/ScamWarnings";
import LoanApplicationForm from "../components/loans/LoanApplicationForm";
import CreditScoreCheck from "../components/loans/CreditScoreCheck";

export default function Loans() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("browse");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const userApplications = await LoanApplication.filter({ user_id: userData.id }, "-created_date");
      setApplications(userApplications);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleLoanApplication = async (applicationData) => {
    try {
      await LoanApplication.create({
        user_id: user.id,
        ...applicationData
      });
      
      loadData(); // Refresh applications
      toast.success("Loan application submitted successfully!", { // Changed from alert
        description: "You'll hear back within 24-48 hours.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again."); // Changed from alert
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Safe Loan Services
          </h1>
          <p className="text-gray-600">
            Connect with verified lenders and protect yourself from loan scams
          </p>
        </div>

        {/* Security Alert */}
        <Alert className="mb-8 border-green-200 bg-green-50">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Your Safety First:</strong> We only connect you with registered financial institutions and NCR-compliant lenders. 
            All loan providers are verified and regulated by the National Credit Regulator.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Browse Lenders
            </TabsTrigger>
            {/* New Credit Score Tab */}
            <TabsTrigger value="credit" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Credit Score
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Safety Tips
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Apply
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <VerifiedLenders />
          </TabsContent>

          {/* New Credit Score Content */}
          <TabsContent value="credit" className="space-y-6">
            <CreditScoreCheck user={user} />
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <LoanCalculator />
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <ScamWarnings />
          </TabsContent>

          <TabsContent value="apply" className="space-y-6">
            <LoanApplicationForm 
              user={user}
              onSubmit={handleLoanApplication}
              applications={applications}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
