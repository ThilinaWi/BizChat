# BizChat Backend API

A production-ready TypeScript-based MERN stack backend with JWT authentication, role-based access control, and comprehensive error handling.

## Features

- **Dual Token Authentication**: JWT Access Token (15min) + Refresh Token (7d)
- **Role-Based Access Control (RBAC)**: User, Manager, and Admin roles
- **Comprehensive Error Handling**: Custom error classes and centralized error middleware
- **User Management**: Full CRUD operations for admin
- **Input Validation**: Multi-layer validation for all inputs
- **Security**: Password hashing with bcrypt, token-based authentication
- **Clean Architecture**: Well-structured, maintainable, and scalable code
- **TypeScript**: Full type safety across the application

## Project Structure

```
bizchat-backend/
├── src/
│   ├── config/
│   │   └── database.ts              # MongoDB connection
│   ├── constants/
│   │   └── roles.ts                 # Role definitions and hierarchy
│   ├── controllers/
│   │   ├── authController.ts        # Authentication logic
│   │   └── adminController.ts       # User management logic
│   ├── middleware/
│   │   ├── auth.ts                  # JWT authentication middleware
│   │   ├── rbac.ts                  # Role-based access control
│   │   └── errorHandler.ts          # Error handling middleware
│   ├── models/
│   │   ├── User.ts                  # User schema with validation
│   │   └── RefreshToken.ts          # Refresh token schema
│   ├── routes/
│   │   ├── authRoutes.ts            # Authentication endpoints
│   │   ├── adminRoutes.ts           # Admin endpoints
│   │   └── index.ts                 # Route aggregator
│   ├── types/
│   │   ├── index.ts                 # TypeScript interfaces
│   │   └── express.d.ts             # Express type extensions
│   ├── utils/
│   │   ├── errors.ts                # Custom error classes
│   │   ├── jwt.ts                   # Token utilities
│   │   └── validation.ts            # Input validation
│   └── server.ts                    # Application entry point
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript config
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
MONGO_URI=your_mongodb_connection_string
PORT=4500
NODE_ENV=development

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Documentation

### Base URL
```
http://localhost:4500/api
```

---

## Authentication Endpoints

### 1. Sign Up
Create a new user account.

**URL:** `POST /api/auth/signup`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "securePassword123"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully. Please sign in to continue.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "role": "user",
    "createdAt": "2026-03-04T00:00:00.000Z",
    "updatedAt": "2026-03-04T00:00:00.000Z"
  }
}
```

---

### 2. Sign In
Authenticate and receive tokens.

**URL:** `POST /api/auth/signin`

**Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Sign in successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": { ... }
}
```

---

### 3. Refresh Token
Get a new access token using refresh token.

**URL:** `POST /api/auth/refresh-token`

**Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "new_refresh_token..."
}
```

---

### 4. Logout
Invalidate refresh token and blacklist the current access token.

**URL:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."  // optional
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** After logout, the access token is immediately invalidated and cannot be used for any authenticated requests.

---

### 5. Logout All Devices
Invalidate all refresh tokens for the user.

**URL:** `POST /api/auth/logout-all`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

---

### 6. Get Current User
Get authenticated user details.

**URL:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": { ... }
}
```

---

## Admin Endpoints

All admin endpoints require `Authorization: Bearer <access_token>` header and admin role.

### 1. Get All Users
List all users with pagination and filtering.

**URL:** `GET /api/admin/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (user, manager, admin)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    { ... user objects ... }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 2. Get User by ID
Get specific user details.

**URL:** `GET /api/admin/users/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": { ... user object ... }
}
```

---

### 3. Update User
Update user information.

**URL:** `PUT /api/admin/users/:id`

**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+0987654321",
  "role": "manager"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... updated user ... }
}
```

---

### 4. Delete User
Permanently delete a user.

**URL:** `DELETE /api/admin/users/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 5. Get User Statistics
Get user statistics grouped by role and status.

