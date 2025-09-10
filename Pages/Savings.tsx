import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Target, TrendingUp, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Savings() {
  const [user, setUser] = useState(null);
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    if (!newGoalAmount || parseFloat(newGoalAmount) <= 0) {
      toast.error("Please enter a valid goal amount.");
      return;
    }

    setIsLoading(true);
    try {
      await User.updateMyUserData({ 
        savings_goal: parseFloat(newGoalAmount) 
      });
      setUser({ ...user, savings_goal: parseFloat(newGoalAmount) });
      setNewGoalAmount('');
      toast.success("Savings goal updated successfully!");
    } catch (error) {
      console.error("Error updating goal:", error);
      toast.error("Failed to update savings goal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error("Please enter a valid deposit amount.");
      return;
    }
    
    const amount = parseFloat(depositAmount);
    if (amount > (user.balance || 0)) {
      toast.error("Insufficient balance for this deposit.");
      return;
    }

    setIsLoading(true);
    try {
      const newSavings = (user.current_savings || 0) + amount;
      const newBalance = (user.balance || 0) - amount;
      
      await User.updateMyUserData({ 
        current_savings: newSavings,
        balance: newBalance
      });
      
      setUser({ 
        ...user, 
        current_savings: newSavings,
        balance: newBalance
      });
      setDepositAmount('');
      toast.success(`R${amount.toFixed(2)} deposited to savings!`);
    } catch (error) {
      console.error("Error making deposit:", error);
      toast.error("Failed to make deposit.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const progressPercentage = user.savings_goal > 0 
    ? Math.min((user.current_savings / user.savings_goal) * 100, 100) 
    : 0;

  const remainingAmount = Math.max((user.savings_goal || 0) - (user.current_savings || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Savings & Goals
          </h1>
          <p className="text-gray-600">
            Build your financial future with smart saving habits
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Savings Goal Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Current Savings Goal</h3>
                    <p className="text-purple-100">
                      {user.savings_goal > 0 ? 'Keep going! You\'re doing great!' : 'Set a goal to get started'}
                    </p>
                  </div>
                  <PiggyBank className="w-12 h-12 text-purple-200" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-100">Progress</span>
                      <span className="font-bold text-xl">
                        R{user.current_savings?.toFixed(2) || '0.00'} / R{user.savings_goal?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-3 bg-purple-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-purple-200 text-sm">Saved</p>
                      <p className="text-lg font-bold">{Math.round(progressPercentage)}%</p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-purple-200 text-sm">Remaining</p>
                      <p className="text-lg font-bold">R{remainingAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Set New Goal */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Set New Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateGoal} className="space-y-4">
                  <div>
                    <Label htmlFor="goalAmount">Goal Amount</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R</span>
                      <Input
                        id="goalAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newGoalAmount}
                        onChange={(e) => setNewGoalAmount(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !newGoalAmount}
                  >
                    Update Goal
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Add to Savings */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Plus className="w-5 h-5 mr-2 text-green-600" />
                  Add to Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <Label htmlFor="depositAmount">Amount</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">R</span>
                      <Input
                        id="depositAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Available: R{user.balance?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading || !depositAmount}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Savings
                  </Button>
                </form>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[375, 750, 1500, 3750].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setDepositAmount(amount.toString())}
                      className="text-xs"
                    >
                      R{amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Savings Tips */}
        <div className="mt-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-yellow-600" />
                Smart Savings Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Set Realistic Goals</h4>
                  <p className="text-sm text-gray-600">Start with smaller, achievable goals to build momentum and confidence.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Automate Savings</h4>
                  <p className="text-sm text-gray-600">Set up automatic transfers to make saving effortless and consistent.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PiggyBank className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Track Progress</h4>
                  <p className="text-sm text-gray-600">Regular check-ins help you stay motivated and adjust your strategy.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
