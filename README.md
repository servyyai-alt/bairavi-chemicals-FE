# Sri Bairavi Chemicals – Frontend

React + Tailwind frontend for the Sri Bairavi Chemicals e-commerce platform.

## Stack
- React 18 + Vite
- Tailwind CSS (custom chemical theme)
- React Router v6
- Axios
- React Hot Toast

## Setup

```bash
npm install
cp .env.example .env    # fill in VITE_API_URL and VITE_RAZORPAY_KEY_ID
npm run dev
```

## Color Theme

| Token | Hex | Usage |
|---|---|---|
| `primary-600` | `#0B4F9C` | Buttons, links, accents |
| `primary-900` | `#083B73` | Dark backgrounds (hero, admin sidebar) |
| `chem-green` | `#4CAF50` | Secondary highlights |
| `chem-bg` | `#F5F9FC` | Page backgrounds |

## Folder Structure

```
src/
├── components/
│   ├── admin/AdminLayout.jsx
│   └── common/
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       ├── ProductCard.jsx
│       └── Loader.jsx
├── context/         # Auth, Cart, AdminPanel
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── ContactPage.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProducts.jsx
│       ├── AdminCategories.jsx
│       ├── AdminOrders.jsx
│       └── AdminUsers.jsx
├── services/api.js
└── routes/ProtectedRoute.jsx
```
