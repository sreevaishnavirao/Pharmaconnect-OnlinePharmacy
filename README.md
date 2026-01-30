# PharmaConnect

This contains:
- `frontend/` – React  client
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

