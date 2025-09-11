import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Info, Clock, CheckCircle, XCircle } from "lucide-react";

const loanProviders = [
  "Capitec Bank",
  "African Bank", 
  "Standard Bank",
  "FNB Personal Loans",
  "Nedbank",
  "ABSA"
];

export default function LoanApplicationForm({ user, onSubmit, applications }) {
  const [formData, setFormData] = useState({
    loan_type: '',
    amount_requested: '',
    repayment_period: '',
    monthly_income: '',
    employment_status: '',
    purpose: '',
    provider: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        loan_type: '',
        amount_requested: '',
        repayment_period: '',
        monthly_income: '',
        employment_status: '',
        purpose: '',
        provider: ''
      });
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'declined': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'under_review': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'declined': return 'text-red-600 bg-red-50';
      case 'under_review': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Previous Applications */}
      {applications.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Your Loan Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center">
                    {getStatusIcon(app.status)}
                    <div className="ml-3">
                      <p className="font-medium">{app.loan_type} loan - R{app.amount_requested?.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{app.provider} • {new Date(app.created_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Loan Application
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Loan Type</Label>
                <Select value={formData.loan_type} onValueChange={(value) => handleChange('loan_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                    <SelectItem value="home">Home Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="education">Education Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Loan Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R</span>
                  <Input
                    type="number"
                    placeholder="50,000"
                    value={formData.amount_requested}
                    onChange={(e) => handleChange('amount_requested', e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Repayment Period</Label>
                <Select value={formData.repayment_period} onValueChange={(value) => handleChange('repayment_period', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select repayment period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                    <SelectItem value="36">36 months</SelectItem>
                    <SelectItem value="48">48 months</SelectItem>
                    <SelectItem value="60">60 months</SelectItem>
                    <SelectItem value="72">72 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monthly Income</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R</span>
                  <Input
                    type="number"
                    placeholder="25,000"
                    value={formData.monthly_income}
                    onChange={(e) => handleChange('monthly_income', e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Employment Status</Label>
                <Select value={formData.employment_status} onValueChange={(value) => handleChange('employment_status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employed">Employed</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="pensioner">Pensioner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Lender</Label>
                <Select value={formData.provider} onValueChange={(value) => handleChange('provider', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred lender" />
                  </SelectTrigger>
                  <SelectContent>
                    {loanProviders.map((provider) => (
                      <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Purpose of Loan</Label>
                <Textarea
                  placeholder="Briefly describe what you need the loan for..."
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className="h-20"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting Application...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div className="ml-3">
                  <h4 className="font-medium">Submit Application</h4>
                  <p className="text-sm text-gray-600">Complete and submit your loan application form</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div className="ml-3">
                  <h4 className="font-medium">Initial Review</h4>
                  <p className="text-sm text-gray-600">Lender reviews your application (24-48 hours)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div className="ml-3">
                  <h4 className="font-medium">Documentation</h4>
                  <p className="text-sm text-gray-600">Provide required documents and verification</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <div className="ml-3">
                  <h4 className="font-medium">Approval & Disbursement</h4>
                  <p className="text-sm text-gray-600">Receive funds directly to your bank account</p>
                </div>
              </div>
            </div>

            <Alert className="mt-6 border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Required Documents:</strong> ID copy, proof of income (payslip/bank statements), 
                proof of residence, and bank account details.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}