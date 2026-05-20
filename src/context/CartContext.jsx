import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart as addToCartAPI, updateCartItem, removeFromCart as removeAPI, clearCart as clearAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getDefaultVariant = (product) => (
    product?.variants?.find((variant) => variant.stock > 0) || product?.variants?.[0] || null
  );

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [], totalAmount: 0 });
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data.cart);
    } catch {}
  };

  const addToCart = async (productOrId, quantity = 1, selectedSize = '') => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return { success: false };
    }

    try {
      const isProductObject = typeof productOrId === 'object' && productOrId !== null;
      const productId = isProductObject ? productOrId._id : productOrId;
      const fallbackVariant = isProductObject ? getDefaultVariant(productOrId) : null;
      const sizeToSend = selectedSize || fallbackVariant?.size || '';

      const { data } = await addToCartAPI({ productId, quantity, selectedSize: sizeToSend });
      setCart(data.cart);
      toast.success('Added to cart!');
      return { success: true, cart: data.cart };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      return { success: false, error: err };
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await updateCartItem(itemId, { quantity });
      setCart(data.cart);
    } catch (err) { toast.error('Failed to update cart'); }
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await removeAPI(itemId);
      setCart(data.cart);
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  const clearCart = async () => {
    try {
      await clearAPI();
      setCart({ items: [], totalAmount: 0 });
    } catch {}
  };

  const increaseQty = async (productId, selectedSize = '') => {
    const existingItem = cart.items.find(item =>
      item.product._id === productId && (!selectedSize || item.selectedSize === selectedSize)
    );
    if (existingItem) {
      await updateItem(existingItem._id, existingItem.quantity + 1);
    }
  };

  const decreaseQty = async (productId, selectedSize = '') => {
    const existingItem = cart.items.find(item =>
      item.product._id === productId && (!selectedSize || item.selectedSize === selectedSize)
    );
    if (existingItem) {
      const minimumQuantity = Number(existingItem.moq || 1);

      if (existingItem.quantity <= minimumQuantity) {
        await removeItem(existingItem._id);
      } else {
        await updateItem(existingItem._id, existingItem.quantity - 1);
      }
    }
  };

  const cartCount = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateItem, removeItem, clearCart, fetchCart, loading, increaseQty, decreaseQty }}>
      {children}
    </CartContext.Provider>
  );
};
