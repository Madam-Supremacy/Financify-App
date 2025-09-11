import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag, 
  Car, 
  Coffee,
  Briefcase,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";

const getCategoryIcon = (category) => {
  switch (category) {
    case 'shopping': return ShoppingBag;
    case 'transport': return Car;
    case 'food': return Coffee;
    case 'salary': return Briefcase;
    default: return MoreHorizontal;
  }
};

const getCategoryColor = (category, type) => {
  if (type === 'income') return 'text-green-600 bg-green-50';
  
  switch (category) {
    case 'shopping': return 'text-purple-600 bg-purple-50';
    case 'transport': return 'text-blue-600 bg-blue-50';
    case 'food': return 'text-orange-600 bg-orange-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

export default function RecentTransactions({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MoreHorizontal className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-400">Your recent transactions will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category);
              const colorClasses = getCategoryColor(transaction.category, transaction.type);
              
              return (
                <div key={transaction.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.recipient || format(new Date(transaction.created_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                      {transaction.type === 'income' ? '+' : '-'}R{transaction.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      {transaction.type === 'income' ? (
                        <ArrowDownLeft className="w-3 h-3 mr-1 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 mr-1 text-red-500" />
                      )}
                      {transaction.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
