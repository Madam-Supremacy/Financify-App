import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, PartyPopper } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    phone_number: '',
    monthly_budget: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await User.me();
        if (userData.phone_number) {
          // If user already has a phone number, they've completed onboarding
          navigate(createPageUrl("Dashboard"));
        } else {
          setUser(userData);
          setIsLoading(false);
        }
      } catch (error) {
        // Not authenticated, go to landing
        navigate(createPageUrl("Landing"));
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone_number) {
      alert("Please enter your phone number.");
      return;
    }
    setIsLoading(true);
    try {
      const updateData = {
        phone_number: formData.phone_number,
      };
      if (formData.monthly_budget) {
        updateData.monthly_budget = parseFloat(formData.monthly_budget);
      }
      await User.updateMyUserData(updateData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Failed to update user data:", error);
      alert("There was an error saving your information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-4">
            <PartyPopper className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to Byte Finance, {user.full_name?.split(' ')[0]}!</CardTitle>
          <CardDescription>Let's get your account set up in just a moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                type="tel"
                placeholder="e.g., 082 123 4567"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_budget">Monthly Budget (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R</span>
                <Input
                  id="monthly_budget"
                  type="number"
                  step="100"
                  placeholder="e.g., 15000"
                  value={formData.monthly_budget}
                  onChange={handleChange}
                  className="pl-8"
                />
              </div>
               <p className="text-xs text-gray-500">You can always change this later in your profile.</p>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Continue to Dashboard"}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
