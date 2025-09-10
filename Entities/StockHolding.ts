{
  "name": "StockHolding",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns the stock"
    },
    "stock_symbol": {
      "type": "string",
      "description": "Stock symbol (e.g., SHP, NPN, AGL)"
    },
    "stock_name": {
      "type": "string",
      "description": "Full company name"
    },
    "shares_owned": {
      "type": "number",
      "description": "Number of shares owned"
    },
    "purchase_price": {
      "type": "number",
      "description": "Price per share when purchased"
    },
    "current_price": {
      "type": "number",
      "description": "Current market price per share"
    },
    "total_value": {
      "type": "number",
      "description": "Total current value of holdings"
    }
  },
  "required": [
    "user_id",
    "stock_symbol",
    "stock_name",
    "shares_owned",
    "purchase_price"
  ],
  "rls": {
    "read": {
      "user_id": "{{user.id}}"
    },
    "write": {
      "user_id": "{{user.id}}"
    }
  }
}