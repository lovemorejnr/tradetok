# TradeTok Backend Setup

The frontend is currently using mock services (`src/services/mock/*`). To connect to your real Railway PostgreSQL database, follow these steps.

## 1. Apply the Database Schema
1. Copy the contents of `railway_schema.sql` (located in the project root).
2. Go to your **Railway Dashboard** -> Select your PostgreSQL Service.
3. Click on the **Query** tab.
4. Paste the SQL code and execute it. This creates all necessary tables.

## 2. Connect the Frontend (Next Steps)
Since this is a client-side app, you cannot query the database directly from the browser for security reasons. You need a simple API layer.

### Option A: Create a Node.js/Express Server
1. Create a `server` directory.
2. Initialize a Node project and install `pg` (node-postgres).
3. Create API endpoints that correspond to the frontend services:
   - `GET /api/items` -> `SELECT * FROM items`
   - `POST /api/login` -> `SELECT * FROM users WHERE email = $1`
   - `POST /api/items` -> `INSERT INTO items ...`

### Option B: Use a Backend-as-a-Service (Supabase/Firebase)
If you don't want to write a custom backend, you can migrate the schema to Supabase (which uses Postgres) and use their JavaScript Client SDK directly in the frontend.

## 3. Update Frontend Services
Once your API is running (e.g., at `https://your-railway-app.up.railway.app`), update the files in `services/mock/` to fetch data from your API instead of returning static data.

**Example `services/items.ts` update:**
```typescript
// Old Mock
// return mockItems;

// New Real Implementation
const response = await fetch('https://your-railway-app.up.railway.app/api/items');
return await response.json();
```
