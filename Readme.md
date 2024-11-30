# Real Caller
A Backend Simulation of TrueCaller

### Prerequisites

Ensure you have the following installed:

- **Node.js** (or Bun, if preferred)
- **Docker** and **Docker Compose**
- A package manager like **npm**, **yarn**, or **bun**

### Steps to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```
   
2. **Run Postgres Thorugh Docker**
   ```bash
   docker compose up -d
   ```
   
3. **Run migration**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start Dev Server**
   ```bash
   npm run start:dev
   ```
   
5. **Script for Data Population (this are not e2e tests)**
   ```bash
   npm run test:e2e
   ```
   

### Documentaion
	```bash
	Swagger UI: http://localhost:5000/api
	```
	
