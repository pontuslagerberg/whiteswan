# Creating Notes Without Notes Scopes

## Good News! ✅

You **CAN** still create notes programmatically even without `crm.objects.notes.read/write` scopes!

## How It Works

With `crm.objects.contacts.write` scope, you can:
- Create notes associated with contacts
- Retrieve notes associated with contacts
- Update notes associated with contacts

## API Endpoint

**Create a Note:**
```
POST https://api.hubapi.com/crm/v3/objects/notes
```

**Request Body:**
```json
{
  "properties": {
    "hs_note_body": "Your note content here",
    "hs_timestamp": "2025-01-15T12:00:00Z"
  },
  "associations": [
    {
      "to": {
        "id": "CONTACT_ID_HERE"
      },
      "types": [
        {
          "associationCategory": "HUBSPOT_DEFINED",
          "associationTypeId": 214
        }
      ]
    }
  ]
}
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

## Association Type IDs

- Contact: `214`
- Company: `279`
- Deal: `343`
- Lead: `3249`

## Example: Create Note for Contact

```javascript
const response = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    properties: {
      hs_note_body: 'Meeting scheduled for next week',
      hs_timestamp: new Date().toISOString()
    },
    associations: [{
      to: { id: '123456789' },
      types: [{
        associationCategory: 'HUBSPOT_DEFINED',
        associationTypeId: 214  // Contact
      }]
    }]
  })
});
```

## Summary

Even though HubSpot doesn't offer `crm.objects.notes.read/write` scopes in your account, you can still create notes using the Contacts API with `crm.objects.contacts.write` scope, which you already have! 🎉

