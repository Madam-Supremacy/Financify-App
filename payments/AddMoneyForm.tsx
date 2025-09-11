import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CreditCard, CheckCircle } from "lucide-react";

const mockCards = [
  { id: 1, last4: '4242', brand: 'Visa', name: 'Personal Visa' },
  { id: 2, last4: '8888', brand: 'Mastercard', name: 'Business Card' }
];

export default function AddMoneyForm({ user, onAddMoney }) {
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !selectedCard || parseFloat(amount) <= 0) {
      alert("Please fill in all fields with valid amounts.");
      return;
    }

    setIsLoading(true);
    
    try {
      await onAddMoney({
        amount: parseFloat(amount),
        source: selectedCard
      });
      
      // Reset form
      setAmount('');
      setSelectedCard('');
    } catch (error) {
      console.error("Error adding money:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2 text-green-600" />
          Add Money to Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">R</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <Select value={selectedCard} onValueChange={setSelectedCard}>
              <SelectTrigger>
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent>
                {mockCards.map((card) => (
                  <SelectItem key={card.id} value={card.id.toString()}>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      {card.brand} •••• {card.last4}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-blue-800 text-sm mb-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Instant Transfer</span>
            </div>
            <p className="text-blue-600 text-sm">
              Money will be available in your wallet immediately. No fees for transfers under R5,000.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading || !amount || !selectedCard}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add R{amount || '0.00'} to Wallet
              </>
            )}
          </Button>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[500, 1000, 2500, 5000].map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-xs"
              >
                R{quickAmount}
              </Button>
            ))}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}