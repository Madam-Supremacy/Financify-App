import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { StockHolding } from "@/entities/StockHolding";
import { Transaction } from "@/entities/Transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, PieChart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

import InvestmentNews from "../components/investments/InvestmentNews";
import StockPurchase from "../components/investments/StockPurchase";
import Portfolio from "../components/investments/Portfolio";

export default function Investments() {
  const [user, setUser] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const userHoldings = await StockHolding.filter({ user_id: userData.id }, "-created_date");
      setHoldings(userHoldings);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStockPurchase = async (purchaseData) => {
    try {
      // Check if user already owns this stock
      const existingHolding = holdings.find(h => h.stock_symbol === purchaseData.stock_symbol);
      
      if (existingHolding) {
        // Update existing holding
        const newSharesTotal = existingHolding.shares_owned + purchaseData.shares_owned;
        const newAvgPrice = ((existingHolding.shares_owned * existingHolding.purchase_price) + 
                           (purchaseData.shares_owned * purchaseData.purchase_price)) / newSharesTotal;
        
        await StockHolding.update(existingHolding.id, {
          shares_owned: newSharesTotal,
          purchase_price: newAvgPrice,
          current_price: purchaseData.current_price,
          total_value: newSharesTotal * purchaseData.current_price
        });
      } else {
        // Create new holding
        await StockHolding.create({
          user_id: user.id,
          ...purchaseData,
          total_value: purchaseData.shares_owned * purchaseData.current_price
        });
      }

      // Create transaction record
      await Transaction.create({
        user_id: user.id,
        type: 'investment',
        category: 'investment',
        amount: purchaseData.total_cost,
        description: `Bought ${purchaseData.shares_owned} shares of ${purchaseData.stock_symbol}`,
        recipient: `${purchaseData.stock_symbol} - ${purchaseData.stock_name}`,
        status: 'completed'
      });

      // Update user balance
      const newBalance = (user.balance || 0) - purchaseData.total_cost;
      await User.updateMyUserData({ balance: newBalance });
      
      setUser({ ...user, balance: newBalance });
      
      // Reload holdings
      loadData();
      
      toast.success(`Successfully purchased ${purchaseData.shares_owned} shares of ${purchaseData.stock_symbol}!`);
    } catch (error) {
      console.error("Error purchasing stock:", error);
      toast.error("Failed to complete purchase. Please try again.");
    }
  };

  const handleSellStock = async (holding) => {
    const promise = () => new Promise(async (resolve, reject) => {
      try {
        const currentValue = holding.total_value || (holding.shares_owned * (holding.current_price || holding.purchase_price));
        
        // Delete the holding
        await StockHolding.delete(holding.id);
        
        // Create transaction record
        await Transaction.create({
          user_id: user.id,
          type: 'income',
          category: 'investment',
          amount: currentValue,
          description: `Sold ${holding.shares_owned} shares of ${holding.stock_symbol}`,
          recipient: `${holding.stock_symbol} - Stock Sale`,
          status: 'completed'
        });

        // Update user balance
        const newBalance = (user.balance || 0) + currentValue;
        await User.updateMyUserData({ balance: newBalance });
        
        setUser({ ...user, balance: newBalance });
        
        // Reload holdings
        loadData();
        
        resolve(currentValue);
      } catch (error) {
        console.error("Error selling stock:", error);
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Processing sale...',
      success: (currentValue) => `Successfully sold shares for R${currentValue.toFixed(2)}!`,
      error: 'Failed to complete sale. Please try again.',
    });
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

  const totalValue = holdings.reduce((sum, holding) => sum + (holding.total_value || 0), 0);
  const totalInvested = holdings.reduce((sum, holding) => sum + (holding.shares_owned * holding.purchase_price), 0);
  const totalChange = totalValue - totalInvested;
  const changePercent = totalInvested > 0 ? (totalChange / totalInvested) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Investment Portfolio
          </h1>
          <p className="text-gray-600">
            Track and grow your investment portfolio with smart insights
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-xl border-0 overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 text-white p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Total Portfolio Value</h3>
                  <p className="text-green-100">Your investment performance</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-200" />
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold mb-2">R{totalValue.toLocaleString()}</p>
                  <div className="flex items-center">
                    <div className={`flex items-center ${changePercent >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                      {changePercent >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      <span className="font-medium">
                        {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}% (R{totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)})
                      </span>
                    </div>
                    <span className="text-green-200 ml-2 text-sm">total return</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActiveTab("buy")}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Stocks
                </Button>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setActiveTab("portfolio")}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  View Portfolio
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Market Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Available Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <p className="text-2xl font-bold text-blue-900 mb-2">
                    R{(user.balance || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Ready to invest</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="buy">Buy Stocks</TabsTrigger>
            <TabsTrigger value="news">Market News</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-6">
            <Portfolio 
              holdings={holdings}
              onSellStock={handleSellStock}
            />
          </TabsContent>

          <TabsContent value="buy" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <StockPurchase 
                user={user}
                onPurchase={handleStockPurchase}
              />
              <div>
                <Portfolio 
                  holdings={holdings}
                  onSellStock={handleSellStock}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <InvestmentNews />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
