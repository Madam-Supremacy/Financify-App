import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const availableStocks = [
  { symbol: 'SHP', name: 'Shoprite Holdings Ltd', price: 245.50, change: +2.4 },
  { symbol: 'NPN', name: 'Naspers Limited', price: 3385.00, change: -1.2 },
  { symbol: 'AGL', name: 'Anglo American PLC', price: 425.80, change: +1.8 },
  { symbol: 'CPI', name: 'Capitec Bank Holdings', price: 1456.00, change: +5.2 },
  { symbol: 'FSR', name: 'FirstRand Limited', price: 67.85, change: +0.8 },
  { symbol: 'SBK', name: 'Standard Bank Group', price: 156.90, change: -0.3 }
];

export default function StockPurchase({ user, onPurchase }) {
  const [selectedStock, setSelectedStock] = useState('');
  const [shares, setShares] = useState('');
  const [orderType, setOrderType] = useState('market');
  const [isLoading, setIsLoading] = useState(false);

  const selectedStockData = availableStocks.find(stock => stock.symbol === selectedStock);
  const totalCost = selectedStockData && shares ? (selectedStockData.price * parseFloat(shares)) : 0;
  const canAfford = totalCost <= (user.balance || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStock || !shares || parseFloat(shares) <= 0) {
      toast.error("Please select a stock and enter a valid number of shares.");
      return;
    }

    if (!canAfford) {
      toast.error("Insufficient balance for this purchase.");
      return;
    }

    setIsLoading(true);
    
    try {
      await onPurchase({
        stock_symbol: selectedStock,
        stock_name: selectedStockData.name,
        shares_owned: parseFloat(shares),
        purchase_price: selectedStockData.price,
        current_price: selectedStockData.price,
        total_cost: totalCost
      });
      
      // Reset form
      setSelectedStock('');
      setShares('');
    } catch (error) {
      console.error("Error purchasing stock:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
          Buy Stocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Select Stock</Label>
            <Select value={selectedStock} onValueChange={setSelectedStock}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a stock to buy" />
              </SelectTrigger>
              <SelectContent>
                {availableStocks.map((stock) => (
                  <SelectItem key={stock.symbol} value={stock.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{stock.symbol}</span>
                        <span className="text-gray-500 ml-2">{stock.name}</span>
                      </div>
                      <div className="text-right ml-4">
                        <span className="font-medium">R{stock.price.toFixed(2)}</span>
                        <span className={`ml-2 text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStockData && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{selectedStockData.symbol}</span>
                <span className="text-lg font-bold">R{selectedStockData.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600">{selectedStockData.name}</p>
              <div className={`flex items-center mt-2 text-sm ${
                selectedStockData.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {selectedStockData.change >= 0 ? '+' : ''}{selectedStockData.change}% today
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              step="1"
              min="0"
              placeholder="e.g., 10"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit" disabled>Limit Order (coming soon)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedStockData && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Balance</span>
                  <span className="font-medium">R{(user.balance || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Cost</span>
                  <span className="font-medium">R{totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-800">Remaining Balance</span>
                  <span className={!canAfford ? 'text-red-600' : ''}>R{((user.balance || 0) - totalCost).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {!canAfford && totalCost > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Insufficient funds to complete this purchase.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !canAfford || !shares || !selectedStock}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy {shares || 0} Shares
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
