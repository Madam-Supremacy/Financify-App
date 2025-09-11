import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import BiometricConfirmation from "./BiometricConfirmation";
import { toast } from "sonner";

export default function SendMoneyForm({ user, contacts, onSendMoney, selectedContact, setSelectedContact }) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState(selectedContact?.name || '');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (selectedContact) {
      setRecipient(selectedContact.name);
    }
  }, [selectedContact]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) {
      setError("Amount cannot be negative.");
    } else if (parseFloat(value) > (user.balance || 0) && value !== '') {
      setError("Insufficient balance.");
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || !recipient || parseFloat(amount) <= 0) {
      setError("Please fill in all required fields.");
      return;
    }

    if (parseFloat(amount) > (user.balance || 0)) {
      setError("Insufficient balance for this transaction.");
      return;
    }

    setPaymentData({
      amount: parseFloat(amount),
      recipient,
      note,
    });
    setShowBiometricModal(true);
  };

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setShowBiometricModal(false);
    
    try {
      await onSendMoney(paymentData);
      
      setPaymentSuccess(true);
      // Toast notification is now handled in the parent Payments component

      // Reset form
      setAmount('');
      setRecipient('');
      setNote('');
      setSelectedContact(null);
      setPaymentData(null);
    } catch (error) {
      console.error("Error sending money:", error);
      // Error toast is handled in parent
    } finally {
      setIsLoading(false);
      setTimeout(() => setPaymentSuccess(false), 3000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2 text-blue-600" />
              Send from Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentSuccess ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold">Payment Sent!</h3>
                <p className="text-gray-600 mt-2">
                  Your transfer to {paymentData?.recipient} was successful.
                </p>
                <Button onClick={() => setPaymentSuccess(false)} className="mt-6">
                  Send Another Payment
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="recipient">To</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter name, email, or phone"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>

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
                      onChange={handleAmountChange}
                      className={`pl-8 ${error && amount !== '' ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Available balance: R{user.balance?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {error && (
                  <div className="flex items-center text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="What's this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-20"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || !amount || !recipient || !!error || parseFloat(amount) <= 0}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send R{amount || '0.00'}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

      {/* Quick Amount Buttons */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Quick Amounts</h4>
            <div className="grid grid-cols-3 gap-3">
              {[150, 375, 750, 1500, 3000, 7500].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  onClick={() => {
                    setAmount(quickAmount.toString());
                    setError('');
                  }}
                  className="h-12"
                >
                  R{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Frequent Contacts</h4>
            {contacts.filter(c => c.is_favorite).slice(0, 3).map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedContact(contact);
                  setRecipient(contact.name);
                }}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.email}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  Select
                </Button>
              </div>
            ))}
            {contacts.filter(c => c.is_favorite).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">Favorite contacts will appear here.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {showBiometricModal && (
        <BiometricConfirmation
          isOpen={showBiometricModal}
          onConfirm={handleConfirmPayment}
          onCancel={() => setShowBiometricModal(false)}
          amount={paymentData?.amount}
        />
      )}
    </div>
  );
}