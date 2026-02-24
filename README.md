# 🛍️ ShopWave — Full Stack E-Commerce

A modern, full-featured e-commerce application built with React, Node.js/Express, and MongoDB.

---

## ✨ Features

**Customer-facing**
- Browse & search products with category filters and sorting
- Product detail pages with reviews and star ratings
- Shopping cart with real-time quantity management
- 3-step checkout (shipping → payment → review)
- Order history and order status tracking
- User registration & login with JWT authentication

**Admin panel** (`/admin`)
- Dashboard with revenue, order, product, and user stats
- Manage orders and update fulfillment status
- Add / delete products
- View all customers

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| State | Context API (Auth + Cart) |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| HTTP client | Axios |
| Styling | Vanilla CSS (design system in `index.css`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone / extract the project

```bash
cd ecommerce
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env       # Edit MONGO_URI and JWT_SECRET
npm install
npm run seed               # Populate database with sample data
npm run dev                # Starts on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev                # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 👥 Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| Customer | jane@example.com | password123 |

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── server.js           # Express app entry point
│   ├── seed.js             # Database seeder
│   ├── .env.example        # Environment variables template
│   ├── models/
│   │   ├── User.js         # User schema (auth, address)
│   │   ├── Product.js      # Product + reviews schema
│   │   └── Order.js        # Order schema with line items
│   ├── routes/
│   │   ├── auth.js         # POST /login, /register, GET /me
│   │   ├── products.js     # CRUD + reviews + search
│   │   ├── orders.js       # Create, list, update status
│   │   └── users.js        # Admin user management
│   └── middleware/
│       └── auth.js         # JWT protect + admin guard
│
└── frontend/
    ├── vite.config.js      # Vite + dev proxy config
    ├── src/
    │   ├── App.jsx          # Router setup
    │   ├── api.js           # Axios instance with auth interceptor
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Global auth state
    │   │   └── CartContext.jsx  # Cart with localStorage persistence
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── Footer.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Products.jsx      # Search, filter, pagination
    │       ├── ProductDetail.jsx # Reviews, add to cart
    │       ├── Cart.jsx
    │       ├── Checkout.jsx      # 3-step flow
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Orders.jsx
    │       ├── OrderDetail.jsx
    │       └── AdminDashboard.jsx
```

---

## 🌐 API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List (search, filter, paginate) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/categories` | All categories |
| GET | `/api/products/:id` | Single product |
| POST | `/api/products` | Create (admin) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |
| POST | `/api/products/:id/reviews` | Add review |

### Orders
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my` | User's orders |
| GET | `/api/orders` | All orders (admin) |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/pay` | Mark as paid |
| PUT | `/api/orders/:id/status` | Update status (admin) |

---

## 🔧 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

---

## 🚢 Deployment Notes

- **Frontend**: `npm run build` → deploy `dist/` to Netlify/Vercel
- **Backend**: Deploy to Railway, Render, or any Node.js host
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/atlas) for production
- Update the Vite proxy in production to point to your deployed API URL
