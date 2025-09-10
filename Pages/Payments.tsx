import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Contact } from "@/entities/Contact";
import { Transaction } from "@/entities/Transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Download, 
  Users, 
  Plus,
  Search,
  Star,
  ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";

import SendMoneyForm from "../components/payments/SendMoneyForm";
import ContactList from "../components/payments/ContactList";
import PaymentMethods from "../components/payments/PaymentMethods";
import AddMoneyForm from "../components/payments/AddMoneyForm";

export default function Payments() {
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState("send");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const userContacts = await Contact.filter({ user_id: userData.id });
      setContacts(userContacts);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSendMoney = async (paymentData) => {
    // Note: Success/error toast is handled in SendMoneyForm
    try {
      // Update user balance
      const newBalance = (user.balance || 0) - paymentData.amount;
      await User.updateMyUserData({ balance: newBalance });
      setUser({ ...user, balance: newBalance });

      // Create transaction record
      await Transaction.create({
        user_id: user.id,
        type: 'expense',
        category: 'transfer',
        amount: paymentData.amount,
        description: `Transfer to ${paymentData.recipient}`,
        recipient: paymentData.recipient,
        status: 'completed'
      });
    } catch (error) {
      console.error("Error sending payment:", error);
      // The outline explicitly says "Success/error toast is handled in SendMoneyForm" for handleSendMoney,
      // so we don't add a toast here. SendMoneyForm will handle its own error reporting to the user.
      throw error; // Re-throw to allow SendMoneyForm to catch and display its own toast/message
    }
  };

  const handleAddMoney = async (addMoneyData) => {
    try {
      // Create transaction record
      await Transaction.create({
        user_id: user.id,
        type: 'income',
        category: 'other',
        amount: addMoneyData.amount,
        description: `Added money from card ending in ${addMoneyData.source}`,
        recipient: 'Wallet Top-up',
        status: 'completed'
      });

      // Update user balance
      const newBalance = (user.balance || 0) + addMoneyData.amount;
      await User.updateMyUserData({ balance: newBalance });
      
      setUser({ ...user, balance: newBalance });
      
      toast.success(`R${addMoneyData.amount.toFixed(2)} added to wallet successfully!`);
    } catch (error) {
      console.error("Error adding money:", error);
      toast.error("Failed to add money. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 lg:pb-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Payments & Transfers
          </h1>
          <p className="text-gray-600">
            Send money instantly to friends, family, and businesses
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Money
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Money
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Cards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            <SendMoneyForm 
              user={user}
              contacts={contacts}
              onSendMoney={handleSendMoney}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
            />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <AddMoneyForm 
                user={user}
                onAddMoney={handleAddMoney}
              />
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Current Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-6">
                    <p className="text-sm text-gray-500 mb-2">Available in Wallet</p>
                    <p className="text-4xl font-bold text-blue-900 mb-4">
                      R{user.balance?.toFixed(2) || '0.00'}
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600">
                        💡 <strong>Tip:</strong> Keep your wallet topped up for instant payments and transfers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <ContactList 
              contacts={contacts}
              onSelectContact={(contact) => {
                setSelectedContact(contact);
                setActiveTab("send");
              }}
            />
          </TabsContent>

          <TabsContent value="methods" className="space-y-6">
            <PaymentMethods user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
