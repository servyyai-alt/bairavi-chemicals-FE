import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FaWhatsapp } from 'react-icons/fa';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AdminPanelProvider } from './context/AdminPanelContext';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import PolicyPage from './pages/PolicyPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return null;
}

function WhatsAppButton() {
  const whatsappUrl = 'https://wa.me/918940448177?text=Hello%20Sri%20Bairavi%20Chemicals%2C%20send%20me%20your%20product%20list.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-[#1ebe5d]"
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

function AdminShell({ children }) {
  return <AdminPanelProvider>{children}</AdminPanelProvider>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '12px', fontFamily: "Inter, sans-serif, sans-serif', fontSize: '14px'" },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } }
          }} />
          <WhatsAppButton />
          <Routes>
            {/* Public routes with Navbar + Footer */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/products/:slug" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/privacy-policy" element={<Layout><PolicyPage /></Layout>} />
            <Route path="/terms-and-conditions" element={<Layout><PolicyPage /></Layout>} />
            <Route path="/refund-cancellation-policy" element={<Layout><PolicyPage /></Layout>} />
            <Route path="/safety-guidelines" element={<Layout><PolicyPage /></Layout>} />
            <Route path="/user-verification-policy" element={<Layout><PolicyPage /></Layout>} />

            {/* Auth routes (no nav/footer) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected user routes */}
            <Route path="/cart" element={<Layout><ProtectedRoute><CartPage /></ProtectedRoute></Layout>} />
            <Route path="/wishlist" element={<Layout><ProtectedRoute><WishlistPage /></ProtectedRoute></Layout>} />
            <Route path="/checkout" element={<Layout><ProtectedRoute><CheckoutPage /></ProtectedRoute></Layout>} />
            <Route path="/order-confirmation/:id" element={<Layout><ProtectedRoute><OrderConfirmationPage /></ProtectedRoute></Layout>} />
            <Route path="/orders" element={<Layout><ProtectedRoute><OrderHistoryPage /></ProtectedRoute></Layout>} />
            <Route path="/orders/:id" element={<Layout><ProtectedRoute><OrderConfirmationPage /></ProtectedRoute></Layout>} />
            <Route path="/profile" element={<Layout><ProtectedRoute><ProfilePage /></ProtectedRoute></Layout>} />

            {/* Admin routes (no shared nav/footer, have own layout) */}
            <Route path="/admin" element={<AdminRoute><AdminShell><Navigate to="/admin/dashboard" replace /></AdminShell></AdminRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminShell><AdminDashboard /></AdminShell></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminShell><AdminProducts /></AdminShell></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminShell><AdminCategories /></AdminShell></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminShell><AdminOrders /></AdminShell></AdminRoute>} />
            <Route path="/admin/inquiries" element={<AdminRoute><AdminShell><AdminInquiries /></AdminShell></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminShell><AdminUsers /></AdminShell></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminShell><AdminSettings /></AdminShell></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                  <div className="text-7xl mb-4">🧪</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                  <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
