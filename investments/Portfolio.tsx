import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Portfolio({ holdings, onSellStock }) {
  const totalValue = holdings.reduce((sum, holding) => sum + (holding.total_value || 0), 0);
  const totalInvested = holdings.reduce((sum, holding) => sum + (holding.shares_owned * holding.purchase_price), 0);
  const totalGainLoss = totalValue - totalInvested;
  const gainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  if (holdings.length === 0) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No investments yet</p>
            <p className="text-sm text-gray-400">Start building your portfolio by buying your first stock</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Portfolio Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-lg font-bold text-gray-900">R{totalValue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-lg font-bold text-gray-900">R{totalInvested.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Gain/Loss</p>
              <div className={`flex items-center justify-center ${
                totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalGainLoss >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="font-bold">
                  R{Math.abs(totalGainLoss).toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Holdings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Holdings</h4>
          {holdings.map((holding) => {
            const currentValue = holding.total_value || (holding.shares_owned * holding.current_price);
            const invested = holding.shares_owned * holding.purchase_price;
            const gainLoss = currentValue - invested;
            const gainLossPercent = invested > 0 ? (gainLoss / invested) * 100 : 0;

            return (
              <div
                key={holding.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm text-blue-600">
                      {holding.stock_symbol}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{holding.stock_symbol}</p>
                    <p className="text-sm text-gray-500">
                      {holding.shares_owned} shares @ R{holding.purchase_price.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="font-medium">R{(holding.current_price || holding.purchase_price).toFixed(2)}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-gray-900">R{currentValue.toFixed(2)}</p>
                  <div className={`flex items-center text-sm ${
                    gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {gainLoss >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    R{Math.abs(gainLoss).toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onSellStock(holding)}>
                      Sell Stock
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}