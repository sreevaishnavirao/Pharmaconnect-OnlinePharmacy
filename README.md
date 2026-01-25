# Integrated Online Pharmacy (React + Spring Boot)

This bundle contains:
- `frontend/` – React (Vite) client
- `backend/` – Spring Boot + PostgreSQL API

## Run backend
1. Create a PostgreSQL database named `onlinepharmacy` (or update `backend/src/main/resources/application.properties`).
2. Update DB credentials in `backend/src/main/resources/application.properties`.
3. Run the backend using your IDE or Maven wrapper (if you have Maven installed locally).
   - Main class: `com.onlinepharmacy.backend.BackendApplication`
4. Backend runs at `http://localhost:8080`.

## Run frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Frontend runs at `http://localhost:5173`

## Notes on integration changes
- Frontend now calls the backend endpoints under `/api/...` and uses cookies (`credentials: include`).
- Cart now supports:
  - local cart for anonymous users
  - automatic sync to backend cart after login
- Checkout places an order via `POST /api/order/users/payments/{paymentMethod}`.
- Backend now includes:
  - CORS settings for the Vite dev server
  - filesystem image serving at `/images/**` mapped to the `backend.image` folder (default `images/`)
  - JWT secret handling fixed (treats the secret as a raw string, not Base64)
