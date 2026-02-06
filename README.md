# FosaRide

A ride-sharing web application built with the **MERN stack** (MongoDB, Express, React, Node.js).

Passengers request rides, drivers offer prices, and admins manage driver approvals — all with a tropical-themed UI.

---

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | React 18 + Vite + React Router |
| Backend  | Express.js + Mongoose          |
| Database | MongoDB                        |
| Auth     | bcryptjs (password hashing)    |
| Style    | Custom CSS (tropical theme)    |

---

## Project Structure

```
FosaRide/
├── client/                  # React frontend (Vite)
│   ├── public/
│   │   └── logo.png         # App logo (circular, used in navbar/footer/login)
│   ├── src/
│   │   ├── components/      # Navbar, Footer
│   │   ├── context/         # AuthContext (login state)
│   │   ├── pages/           # Login, Register, UserDashboard, DriverDashboard, AdminDashboard
│   │   ├── App.jsx          # Routes
│   │   └── App.css          # All styles (tropical theme)
│   ├── index.html
│   └── vite.config.js       # Dev server + API proxy
├── server/                  # Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── middleware/auth.js   # Simple header-based auth
│   ├── models/              # User, Driver, Admin, Ride (Mongoose)
│   ├── routes/              # auth, rides, drivers, admin
│   ├── seed.js              # Creates default admin accounts
│   ├── server.js            # Entry point
│   └── .env                 # MongoDB URI + port (DO NOT COMMIT)
└── README.md
```

---

## Prerequisites

- **Node.js** v18+ (with npm)
- **MongoDB** running on your machine or a remote URI (Atlas, etc.)

---

## Setup (first time)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/FosaRide.git
cd FosaRide
```

### 2. Install dependencies

```bash
# From the root folder
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 3. Configure the database

Copy the example env file and edit it:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your MongoDB connection:

```env
MONGO_URI=mongodb://localhost:27017/fosaride
PORT=5000
```

**WSL users:** If MongoDB runs on Windows, use the gateway IP instead of `localhost`:

```bash
# Find your Windows host IP from WSL
ip route show default | awk '{print $3}'
# Example result: 172.29.208.1
```

Then set:

```env
MONGO_URI=mongodb://172.29.208.1:27017/fosaride
```

> **Windows MongoDB config:** Make sure `mongod.cfg` has `bindIp: 0.0.0.0` and the firewall allows port 27017. See [MongoDB WSL Setup](#mongodb-on-windows--wsl) below.

### 4. Seed the database

```bash
cd server && npx node seed.js
```

This creates test accounts:

| Username | Password | Role            |
|----------|----------|-----------------|
| `admin`  | `dabou`  | Admin (+ User & Driver for testing) |
| `admin2` | `Lavisy` | Admin           |

> Admin is auto-detected at login — just type admin credentials with any role selected.

### 5. Start the app

You need **two terminals**:

**Terminal 1 — Backend:**

```bash
cd server && npx nodemon server.js
```

Runs on `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
cd client && npx vite
```

Runs on `http://localhost:3000`

### 6. Open in browser

Go to **http://localhost:3000** and log in.

---

## Daily Startup Checklist

Every time you come back to work on the project:

```
1. Make sure MongoDB is running
   - Windows: services.msc → MongoDB Server → Running
   - Docker:  docker start mongo
   - Atlas:   always running

2. Terminal 1 → Start backend
   cd FosaRide/server && npx nodemon server.js

3. Terminal 2 → Start frontend
   cd FosaRide/client && npx vite

4. Open http://localhost:3000

5. If ports are stuck from a previous session:
   lsof -ti:5000 -ti:3000 | xargs kill -9
```

---

## Features by Role

### Passenger (User)
- Register and login
- Request a ride (source, destination, passengers)
- Automatic discounts (10% first ride, 5% for 2 passengers)
- View driver offers and accept one
- Rate drivers (1-5 stars)
- View driver average ratings

### Driver
- Register (requires admin approval)
- Add/remove favorite areas
- View rides matching favorite areas
- View all pending rides
- Suggest a price for a ride
- View own ratings

### Admin
- Auto-detected at login (no "Admin" option in UI)
- View pending driver registrations
- Approve or suspend drivers
- Reactivate suspended drivers
- View all drivers with status

---

## MongoDB on Windows + WSL

If you run MongoDB on Windows and code in WSL:

1. **Edit** `C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg`:
   ```yaml
   net:
     port: 27017
     bindIp: 0.0.0.0
   ```

2. **Restart** MongoDB (PowerShell as Admin):
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

3. **Open firewall** (PowerShell as Admin):
   ```powershell
   netsh advfirewall firewall add rule name="MongoDB" dir=in action=allow protocol=TCP localport=27017
   ```

4. **Find the IP** from WSL:
   ```bash
   ip route show default | awk '{print $3}'
   ```

5. **Set** that IP in `server/.env`:
   ```env
   MONGO_URI=mongodb://172.29.208.1:27017/fosaride
   ```

> Note: The WSL gateway IP can change after reboot. If the app can't connect, re-run the `ip route` command and update `.env`.

---

## API Endpoints

| Method | Route                             | Role   | Description                  |
|--------|-----------------------------------|--------|------------------------------|
| POST   | `/api/auth/register/user`         | Public | Register a passenger         |
| POST   | `/api/auth/register/driver`       | Public | Register a driver (pending)  |
| POST   | `/api/auth/login`                 | Public | Login (auto-detects admin)   |
| GET    | `/api/rides/my`                   | User   | Get my rides                 |
| POST   | `/api/rides`                      | User   | Request a new ride           |
| POST   | `/api/rides/:id/accept`           | User   | Accept a driver's offer      |
| GET    | `/api/rides/available`            | Driver | Rides in my favorite areas   |
| GET    | `/api/rides/all-pending`          | Driver | All pending rides            |
| POST   | `/api/rides/:id/offer`            | Driver | Suggest a price              |
| GET    | `/api/drivers`                    | Auth   | List active drivers          |
| POST   | `/api/drivers/:id/rate`           | User   | Rate a driver (1-5)          |
| POST   | `/api/drivers/favorite-area`      | Driver | Add a favorite area          |
| DELETE | `/api/drivers/favorite-area/:area`| Driver | Remove a favorite area       |
| GET    | `/api/drivers/ratings`            | Driver | My ratings                   |
| GET    | `/api/admin/pending-drivers`      | Admin  | List pending registrations   |
| GET    | `/api/admin/drivers`              | Admin  | List all drivers             |
| PUT    | `/api/admin/approve-driver/:id`   | Admin  | Approve a driver             |
| PUT    | `/api/admin/suspend-driver/:id`   | Admin  | Suspend a driver             |
| PUT    | `/api/admin/reactivate-driver/:id`| Admin  | Reactivate a driver          |

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT
