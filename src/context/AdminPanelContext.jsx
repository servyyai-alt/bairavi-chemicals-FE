import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllInquiries, getAllOrders } from '../services/api';

const AdminPanelContext = createContext(null);

const SEARCH_PLACEHOLDERS = {
  '/admin/dashboard': 'Search dashboard orders, customers, status...',
  '/admin/products': 'Search products, categories, tags...',
  '/admin/categories': 'Search categories or records...',
  '/admin/orders': 'Search order ID, customer, phone, product, status...',
  '/admin/inquiries': 'Search inquiries, names, email, phone, subject...',
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
    id: `order-${order._id}`,
    entityId: order._id,
    type: 'order',
    href: '/admin/orders',
    title: 'New order received',
    customerName: order.user?.name || order.shippingAddress?.fullName || 'New customer',
    phone: order.shippingAddress?.phone || order.user?.phone || '',
    totalAmount: order.totalPrice || 0,
    createdAt: order.createdAt,
    status: order.orderStatus || 'pending',
    unread
  };
}

function buildInquiryNotification(inquiry, unread = false) {
  return {
    id: `inquiry-${inquiry._id}`,
    entityId: inquiry._id,
    type: 'inquiry',
    href: '/admin/inquiries',
    title: 'New inquiry received',
    customerName: inquiry.name || 'New inquiry',
    phone: inquiry.phone || '',
    email: inquiry.email || '',
    subject: inquiry.subject || 'General inquiry',
    createdAt: inquiry.createdAt,
    status: inquiry.status || 'new',
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
  const knownInquiryIdsRef = useRef(new Set());
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

    const syncNotifications = async () => {
      try {
        const [{ data: orderData }, { data: inquiryData }] = await Promise.all([
          getAllOrders(),
          getAllInquiries()
        ]);

        if (cancelled) return;

        const orders = Array.isArray(orderData.orders) ? orderData.orders : [];
        const inquiries = Array.isArray(inquiryData.inquiries) ? inquiryData.inquiries : [];
        const nextOrderIds = new Set(orders.map((order) => order._id));
        const nextInquiryIds = new Set(inquiries.map((inquiry) => inquiry._id));

        if (!initializedRef.current) {
          knownOrderIdsRef.current = nextOrderIds;
          knownInquiryIdsRef.current = nextInquiryIds;

          setNotifications((prev) => {
            const existingMap = new Map(prev.map((item) => [item.id, item]));
            return [
              ...orders.map((order) => buildOrderNotification(order, false)),
              ...inquiries.map((inquiry) => buildInquiryNotification(inquiry, false))
            ]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 8)
              .map((item) => existingMap.get(item.id) || item);
          });

          initializedRef.current = true;
          return;
        }

        const newOrders = orders.filter((order) => !knownOrderIdsRef.current.has(order._id));
        const newInquiries = inquiries.filter((inquiry) => !knownInquiryIdsRef.current.has(inquiry._id));
        knownOrderIdsRef.current = nextOrderIds;
        knownInquiryIdsRef.current = nextInquiryIds;

        setNotifications((prev) => {
          const existingMap = new Map(prev.map((item) => [item.id, item]));
          const next = [
            ...orders.map((order) => buildOrderNotification(order, false)),
            ...inquiries.map((inquiry) => buildInquiryNotification(inquiry, false))
          ]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8)
            .map((item) => {
              const existing = existingMap.get(item.id);
              return existing ? { ...existing, ...item } : item;
            });

          if (newOrders.length === 0 && newInquiries.length === 0) {
            return next;
          }

          return next.map((item) => {
            const isNewOrder = item.type === 'order' && newOrders.some((order) => order._id === item.entityId);
            const isNewInquiry = item.type === 'inquiry' && newInquiries.some((inquiry) => inquiry._id === item.entityId);
            return isNewOrder || isNewInquiry ? { ...item, unread: true } : item;
          });
        });
      } catch {
        // Ignore polling errors; the panel should remain usable.
      }
    };

    syncNotifications();
    pollRef.current = setInterval(syncNotifications, 15000);

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, []);

  const currentSearch = searchByPath[pathname] || '';
  const unreadCount = notifications.filter((item) => item.unread).length;

  const setCurrentSearch = (value) => {
    setSearchByPath((prev) => ({ ...prev, [pathname]: value }));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
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
