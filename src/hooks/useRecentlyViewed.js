import { useSyncExternalStore } from "react";

// "Recently viewed" products, kept in localStorage (per browser, no login
// needed). Only a small snapshot of each product is stored, enough to render
// a card without another API call.

const KEY = "recentlyViewed";
const MAX_ITEMS = 12;
const EVENT = "recently-viewed-change";
const EMPTY = [];

let cachedRaw = null;
let cachedList = EMPTY;

const read = () => {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  // Return the same array while storage is unchanged, so React doesn't re-render.
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  try {
    const parsed = JSON.parse(raw || "[]");
    cachedList = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cachedList = EMPTY;
  }
  return cachedList;
};

const write = (list) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — not critical */
  }
  window.dispatchEvent(new Event(EVENT));
};

export const addRecentlyViewed = (product) => {
  if (!product?._id || !product.slug) return;
  const snapshot = {
    _id: product._id,
    slug: product.slug,
    productName: product.productName,
    brand: product.brand,
    price: product.price,
    discountPrice: product.discountPrice,
    thumbnail: product.variants?.[0]?.thumbnail || product.thumbnail,
    viewedAt: Date.now(),
  };
  const rest = read().filter((p) => p._id !== product._id);
  write([snapshot, ...rest].slice(0, MAX_ITEMS));
};

export const clearRecentlyViewed = () => write([]);

const subscribe = (callback) => {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback); // other tabs
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

/** Live list of recently viewed products, newest first. */
const useRecentlyViewed = () => useSyncExternalStore(subscribe, read, () => EMPTY);

export default useRecentlyViewed;
