import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CreditCard, PiggyBank, Target } from "lucide-react";

export default function StatsOverview({ user, transactions }) {
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.created_date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.created_date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: "Monthly Income",
      value: `R${monthlyIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8.2%"
    },
    {
      title: "Monthly Expenses",
      value: `R${monthlyExpenses.toFixed(2)}`,
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-50",
      change: "-2.4%"
    },
    {
      title: "Savings",
      value: `R${user.current_savings?.toFixed(2) || '0.00'}`,
      icon: PiggyBank,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+15.3%"
    },
    {
      title: "Investments",
      value: `R${user.investment_portfolio_value?.toFixed(2) || '0.00'}`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+12.8%"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm border-0 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className={`text-xs font-medium ${stat.color}`}>{stat.change}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}