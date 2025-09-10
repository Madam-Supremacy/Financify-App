import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Home, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  MessageCircle,
  Building2, 
  User as UserIcon,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: "Dashboard", icon: Home },
  { title: "Payments", url: "Payments", icon: CreditCard },
  { title: "Savings", url: "Savings", icon: PiggyBank },
  { title: "Investments", url: "Investments", icon: TrendingUp },
  { title: "Loans", url: "Loans", icon: Building2 }, // Added Loans item
  { title: "Assistant", url: "Assistant", icon: MessageCircle },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  // Don't show layout for landing or onboarding pages
  if (currentPageName === "Landing" || currentPageName === "Onboarding") {
    return children;
  }

  if (!user) {
    // Render children which might be a loading state or redirect
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <style>
        {`
          :root {
            --primary-navy: #1e3a8a;
            --primary-blue: #1e40af;
            --accent-yellow: #fbbf24;
            --accent-yellow-light: #fef3c7;
          }
        `}
      </style>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-xl">
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">Byte Finance</h1>
            </div>
            
            <nav className="mt-8 flex-1 px-4 space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === createPageUrl(item.url);
                return (
                  <Link
                    key={item.title}
                    to={createPageUrl(item.url)}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-800 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-shrink-0 px-6 pb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-white shadow-sm">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h1 className="ml-2 text-lg font-bold text-gray-900">Byte Finance</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)} />
            <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-xl">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const isActive = location.pathname === createPageUrl(item.url);
                  return (
                    <Link
                      key={item.title}
                      to={createPageUrl(item.url)}
                      onClick={() => setIsMenuOpen(false)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-800 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {navigationItems.slice(0, 5).map((item) => { 
            const isActive = location.pathname === createPageUrl(item.url);
            return (
              <Link
                key={item.title}
                to={createPageUrl(item.url)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive ? 'text-blue-800' : 'text-gray-500'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-800' : 'text-gray-500'}`} />
                <span className="text-xs mt-1 font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
