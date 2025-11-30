# TalhaVerse API Documentation

Complete API reference for TalhaVerse backend.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": [ ... ]
}
```

---

## Authentication Endpoints

### Sign Up
Create a new user account.

**Endpoint**: `POST /auth/signup`

**Body**:
```json
{
  "username": "string (3-30 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

**Response**: `201 Created`
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "user",
    "createdAt": "date"
  },
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Rate Limit**: 5 requests per 15 minutes

---

### Login
Authenticate and receive tokens.

**Endpoint**: `POST /auth/login`

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**: `200 OK`
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Rate Limit**: 5 requests per 15 minutes

---

### Refresh Token
Get new access token using refresh token.

**Endpoint**: `POST /auth/refresh`

**Body**:
```json
{
  "refreshToken": "string"
}
```

**Response**: `200 OK`
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

---

### Get Current User
Get authenticated user's information.

**Endpoint**: `GET /auth/me`

**Auth**: Required

**Response**: `200 OK`
```json
{
  "user": {
    "_id": "string",
    "username": "string",
    "email": "string",
    "role": "string",
    "avatar": "string",
    "downloadHistory": [],
    "favorites": [],
    "createdAt": "date"
  }
}
```

---

### Forgot Password
Request password reset token.

**Endpoint**: `POST /auth/forgot-password`

**Body**:
```json
{
  "email": "string"
}
```

**Response**: `200 OK`
```json
{
  "message": "Password reset token generated",
  "resetToken": "string"
}
```

**Rate Limit**: 5 requests per 15 minutes

---

### Reset Password
Reset password using token.

**Endpoint**: `POST /auth/reset-password`

**Body**:
```json
{
  "token": "string",
  "newPassword": "string (min 6 chars)"
}
```

**Response**: `200 OK`
```json
{
  "message": "Password reset successful"
}
```

**Rate Limit**: 5 requests per 15 minutes

---

## Item Endpoints

### Get All Items
Retrieve items with optional filters.

**Endpoint**: `GET /items`

**Query Parameters**:
- `type` (optional): Filter by type (mod, texture-pack, etc.)
- `search` (optional): Search in title, description, tags
- `sort` (optional): Sort order (-createdAt, createdAt, -downloadsCount, -rating.average)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `gameVersion` (optional): Filter by game version
- `tags` (optional): Comma-separated tags

**Response**: `200 OK`
```json
{
  "items": [
    {
      "_id": "string",
      "title": "string",
      "slug": "string",
      "type": "string",
      "version": "string",
      "gameVersion": "string",
      "author": "string",
      "tags": ["string"],
      "shortDescription": "string",
      "thumbnail": "string",
      "downloadsCount": 0,
      "rating": {
        "average": 0,
        "count": 0
      },
      "featured": false,
      "createdAt": "date"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 0
}
```

---

### Get Item by Slug
Retrieve single item details.

**Endpoint**: `GET /items/:slug`

