"use client";


export const loadFromLocalStorage = (key: string, fallback: []) => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : fallback;
    }
    return fallback; 
  };