import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Smartphone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SMSService } from '../notifications/SMSService';

const momoProviders = [
  { name: 'MTN MoMo', logo: 'mtn_logo.png' }, // Assume logos are in public folder
  { name: 'Vodacom M-Pesa', logo: 'vodacom_logo.png' },
  { name: 'Telkom Pay', logo: 'telkom_logo.png' },
];

export default function MoMoPayment({ user, onPayment }) {
  const [provider, setProvider] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAwaitingPin, setIsAwaitingPin] = useState(false);
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setError("Amount cannot be negative.");
    } else if (value > (user.balance || 0)) {
      setError("Insufficient wallet balance to fund this payment.");
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!provider || !phoneNumber || !amount || parseFloat(amount) <= 0 || !!error) {
      toast.error('Please fill all fields correctly.');
      return;
    }

    setIsLoading(true);
    setIsAwaitingPin(true);
    
    // 1. Simulate sending the STK/USSD push to the user's phone
    SMSService.sendMoMoPinPrompt(phoneNumber, amount);

    // 2. Simulate waiting for the user to enter their PIN
    setTimeout(async () => {
      try {
        // 3. Simulate the callback from the MoMo API
        // In a real scenario, this would be an API endpoint that receives the result
        const isSuccessful = Math.random() > 0.1; // 90% success rate

        if (isSuccessful) {
          await onPayment({
            amount: parseFloat(amount),
            recipient: phoneNumber,
            provider_name: provider,
          });
          toast.success('Mobile Money payment successful!');
          // Reset form
          setProvider('');
          setPhoneNumber('');
          setAmount('');
        } else {
          toast.error('Mobile Money payment failed.', {
            description: 'The transaction was declined or timed out.',
          });
        }
      } catch (err) {
        toast.error('An error occurred during payment processing.');
      } finally {
        setIsLoading(false);
        setIsAwaitingPin(false);
      }
    }, 6000); // Wait 6 seconds
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
          Pay with Mobile Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAwaitingPin ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-xl font-bold">Awaiting Confirmation</h3>
            <p className="text-gray-600 mt-2 max-w-sm">
              A push notification has been sent to <strong>{phoneNumber}</strong>. Please approve the transaction by entering your Mobile Money PIN.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Select Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a MoMo provider" />
                </SelectTrigger>
                <SelectContent>
                  {momoProviders.map((p) => (
                    <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Recipient Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="082 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="momoAmount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">R</span>
                <Input
                  id="momoAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  className={`pl-8 ${error ? 'border-red-500' : ''}`}
                  required
                />
              </div>
               <p className="text-sm text-gray-500">
                Funded from your wallet balance: R{user.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            {error && (
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !provider || !phoneNumber || !amount || !!error}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Pay R{amount || '0.00'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}