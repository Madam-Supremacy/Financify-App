{
  "name": "LoanApplication",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user applying for the loan"
    },
    "loan_type": {
      "type": "string",
      "enum": [
        "personal",
        "vehicle",
        "home",
        "business",
        "education"
      ],
      "description": "Type of loan being applied for"
    },
    "amount_requested": {
      "type": "number",
      "description": "Loan amount requested in ZAR"
    },
    "repayment_period": {
      "type": "number",
      "description": "Repayment period in months"
    },
    "monthly_income": {
      "type": "number",
      "description": "Applicant's monthly income"
    },
    "employment_status": {
      "type": "string",
      "enum": [
        "employed",
        "self_employed",
        "unemployed",
        "student",
        "pensioner"
      ],
      "description": "Current employment status"
    },
    "purpose": {
      "type": "string",
      "description": "Purpose of the loan"
    },
    "status": {
      "type": "string",
      "enum": [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "declined"
      ],
      "default": "draft",
      "description": "Application status"
    },
    "provider": {
      "type": "string",
      "description": "Name of the loan provider"
    }
  },
  "required": [
    "user_id",
    "loan_type",
    "amount_requested",
    "repayment_period",
    "monthly_income",
    "employment_status",
    "purpose"
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