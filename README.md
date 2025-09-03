# ZoomCart 🛒

A **MERN + Firebase** based e-commerce project where users can browse products, add to cart, place orders, and admins can manage products/users/orders.

> **Stacks:** React (Vite), Tailwind, React Router, TanStack Query, Node.js, Express.js, MongoDB, Firebase Auth, JWT

---

## ✨ Feature Highlights

### Home
- Top banner/hero section
- **Category-wise 4 products** display
- **Discounted products** shown in slider/grid

### Products
- All products listing
- Search (name/slug), sort (price etc.)
- **Each card has `Add to Cart`** button
- On `Add to Cart`, a **View Cart** button appears → clicking opens a **modal**
- From modal: delete cart item, start checkout process

### Cart & Checkout
- Navbar **Cart icon** shows cart counter
- From cart modal, **Cancel** clears/removes items
- On **Checkout**, shipping page → name, address, phone, **Cash on Delivery** → Submit → order completed

### Authentication (Firebase)
- Login / Register / Logout
- **Firebase Access Token** generated, valid for **1 hour**
- Backend protected with **verify Firebase token + JWT**

### Dashboard (Role-based)
- **Roles:** `Admin`, `User`

#### User Dashboard
- **My Orders**: user can see their own orders

#### Admin Dashboard
- **Manage Products**: Add / List / Update / Delete
- **Manage Users**: List all users, **Delete**, **Change role (User ⇄ Admin)**
- **Manage Orders**: See all orders, **Accept** → `status: "Completed"`

---

## 🧱 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, TanStack Query, Axios  
- **Backend:** Node.js, Express.js, MongoDB, JWT  
- **Auth:** Firebase Authentication (email/password)  
- **Others:** React Hot Toast, SweetAlert2, Swiper  

---

## 🗂️ Repository Structure (separate repos)

- `zoomcart-frontend` → React app  
- `zoomcart-backend` → Express + MongoDB API  

> Each repo will have its own `README.md` and `.env.example`.

---

## 🔑 Environment Variables

### Backend `.env.example`
```env
DB_USER=my_database_user
DB_PASS=my_database_password
ZOOMCART_EMAIL_PASS=my_email_password
ZOOMCART_EMAIL=my_email@example.com
FB_SERVICE_KEY=my_firebase_service_key



# JWT (if you issue server-side tokens)
JWT_SECRET=your_jwt_secret_here

# Email (nodemailer / app password)
ZOOMCART_EMAIL=your_email@example.com
ZOOMCART_EMAIL_PASS=your_email_app_password

# Firebase Admin (service account as base64 or JSON path)
FB_SERVICE_KEY=your_firebase_service_key_or_base64_json
