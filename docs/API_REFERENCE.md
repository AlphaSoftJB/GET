# GET API Reference

**Base URL (development):** `http://localhost:8080`
**Base URL (production):** `https://api.getapp.example.com`
**API Version:** `v1`
**Full REST prefix:** `/api/v1`

---

## Authentication

GET uses **JWT Bearer tokens** for authentication. Include the token in every protected request:

```http
Authorization: Bearer <your_jwt_token>
```

Tokens expire after **24 hours**. Use the `/auth/refresh` endpoint to obtain a new token without re-authenticating.

---

## REST Endpoints

### Auth Endpoints

#### POST `/api/v1/auth/login`

Authenticate a user and receive a JWT access token.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**Response `200 OK`:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "usr_01HQ3V2K8XMNDP4E6F7G",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "MEMBER"
  }
}
```

---

#### POST `/api/v1/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

---

### Inventory Endpoints

#### GET `/api/v1/inventory`

Retrieve all inventory items for the authenticated user's household.

**Query Parameters:** `page`, `size`, `sort`, `direction`, `category`, `location`, `search`

#### POST `/api/v1/inventory`

Add a new inventory item.

#### GET `/api/v1/inventory/{id}`

Get a single inventory item by ID.

#### PUT `/api/v1/inventory/{id}`

Update an existing inventory item.

#### DELETE `/api/v1/inventory/{id}`

Remove an inventory item.

#### GET `/api/v1/inventory/expiring`

Get items expiring within a specified number of days.

#### GET `/api/v1/inventory/expired`

Get all items that have already expired.

---

### Household Endpoints

#### GET `/api/v1/household`
#### POST `/api/v1/household`
#### PUT `/api/v1/household/{id}`
#### DELETE `/api/v1/household/{id}`
#### GET `/api/v1/household/{id}/members`
#### POST `/api/v1/household/{id}/invite`
#### DELETE `/api/v1/household/{householdId}/members/{userId}`

---

### Analytics Endpoints

#### GET `/api/v1/analytics/dashboard`
#### GET `/api/v1/analytics/expiration`
#### GET `/api/v1/analytics/categories`

---

## GraphQL API

**Endpoint:** `POST /graphql`
**Playground:** `GET /graphiql` (development only)

### Key Types

```graphql
type User { id: ID! email: String! firstName: String! lastName: String! }
type InventoryItem { id: ID! name: String! expirationDate: Date! status: ItemStatus! }
type Household { id: ID! name: String! members: [HouseholdMember!]! }
enum ItemStatus { FRESH EXPIRING_SOON EXPIRED }
enum StorageLocation { FRIDGE FREEZER PANTRY COUNTER OTHER }
```

---

## Error Responses

```json
{
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Inventory item was not found.",
    "timestamp": "2024-03-15T10:30:00Z"
  }
}
```

## Rate Limiting

| Tier | Limit |
|---|---|
| Unauthenticated | 30 requests / minute |
| Authenticated users | 300 requests / minute |
| Admin accounts | 1,000 requests / minute |