**URL:** `GET /api/admin/users/stats`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "total": 100,
    "byRole": {
      "user": 80,
      "manager": 15,
      "admin": 5
    }
  }
}
```

---

## User Roles

### Role Hierarchy
1. **User** (Level 1): Basic access
2. **Manager** (Level 2): Elevated permissions
3. **Admin** (Level 3): Full system access

### Default Role
New users are assigned the `user` role by default.

### Role-Based Access
- Public routes: Sign up, Sign in, Refresh token
- User routes: All authenticated users
- Manager routes: Managers and Admins
- Admin routes: Admins only

---

## Validation Rules

### Sign Up
- **First Name**: 2-50 characters, required
- **Last Name**: 2-50 characters, required
- **Email**: Valid email format, unique, required
- **Phone Number**: Valid format, required
- **Password**: Minimum 6 characters, required

### Sign In
- **Email**: Valid email format, required
- **Password**: Required

### Update User
- **First Name**: 2-50 characters (if provided)
- **Last Name**: 2-50 characters (if provided)
- **Phone Number**: Valid format (if provided)
- **Role**: user, manager, or admin (admin only)

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Optional validation errors array"],
  "stack": "Stack trace (development only)"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication failed)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Custom Error Types
- `ValidationError` - Input validation failures
- `AuthenticationError` - Authentication issues
- `AuthorizationError` - Permission denied
- `NotFoundError` - Resource not found
- `ConflictError` - Duplicate resource
- `DatabaseError` - Database operations

---

## Security Features

1. **Password Security**
   - Passwords hashed using bcrypt
   - Minimum 6 characters requirement
   - Never returned in API responses

2. **Token Security**
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Secure token generation
   - Token invalidation on logout

3. **Role-Based Security**
   - Hierarchical permission system
   - Middleware-enforced access control
   - Admin-only user management

---

## Best Practices Implemented

- **Separation of Concerns**: Clear MVC architecture
- **Error Handling**: Centralized error middleware
- **Validation**: Multi-layer input validation
- **Type Safety**: Full TypeScript coverage
- **Security**: Industry-standard authentication
- **Scalability**: Modular and extensible design
- **Code Quality**: Clean, readable, maintainable code
- **Documentation**: Comprehensive API documentation

---

## Development

The server will connect to MongoDB and start on the configured port.

Access the API at: `http://localhost:4500`

### Health Check
```
GET http://localhost:4500/health
```

### API Info
```
GET http://localhost:4500
```

---

## Testing

Use the provided `API_TESTING.md` for testing examples with:
- cURL
- PowerShell
- JavaScript Fetch API
- Postman Collection

---

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, random secrets for JWT tokens
3. Configure proper MongoDB connection
4. Set up HTTPS
5. Implement rate limiting
6. Set up monitoring and logging
7. Regular security audits

---

## License

ISC

## Project Structure

```
bizchat-backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection configuration
│   ├── controllers/
│   │   └── authController.ts    # Authentication business logic
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── models/
│   │   └── User.ts              # User mongoose model with validation
│   ├── routes/
│   │   ├── authRoutes.ts        # Authentication routes
│   │   └── index.ts             # Route aggregator
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces and types
│   ├── utils/
│   │   ├── jwt.ts               # JWT token generation and verification
│   │   └── validation.ts        # Input validation utilities
│   └── server.ts                # Application entry point
├── .env                         # Environment variables
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
└── tsconfig.json                # TypeScript configuration
```

## Features

- User registration with comprehensive validation
- User authentication with JWT tokens
- Secure password hashing using bcrypt
- MongoDB integration with Mongoose
- Clean, maintainable, and well-structured code
- TypeScript for type safety
- Input validation for all fields

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env` file:
```
MONGO_URI=your_mongodb_connection_string
PORT=4500
NODE_ENV=development
JWT_SECRET=your_secure_random_secret
JWT_EXPIRES_IN=1d
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints

### Authentication

#### Sign Up
- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "securePassword123"
}
```
- **Success Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "createdAt": "2026-03-04T00:00:00.000Z",
    "updatedAt": "2026-03-04T00:00:00.000Z"
  }
}
```

#### Sign In
- **URL:** `/api/auth/signin`
- **Method:** `POST`
- **Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```
- **Success Response:**
```json
{
  "success": true,
  "message": "Sign in successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "createdAt": "2026-03-04T00:00:00.000Z",
    "updatedAt": "2026-03-04T00:00:00.000Z"
  }
}
```

## Validation Rules

### Sign Up
- **First Name:** 2-50 characters, required
- **Last Name:** 2-50 characters, required
- **Email:** Valid email format, required, unique
- **Phone Number:** Valid phone format (supports international), required
- **Password:** Minimum 6 characters, required

### Sign In
- **Email:** Valid email format, required
- **Password:** Required

## Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Optional array of validation errors"]
}
```

## Security Features

- Passwords are hashed using bcrypt before storage
- JWT tokens for secure authentication
- Email uniqueness validation
- Input sanitization and validation
- MongoDB injection protection through Mongoose

## Development

The project uses:
- **TypeScript** for type safety
- **Express.js** as the web framework
- **MongoDB** with Mongoose for the database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemon** for auto-restart during development

## Best Practices Implemented

- Separation of concerns (MVC pattern)
- Environment-based configuration
- Comprehensive error handling
- Input validation at multiple layers
- Secure password handling
- Clean and maintainable code structure
- TypeScript interfaces for type safety
- Mongoose schema validation
