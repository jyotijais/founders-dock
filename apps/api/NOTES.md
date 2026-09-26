Start PostgreSQL: net start postgresql-18
Connect to DB: psql -U postgres
Connect to foundersdock_db: \c foundersdock_db
Run backend: npm run dev

# FoundersDock Architecture

## Three separate things:
- foundersdock (React frontend)
- foundersdock-backend (Express server)
- foundersdock_db (PostgreSQL database)

## How they connect:
React Frontend → HTTP request → Express Backend → Prisma → PostgreSQL

## .env connects backend to database:
DATABASE_URL="postgresql://postgres:password@localhost:5432/foundersdock_db"

## Real example - user signs up:
1. React → POST /api/auth/signup → Express
2. Express verifies Firebase token
3. Express uses Prisma to save user in PostgreSQL
4. PostgreSQL stores user in users table
5. Express sends success response
6. React shows "Welcome to FoundersDock!"

## Useful psql commands:
psql -U postgres         → login to PostgreSQL
\c foundersdock_db       → switch to database
\dt                      → show all tables
\d users                 → show users table structure
\l                       → list all databases
\q                       → quit psql

## Start commands:
Backend: npm run dev
PostgreSQL service: net start postgresql-18






REQUEST SIDE:
─────────────────────────────────────────
React / Postman
        ↓
sends HTTP request + Firebase Token in header
Authorization: Bearer eyJhbGci...

BACKEND SIDE:
─────────────────────────────────────────
index.js
→ helmet() checks security headers
→ cors() allows frontend connection
→ morgan() logs the request
→ express.json() reads the JSON body
        ↓
routes/auth.js matches the URL
→ POST /api/auth/signup → goes to signup (no token needed)
→ GET  /api/auth/me     → goes to verifyToken first!
        ↓
middleware/verifyToken.js (only for protected routes)
→ grabs token from header
→ sends to Firebase Admin to verify
→ valid? → attaches user to req.user → next()
→ invalid? → returns 401 Unauthorized ❌
        ↓
controllers/authController.js
→ signup() → check if user exists → create new user
→ getMe()  → fetch user by firebase_uid
        ↓
config/db.js (Prisma)
→ prisma.users.findUnique()
→ prisma.users.create()
        ↓
PostgreSQL (foundersdock_db)
→ users table
→ data saved/fetched

RESPONSE SIDE:
─────────────────────────────────────────
PostgreSQL → Prisma → Controller → Express → React/Postman
→ 201 Created  { message: "User created successfully" }
→ 200 OK       { user: { id, email, name, role... } }
→ 401          { message: "Invalid token" }
→ 500          { message: "Internal server error" }




