{
  "name": "Contact",
  "type": "object",
  "properties": {
    "user_id": {
      "type": "string",
      "description": "ID of the user who owns this contact"
    },
    "name": {
      "type": "string",
      "description": "Contact's full name"
    },
    "email": {
      "type": "string",
      "description": "Contact's email address"
    },
    "phone_number": {
      "type": "string",
      "description": "Contact's phone number"
    },
    "avatar": {
      "type": "string",
      "description": "URL to contact's avatar image"
    },
    "is_favorite": {
      "type": "boolean",
      "default": false,
      "description": "Whether this contact is marked as favorite"
    }
  },
  "required": [
    "user_id",
    "name"
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