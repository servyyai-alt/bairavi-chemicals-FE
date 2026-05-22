import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiHeart,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiX
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import logo from "../../assets/logo.jpeg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Contact", to: "/contact" }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const goToProducts = () => {
    navigate("/products");
    setMobileOpen(false);
  };

  const handleSignOut = () => {
    logout();
    setMobileOpen(false);
  };

  return (
    <>
      <div className="flex h-9 items-center overflow-hidden bg-[#003B7A] text-white sm:h-10">
        <div className="ticker whitespace-nowrap px-4 text-[11px] sm:text-sm">
          ISO Certified Supplier • Bulk Orders Available • Pan India Delivery •
          Industrial Chemicals • Detergent Solutions • Call: +91 89404 48177 •
        </div>
      </div>

      <header
        className="sticky top-0 z-50 transition-all"
        style={{
          background: "rgba(255,255,255,.95)",
          backdropFilter: "blur(18px)",
          boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,.05)" : "none"
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex h-[72px] items-center justify-between gap-3 sm:h-[82px]">
            <Link
              to="/"
              className="flex min-w-0 flex-1 items-center gap-2.5 md:flex-none"
            >
              <img
                src={logo}
                alt="Sri Bairavi Chemicals logo"
                className="h-11 w-11 rounded-full object-contain sm:h-14 sm:w-14"
              />

              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-[#003B7A] sm:text-2xl">
                  Sri Bairavi
                </h2>

                <p className="text-[10px] tracking-[2px] text-[#4E9A2D] sm:text-xs sm:tracking-[4px]">
                  CHEMICALS
                </p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex lg:gap-10">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`font-medium duration-300 ${
                    location.pathname === item.to
                      ? "text-[#0056A6]"
                      : "text-slate-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                onClick={goToProducts}
                className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-blue-50 md:flex"
              >
                <FiSearch className="h-5 w-5 text-[#003B7A]" />
              </button>

              <button
                onClick={goToProducts}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#003B7A] duration-300 hover:bg-blue-50 md:hidden"
              >
                <FiSearch className="h-5 w-5" />
              </button>

              <Link
                to="/contact"
                className="hidden rounded-xl bg-[#4E9A2D] px-6 py-3 font-medium text-white duration-300 hover:scale-105 md:flex"
              >
                Get Quote
              </Link>

              {!isAdmin && (
                <Link
                  to="/wishlist"
                  className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#003B7A] duration-300 hover:border-[#003B7A] hover:bg-blue-50 md:flex"
                >
                  <FiHeart className="h-5 w-5" />
                </Link>
              )}

              {!isAdmin && (
                <Link
                  to="/cart"
                  className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#003B7A] duration-300 hover:border-[#003B7A] hover:bg-blue-50 md:flex"
                >
                  <FiShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#4E9A2D] px-1 text-[10px] font-bold text-white">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="hidden items-center gap-3 md:flex">
                  {!isAdmin && (
                    <Link
                      to="/orders"
                      className="font-medium text-[#003B7A] duration-300 hover:text-[#4E9A2D]"
                    >
                      My Orders
                    </Link>
                  )}

                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/profile"}
                    className="font-medium text-[#003B7A] duration-300 hover:text-[#4E9A2D]"
                  >
                    {isAdmin ? "Admin Panel" : "My Account"}
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-slate-700 duration-300 hover:border-red-200 hover:text-red-500"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-3 md:flex">
                  <Link
                    to="/login"
                    className="font-medium text-[#003B7A] duration-300 hover:text-[#4E9A2D]"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl border border-[#003B7A] px-4 py-2.5 font-medium text-[#003B7A] duration-300 hover:bg-[#003B7A] hover:text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              <button
                onClick={() => setMobileOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-[#003B7A] duration-300 hover:bg-slate-50 md:hidden"
              >
                {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t bg-white shadow-lg md:hidden">
            <div className="space-y-4 px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={goToProducts}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-[#003B7A]"
                >
                  <FiSearch className="h-4 w-4" />
                  Search
                </button>

                <Link
                  to="/contact"
                  className="flex items-center justify-center rounded-xl bg-[#4E9A2D] py-3 text-sm font-medium text-white"
                >
                  Get Quote
                </Link>
              </div>

              <div className="space-y-1">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {item.label}
                    <FiArrowRight />
                  </Link>
                ))}
              </div>

              {!isAdmin && (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/wishlist"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-[#003B7A]"
                  >
                    <FiHeart className="h-4 w-4" />
                    Wishlist
                  </Link>

                  <Link
                    to="/cart"
                    className="relative flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium text-[#003B7A]"
                  >
                    <FiShoppingCart className="h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute right-2 top-2 rounded-full bg-[#4E9A2D] px-1.5 text-[10px] font-bold text-white">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {user ? (
                <>
                  {!isAdmin && (
                    <Link
                      to="/orders"
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      My Orders
                      <FiPackage className="h-4 w-4" />
                    </Link>
                  )}

                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/profile"}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {isAdmin ? "Admin Panel" : "My Account"}
                    <FiArrowRight />
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign In
                    <FiArrowRight />
                  </Link>

                  <Link
                    to="/register"
                    className="block rounded-xl border border-[#003B7A] py-3 text-center text-sm font-medium text-[#003B7A]"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
