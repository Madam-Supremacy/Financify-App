import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Send, 
  Download, 
  Plus, 
  CreditCard,
  TrendingUp,
  MessageCircle
} from "lucide-react";

const actions = [
  {
    title: "Send Money",
    icon: Send,
    color: "bg-blue-500",
    page: "Payments"
  },
  {
    title: "Add Money",
    icon: Plus,
    color: "bg-green-500",
    page: "Payments"
  },
  {
    title: "Invest",
    icon: TrendingUp,
    color: "bg-purple-500",
    page: "Investments"
  },
  {
    title: "AI Assistant",
    icon: MessageCircle,
    color: "bg-yellow-500",
    page: "Assistant"
  }
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200"
              onClick={() => navigate(createPageUrl(action.page))}
            >
              <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-center">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}