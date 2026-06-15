import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { InventoryState, InventoryItem } from '../types';

const MOCK_ITEMS: InventoryItem[] = [
  { id: 1,  name: 'Whole Milk',      category: 'Dairy',   expiryDate: '2026-06-12', daysLeft: 1,  status: 'Expiring Soon', quantity: 1,  unit: 'gallon', userId: 1, userName: 'Alice Johnson' },
  { id: 2,  name: 'Greek Yogurt',    category: 'Dairy',   expiryDate: '2026-06-15', daysLeft: 4,  status: 'Expiring Soon', quantity: 2,  unit: 'cups',   userId: 2, userName: 'Bob Smith' },
  { id: 3,  name: 'Sourdough Bread', category: 'Bakery',  expiryDate: '2026-06-13', daysLeft: 2,  status: 'Expiring Soon', quantity: 1,  unit: 'loaf',   userId: 3, userName: 'Carol Davis' },
  { id: 4,  name: 'Chicken Breast',  category: 'Meat',    expiryDate: '2026-06-11', daysLeft: 0,  status: 'Expired',       quantity: 2,  unit: 'lbs',    userId: 4, userName: 'David Lee' },
  { id: 5,  name: 'Baby Spinach',    category: 'Produce', expiryDate: '2026-06-16', daysLeft: 5,  status: 'Fresh',         quantity: 1,  unit: 'bag',    userId: 5, userName: 'Eve Martinez' },
  { id: 6,  name: 'Cheddar Cheese',  category: 'Dairy',   expiryDate: '2026-06-25', daysLeft: 14, status: 'Fresh',         quantity: 1,  unit: 'block',  userId: 1, userName: 'Alice Johnson' },
  { id: 7,  name: 'Orange Juice',    category: 'Beverage',expiryDate: '2026-06-18', daysLeft: 7,  status: 'Fresh',         quantity: 1,  unit: 'carton', userId: 2, userName: 'Bob Smith' },
  { id: 8,  name: 'Strawberries',    category: 'Produce', expiryDate: '2026-06-14', daysLeft: 3,  status: 'Expiring Soon', quantity: 1,  unit: 'pint',   userId: 5, userName: 'Eve Martinez' },
  { id: 9,  name: 'Peanut Butter',   category: 'Pantry',  expiryDate: '2026-09-01', daysLeft: 82, status: 'Fresh',         quantity: 1,  unit: 'jar',    userId: 1, userName: 'Alice Johnson' },
  { id: 10, name: 'Eggs',            category: 'Dairy',   expiryDate: '2026-06-24', daysLeft: 13, status: 'Fresh',         quantity: 12, unit: 'count',  userId: 3, userName: 'Carol Davis' },
];

const initialState: InventoryState = {
  items: MOCK_ITEMS, loading: false, error: null,
  filter: { search: '', category: 'All', status: 'All' },
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<InventoryItem[]>) { state.items = action.payload; },
    addItem(state, action: PayloadAction<InventoryItem>) { state.items.unshift(action.payload); },
    updateItem(state, action: PayloadAction<InventoryItem>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteItem(state, action: PayloadAction<number>) { state.items = state.items.filter(i => i.id !== action.payload); },
    setFilter(state, action: PayloadAction<Partial<InventoryState['filter']>>) { state.filter = { ...state.filter, ...action.payload }; },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
    setError(state, action: PayloadAction<string | null>) { state.error = action.payload; },
  },
});

export const { setItems, addItem, updateItem, deleteItem, setFilter, setLoading, setError } = inventorySlice.actions;
export default inventorySlice.reducer;
