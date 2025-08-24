// Utility for global localStorage operations
// Usage: import localStorageUtil from "../lib/localStorageUtil";

const localStorageUtil = {
  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // handle error or fallback
      console.warn('#localstorage error ', e);
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
    } catch (e) {
        console.warn('#localstorage error ', e);
        return null;
    }
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('#localstorage error ', e);
    }
  },
  clear() {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('#localstorage error ', e);
    }
  }
};

export default localStorageUtil;
