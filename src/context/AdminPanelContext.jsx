import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllOrders } from '../services/api';

const AdminPanelContext = createContext(null);

const SEARCH_PLACEHOLDERS = {
  '/admin/dashboard': 'Search dashboard orders, customers, status...',
  '/admin/products': 'Search products, categories, tags...',
  '/admin/categories': 'Search categories or records...',
  '/admin/orders': 'Search order ID, customer, phone, product, status...',
  '/admin/users': 'Search users, phone, email, role...'
};

const STORAGE_KEY = 'vallal_admin_notifications';

function readStoredNotifications() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildOrderNotification(order, unread = false) {
  return {
    id: order._id,
    orderId: order._id,
    customerName: order.user?.name || order.shippingAddress?.fullName || 'New customer',
    phone: order.shippingAddress?.phone || order.user?.phone || '',
    totalAmount: order.totalPrice || 0,
    createdAt: order.createdAt,
    status: order.orderStatus || 'pending',
    unread
  };
}

export function AdminPanelProvider({ children }) {
  const { pathname } = useLocation();
  const [searchByPath, setSearchByPath] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const initializedRef = useRef(false);
  const knownOrderIdsRef = useRef(new Set());
  const pollRef = useRef(null);

  useEffect(() => {
    setNotifications(readStoredNotifications());
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    setNotificationOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    const syncOrders = async () => {
      try {
        const { data } = await getAllOrders();
        if (cancelled) return;

        const orders = Array.isArray(data.orders) ? data.orders : [];
        const nextIds = new Set(orders.map(order => order._id));

        if (!initializedRef.current) {
          knownOrderIdsRef.current = nextIds;
          setNotifications(prev => {
            const existingMap = new Map(prev.map(item => [item.id, item]));
            const merged = orders
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 8)
              .map(order => existingMap.get(order._id) || buildOrderNotification(order, false));
            return merged;
          });
          initializedRef.current = true;
          return;
        }

        const newOrders = orders.filter(order => !knownOrderIdsRef.current.has(order._id));
        knownOrderIdsRef.current = nextIds;

        setNotifications(prev => {
          const existingMap = new Map(prev.map(item => [item.id, item]));
          const next = orders
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8)
            .map(order => {
              const existing = existingMap.get(order._id);
              if (existing) {
                return {
                  ...existing,
                  customerName: order.user?.name || order.shippingAddress?.fullName || existing.customerName,
                  phone: order.shippingAddress?.phone || order.user?.phone || existing.phone,
                  totalAmount: order.totalPrice || existing.totalAmount,
                  createdAt: order.createdAt || existing.createdAt,
                  status: order.orderStatus || existing.status
                };
              }
              return buildOrderNotification(order, false);
            });

          if (newOrders.length === 0) return next;

          return next.map(item =>
            newOrders.some(order => order._id === item.id)
              ? { ...item, unread: true }
              : item
          );
        });
      } catch {
        // Ignore polling errors; the panel should remain usable.
      }
    };

    syncOrders();
    pollRef.current = setInterval(syncOrders, 15000);

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, []);

  const currentSearch = searchByPath[pathname] || '';
  const unreadCount = notifications.filter(item => item.unread).length;

  const setCurrentSearch = value => {
    setSearchByPath(prev => ({ ...prev, [pathname]: value }));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, unread: false })));
  };

  const value = useMemo(
    () => ({
      currentSearch,
      setCurrentSearch,
      searchPlaceholder: SEARCH_PLACEHOLDERS[pathname] || 'Search records...',
      notifications,
      unreadCount,
      notificationOpen,
      setNotificationOpen,
      markAllAsRead
    }),
    [currentSearch, pathname, notifications, unreadCount, notificationOpen]
  );

  return <AdminPanelContext.Provider value={value}>{children}</AdminPanelContext.Provider>;
}

export function useAdminPanel() {
  const context = useContext(AdminPanelContext);
  if (!context) {
    throw new Error('useAdminPanel must be used within an AdminPanelProvider');
  }
  return context;
}
