{
  "name": "Transaction",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user who made the transaction"
    },
    "type": {
      "type": "string",
      "enum": [
        "income",
        "expense",
        "transfer",
        "investment"
      ],
      "description": "Type of transaction"
    },
    "category": {
      "type": "string",
      "enum": [
        "food",
        "transport",
        "shopping",
        "bills",
        "entertainment",
        "salary",
        "investment",
        "transfer",
        "other"
      ],
      "description": "Transaction category"
    },
    "amount": {
      "type": "number",
      "description": "Transaction amount"
    },
    "description": {
      "type": "string",
      "description": "Transaction description"
    },
    "recipient": {
      "type": "string",
      "description": "Recipient name or business"
    },
    "status": {
      "type": "string",
      "enum": [
        "completed",
        "pending",
        "failed"
      ],
      "default": "completed",
      "description": "Transaction status"
    }
  },
  "required": [
    "user_id",
    "type",
    "amount",
    "description"
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