import { loadFromLocalStorage } from "@/lib/useLocalStorge";
import { RootState } from "@/redux/store";
import { Extra, Size } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  quantity?: number;
  name: string;
  basePrice: number;
  image: string;
  size: Size;
  extra: Extra[];
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items:  loadFromLocalStorage("cartItem", []) || [],
};

const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
        existingItem.size = action.payload.size;
        existingItem.extra = action.payload.extra;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    removeCartItem: (state, action: PayloadAction<{ id: string }>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        if (existingItem.quantity! === 0) {
          state.items.filter((item) => item.id !== action.payload.id);
        } else {
          existingItem.quantity! -= 1;
        }
      }
    },

    removeItemFromCart: (state, action: PayloadAction<{ id: string }>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeItemFromCart, removeCartItem, clearCart } =
  cart.actions;
export default cart.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
