import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getCart as apiGetCart, syncCart as apiSyncCart } from '../utils/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const userId = user?.id || user?._id || null;
  const storageKey = useMemo(() => (userId ? `cart:${userId}` : 'cart:guest'), [userId]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Merge helper: combine items by stable key (productId if present) and sum quantities
  const mergeItems = (a = [], b = [], c = []) => {
    const map = new Map();
    const addAll = (list) => {
      for (const it of list) {
        if (!it) continue;
        const key = it.productId || it.id;
        if (!key) continue;
        const prev = map.get(key) || { ...it, qty: 0 };
        map.set(key, { ...prev, ...it, qty: (prev.qty || 0) + (it.qty || 0) });
      }
    };
    addAll(a);
    addAll(b);
    addAll(c);
    return Array.from(map.values());
  };

  const isValidObjectId = (v) => typeof v === 'string' && /^[a-f\d]{24}$/i.test(v);

  // Load cart when user or storageKey changes
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (token && userId) {
          console.log('Loading cart for user:', userId);
          
          // Load local sources first to prevent empty cart flash
          const guestRaw = localStorage.getItem('cart:guest');
          const guestItems = guestRaw ? JSON.parse(guestRaw) : [];
          const localUserRaw = localStorage.getItem(storageKey);
          const localUserItems = localUserRaw ? JSON.parse(localUserRaw) : [];
          
          // Set local items immediately to prevent empty cart
          const localMerged = mergeItems(localUserItems, guestItems);
          if (mounted && localMerged.length > 0) {
            setItems(localMerged);
          }

          try {
            // Load current server cart
            const serverCart = await apiGetCart(token);
            const serverItems = (serverCart?.items || []).map((it) => ({
              id: it.product?._id || String(it.product),
              productId: it.product?._id || String(it.product),
              qty: it.quantity,
              name: it.product?.name,
              price: it.product?.discountPrice ?? it.product?.salePrice ?? it.product?.price ?? it.product?.mrp,
              image: Array.isArray(it.product?.images) && it.product.images.length ? it.product.images[0] : (it.product?.image || null),
              product: it.product || undefined,
            }));

            // Merge server + guest + prior per-user local (so we never lose local on relogin)
            const merged = mergeItems(serverItems, guestItems, localUserItems);

            if (mounted) {
              setItems(merged);
              localStorage.setItem(storageKey, JSON.stringify(merged));
            }

            // Sync merged to server and clear guest snapshot
            try {
              const syncable = merged
                .map((it) => ({ productId: it.productId || it.id, qty: it.qty }))
                .filter((it) => isValidObjectId(it.productId) && it.qty > 0);
              const payload = { items: syncable };
              await apiSyncCart(payload, token);
              localStorage.removeItem('cart:guest');
            } catch (syncError) {
              console.warn('Cart sync failed:', syncError);
              // Keep local cart even if sync fails
            }
          } catch (serverError) {
            console.warn('Server cart fetch failed:', serverError);
            // Use local cart as fallback
            if (mounted) {
              setItems(localMerged);
              localStorage.setItem(storageKey, JSON.stringify(localMerged));
            }
          }
        } else {
          // Load guest or prior local cart for this user namespace
          const saved = localStorage.getItem(storageKey);
          const parsed = saved ? JSON.parse(saved) : [];
          if (mounted) setItems(parsed);
        }
      } catch (error) {
        console.error('Cart loading error:', error);
        // Fallback: merge guest + per-user local snapshot so cart doesn't appear empty
        const guestRaw = localStorage.getItem('cart:guest');
        const guestItems = guestRaw ? JSON.parse(guestRaw) : [];
        const saved = localStorage.getItem(storageKey);
        const localUserItems = saved ? JSON.parse(saved) : [];
        const merged = mergeItems(localUserItems, guestItems);
        if (mounted) setItems(merged);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [token, storageKey, userId]);

  // Persist and sync when items change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {}
    if (token) {
      const syncable = items
        .map((it) => ({ productId: it.productId || it.id, qty: it.qty }))
        .filter((it) => isValidObjectId(it.productId) && it.qty > 0);
      const payload = { items: syncable };
      apiSyncCart(payload, token).catch(() => {});
    }
  }, [items, token, storageKey]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  const refreshCart = async () => {
    if (!token || !userId) return;
    setLoading(true);
    try {
      const serverCart = await apiGetCart(token);
      const serverItems = (serverCart?.items || []).map((it) => ({
        id: it.product?._id || String(it.product),
        productId: it.product?._id || String(it.product),
        qty: it.quantity,
        name: it.product?.name,
        price: it.product?.discountPrice ?? it.product?.salePrice ?? it.product?.price ?? it.product?.mrp,
        image: Array.isArray(it.product?.images) && it.product.images.length ? it.product.images[0] : (it.product?.image || null),
        product: it.product || undefined,
      }));
      setItems(serverItems);
      localStorage.setItem(storageKey, JSON.stringify(serverItems));
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const itemCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);

  const value = { items, addToCart, removeFromCart, clearCart, itemCount, loading, refreshCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
