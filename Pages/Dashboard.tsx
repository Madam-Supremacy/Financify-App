import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Transaction } from "@/entities/Transaction";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Target
} from "lucide-react";

import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import StatsOverview from "../components/dashboard/StatsOverview";
import SpendingBreakdown from "../components/dashboard/SpendingBreakdown"; // New import

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    try {
      const userData = await User.me();
      if (!userData) {
        navigate(createPageUrl("Landing"));
        return;
      }
      
      // Ensure user has completed onboarding before showing dashboard
      if (!userData.phone_number) {
        navigate(createPageUrl("Onboarding"));
        return;
      }

      setUser(userData);
    } catch (error) {
      console.error("Failed to load user data:", error);
      navigate(createPageUrl("Landing"));
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const loadTransactions = useCallback(async () => {
    if (!user) return;
    
    setTransactionsLoading(true);
    try {
      // Load user's recent transactions
      const userTransactions = await Transaction.filter({ user_id: user.id }, "-created_date", 50); // Changed limit from 10 to 50
      setTransactions(userTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user, loadTransactions]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user.full_name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your finances today
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Balance Card - Full Width on Mobile, 2/3 on Desktop */}
          <div className="lg:col-span-2">
            <BalanceCard 
              user={user} 
              showBalance={showBalance} 
              setShowBalance={setShowBalance} 
            />
          </div>

          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <StatsOverview user={user} transactions={transactions} />
        </div>

        {/* New Spending Breakdown */}
        <div className="mb-8">
          <SpendingBreakdown transactions={transactions} />
        </div>

        {/* Recent Transactions & Savings */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentTransactions 
              transactions={transactions.slice(0, 5)} // Changed to slice the transactions
              isLoading={transactionsLoading}
            />
          </div>

          {/* Savings Goal Progress */}
          <div>
            <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Savings Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        R{user.current_savings?.toFixed(2) || '0.00'} / R{user.savings_goal?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${user.savings_goal > 0 ? Math.min((user.current_savings / user.savings_goal) * 100, 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {user.savings_goal > 0 ? Math.round((user.current_savings / user.savings_goal) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">of your goal reached</p>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => navigate(createPageUrl("Savings"))}
                  >
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Update Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
