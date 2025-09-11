import React, { useState, useEffect } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Newspaper, ExternalLink } from "lucide-react";

export default function InvestmentNews() {
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvestmentData();
  }, []);

  const loadInvestmentData = async () => {
    setIsLoading(true);
    try {
      // Get latest financial news and market data
      const response = await InvokeLLM({
        prompt: `Get the latest South African financial news and JSE market updates. Include:
        1. Top 3 recent news stories affecting JSE or South African investments
        2. Current performance of major JSE stocks (like Shoprite, Naspers, Anglo American, Capitec)
        3. Brief market outlook
        
        Format as JSON with news array and market_summary.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            news: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  impact: { type: "string" },
                  timestamp: { type: "string" }
                }
              }
            },
            market_summary: {
              type: "object",
              properties: {
                jse_performance: { type: "string" },
                rand_performance: { type: "string" },
                outlook: { type: "string" }
              }
            },
            top_stocks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  name: { type: "string" },
                  price: { type: "string" },
                  change: { type: "string" },
                  change_percent: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (response.news) {
        setNews(response.news);
      }
      if (response.market_summary) {
        setMarketData(response);
      }
    } catch (error) {
      console.error("Error loading investment data:", error);
      // Fallback to mock data
      setNews([
        {
          title: "JSE All Share Index Reaches New High",
          summary: "South African stocks surge as mining sector leads gains amid strong commodity prices.",
          impact: "positive",
          timestamp: "2 hours ago"
        },
        {
          title: "Rand Strengthens Against Dollar",
          summary: "ZAR gains ground as global sentiment improves and local inflation shows signs of cooling.",
          impact: "positive", 
          timestamp: "4 hours ago"
        },
        {
          title: "Interest Rate Decision Expected",
          summary: "SARB likely to maintain current rates as economic indicators show mixed signals.",
          impact: "neutral",
          timestamp: "6 hours ago"
        }
      ]);
      
      setMarketData({
        market_summary: {
          jse_performance: "JSE All Share up 1.2% today",
          rand_performance: "ZAR strengthening against major currencies", 
          outlook: "Cautiously optimistic with focus on inflation data"
        },
        top_stocks: [
          { symbol: "SHP", name: "Shoprite", price: "R245.50", change: "+2.40", change_percent: "+0.99%" },
          { symbol: "NPN", name: "Naspers", price: "R3,385.00", change: "-15.20", change_percent: "-0.45%" },
          { symbol: "AGL", name: "Anglo American", price: "R425.80", change: "+8.60", change_percent: "+2.06%" },
          { symbol: "CPI", name: "Capitec", price: "R1,456.00", change: "+12.50", change_percent: "+0.87%" }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="w-5 h-5 mr-2" />
            Market News & Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      {marketData && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Market Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">JSE Performance</p>
                <p className="text-lg font-bold text-blue-900">{marketData.market_summary.jse_performance}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Rand Performance</p>
                <p className="text-lg font-bold text-green-900">{marketData.market_summary.rand_performance}</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Outlook</p>
                <p className="text-sm font-medium text-purple-900">{marketData.market_summary.outlook}</p>
              </div>
            </div>

            {marketData.top_stocks && (
              <div>
                <h4 className="font-semibold mb-3">Top JSE Stocks</h4>
                <div className="space-y-2">
                  {marketData.top_stocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-sm text-gray-500">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{stock.price}</p>
                        <div className={`flex items-center text-sm ${
                          stock.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change.startsWith('+') ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {stock.change} ({stock.change_percent})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Latest News */}
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Newspaper className="w-5 h-5 mr-2 text-blue-600" />
            Latest Financial News
          </CardTitle>
          <Button variant="outline" size="sm" onClick={loadInvestmentData}>
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {news.map((article, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{article.title}</h4>
                  <Badge className={getImpactColor(article.impact)}>
                    {article.impact}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{article.timestamp}</span>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Read More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}