**Response**: `200 OK`
```json
{
  "_id": "string",
  "title": "string",
  "slug": "string",
  "type": "string",
  "version": "string",
  "gameVersion": "string",
  "author": "string",
  "authorId": "string",
  "tags": ["string"],
  "shortDescription": "string",
  "fullDescription": "string (markdown)",
  "thumbnail": "string",
  "screenshots": ["string"],
  "files": [
    {
      "_id": "string",
      "filename": "string",
      "originalName": "string",
      "size": 0,
      "fileType": "string",
      "storageUrl": "string",
      "uploadedAt": "date"
    }
  ],
  "downloadsCount": 0,
  "rating": {
    "average": 0,
    "count": 0
  },
  "featured": false,
  "changelog": "string (markdown)",
  "installInstructions": "string (markdown)",
  "status": "published",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

### Get Items by Type
Retrieve items of specific type.

**Endpoint**: `GET /items/type/:type`

**Parameters**:
- `type`: mod, texture-pack, modpack, shaderpack, addon, resource-pack, tool

**Query Parameters**: Same as Get All Items

**Response**: Same as Get All Items

---

### Get Featured Items
Retrieve featured items.

**Endpoint**: `GET /items/featured`

**Response**: `200 OK`
```json
[
  { /* item object */ }
]
```

---

### Get Trending Items
Retrieve most downloaded items.

**Endpoint**: `GET /items/trending`

**Response**: `200 OK`
```json
[
  { /* item object */ }
]
```

---

### Create Item
Upload new content item.

**Endpoint**: `POST /items`

**Auth**: Required (Admin only)

**Body**:
```json
{
  "title": "string",
  "type": "string",
  "version": "string",
  "gameVersion": "string",
  "author": "string",
  "tags": ["string"],
  "shortDescription": "string (max 200 chars)",
  "fullDescription": "string",
  "thumbnail": "string (file path)",
  "screenshots": ["string"],
  "files": [
    {
      "filename": "string",
      "originalName": "string",
      "size": 0,
      "fileType": "string",
      "storageUrl": "string"
    }
  ],
  "changelog": "string (optional)",
  "installInstructions": "string (optional)"
}
```

**Response**: `201 Created`
```json
{
  "message": "Item created successfully",
  "item": { /* item object */ }
}
```

---

### Update Item
Update existing item.

**Endpoint**: `PUT /items/:id`

**Auth**: Required (Admin only)

**Body**: Same as Create Item (all fields optional)

**Response**: `200 OK`
```json
{
  "message": "Item updated successfully",
  "item": { /* item object */ }
}
```

---

### Delete Item
Delete an item and its files.

**Endpoint**: `DELETE /items/:id`

**Auth**: Required (Admin only)

**Response**: `200 OK`
```json
{
  "message": "Item deleted successfully"
}
```

---

## File Endpoints

### Upload Files
Upload thumbnail, screenshots, and content files.

**Endpoint**: `POST /upload`

**Auth**: Required (Admin only)

**Content-Type**: `multipart/form-data`

**Form Fields**:
- `thumbnail`: Single image file (JPG, PNG, GIF, WebP)
- `screenshots`: Multiple image files (max 10)
- `files`: Multiple content files (ZIP, RAR, JAR, MCPACK, MCADDON, MCWORLD)

**Response**: `200 OK`
```json
{
  "message": "Files uploaded successfully",
  "thumbnail": "uploads/images/filename.jpg",
  "screenshots": [
    "uploads/images/filename1.jpg",
    "uploads/images/filename2.jpg"
  ],
  "files": [
    {
      "filename": "generated-name.zip",
      "originalName": "original-name.zip",
      "size": 1024000,
      "fileType": "application/zip",
      "storageUrl": "uploads/files/generated-name.zip"
    }
  ]
}
```

**File Size Limit**: 500MB (configurable via MAX_FILE_SIZE env var)

---

### Download File
Download a content file.

**Endpoint**: `GET /download/:fileId?itemId=<itemId>`

**Auth**: Optional (tracks download if authenticated)

**Rate Limit**: 20 downloads per hour

**Response**: File download stream

**Side Effects**:
- Increments item's download count
- Adds to user's download history (if authenticated)

---

## Admin Endpoints

All admin endpoints require authentication and admin role.

### Get Dashboard Statistics
Retrieve admin dashboard stats.

**Endpoint**: `GET /admin/stats`

**Auth**: Required (Admin only)

**Response**: `200 OK`
```json
{
  "totalUsers": 0,
  "totalItems": 0,
  "totalDownloads": 0,
  "recentItems": [
    {
      "_id": "string",
      "title": "string",
      "type": "string",
      "downloadsCount": 0,
      "createdAt": "date"
    }
  ],
  "itemsByType": [
    {
      "_id": "mod",
      "count": 5
    }
  ],
  "downloadsPerDay": [
    {
      "_id": "2024-01-01",
      "downloads": 100
    }
  ]
}
```

---

### Get All Users
Retrieve user list with search.

**Endpoint**: `GET /admin/users`

**Auth**: Required (Admin only)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Users per page (default: 20)
- `search` (optional): Search by username or email

**Response**: `200 OK`
```json
{
  "users": [
    {
      "_id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "downloadHistory": [],
      "favorites": [],
      "createdAt": "date"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 0
}
```

---

### Update User Role
Change user's role.

**Endpoint**: `PUT /admin/users/:id/role`

**Auth**: Required (Admin only)

**Body**:
```json
{
  "role": "user | admin"
}
```

**Response**: `200 OK`
```json
{
  "message": "User role updated",
  "user": { /* user object */ }
}
```

---

### Delete User
Delete a user account.

**Endpoint**: `DELETE /admin/users/:id`

**Auth**: Required (Admin only)

**Note**: Cannot delete your own account

**Response**: `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

### Get All Items (Admin)
Retrieve all items including drafts.

**Endpoint**: `GET /admin/items`

**Auth**: Required (Admin only)

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by type
- `status` (optional): Filter by status (published, draft, archived)

**Response**: Same as GET /items

---

### Bulk Delete Items
Delete multiple items at once.

**Endpoint**: `POST /admin/items/bulk-delete`

**Auth**: Required (Admin only)

**Body**:
```json
{
  "itemIds": ["id1", "id2", "id3"]
}
```

**Response**: `200 OK`
```json
{
  "message": "3 items deleted successfully"
}
```

---

### Toggle Featured Status
Toggle item's featured status.

**Endpoint**: `PUT /admin/items/:id/featured`

**Auth**: Required (Admin only)

**Response**: `200 OK`
```json
{
  "message": "Featured status updated",
  "item": { /* item object */ }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| Auth endpoints | 5 requests per 15 minutes |
| Download endpoint | 20 requests per hour |
| General API | 100 requests per 15 minutes |

---

## File Upload Limits

| File Type | Max Size | Allowed Extensions |
|-----------|----------|-------------------|
| Thumbnail | 10MB | .jpg, .jpeg, .png, .gif, .webp |
| Screenshots | 10MB each | .jpg, .jpeg, .png, .gif, .webp |
| Content Files | 500MB | .zip, .rar, .jar, .mcpack, .mcaddon, .mcworld |

---

## Content Types

Valid values for `type` field:

- `mod` - Mods
- `texture-pack` - Texture Packs
- `modpack` - Modpacks
- `shaderpack` - Shaderpacks
- `addon` - Addons
- `resource-pack` - Resource Packs
- `tool` - Tools

---

## Sort Options

Valid values for `sort` parameter:

- `-createdAt` - Newest first (default)
- `createdAt` - Oldest first
- `-downloadsCount` - Most downloaded
- `-rating.average` - Highest rated

---

## Example Usage

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Login
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

// Get items
const getItems = async (type, page = 1) => {
  const response = await axios.get(`${API_URL}/items`, {
    params: { type, page, limit: 12 }
  });
  return response.data;
};

// Upload with auth
const uploadItem = async (itemData, token) => {
  const response = await axios.post(`${API_URL}/items`, itemData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Get items
curl http://localhost:5000/api/items?type=mod&page=1

# Get item by slug
curl http://localhost:5000/api/items/awesome-mod

# Upload (with auth)
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Mod","type":"mod",...}'
```

---

## Webhooks (Future)

Planned webhook support for:
- New item published
- Item downloaded
- User registered
- Item featured

---

## Versioning

Current API Version: **v1**

Future versions will be accessible via `/api/v2/...`

---

## Support

For API issues or questions:
- Check error messages in response
- Review server logs
- Consult main documentation
