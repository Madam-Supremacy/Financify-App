import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ShoppingBag, Car, Coffee, Briefcase, Film, MoreHorizontal } from 'lucide-react';

const COLORS = ['#1e3a8a', '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const categoryDetails = {
  shopping: { icon: ShoppingBag, color: COLORS[0] },
  transport: { icon: Car, color: COLORS[1] },
  food: { icon: Coffee, color: COLORS[2] },
  bills: { icon: Briefcase, color: COLORS[3] },
  entertainment: { icon: Film, color: COLORS[4] },
  other: { icon: MoreHorizontal, color: COLORS[5] },
};

export default function SpendingBreakdown({ transactions }) {
  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const category = t.category || 'other';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += t.amount;
      return acc;
    }, {});

  const chartData = Object.keys(expenseData).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: expenseData[key],
  }));

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-lg shadow-lg">
          <p className="font-bold">{`${payload[0].name}`}</p>
          <p className="text-sm">{`Amount: R${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Spending Breakdown (This Month)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-10">
            <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No spending data for this month yet.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              <div className="mb-4">
                  <p className="text-sm text-gray-500">Total Monthly Expenses</p>
                  <p className="text-2xl font-bold">R{totalExpenses.toFixed(2)}</p>
              </div>
              {chartData.sort((a,b) => b.value - a.value).map((entry, index) => {
                const categoryKey = entry.name.toLowerCase();
                const Icon = categoryDetails[categoryKey]?.icon || MoreHorizontal;
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div style={{width: '10px', height: '10px', backgroundColor: COLORS[index % COLORS.length], borderRadius: '50%', marginRight: '8px'}}></div>
                      <Icon className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{entry.name}</span>
                    </div>
                    <span className="font-medium">R{entry.value.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}