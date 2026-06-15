import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UiState, Toast, ToastType } from '../types';

let toastId = 0;

const initialState: UiState = {
  isDark: false, highContrast: false, sidebarCollapsed: false, toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDark(state) { state.isDark = !state.isDark; },
    setDark(state, action: PayloadAction<boolean>) { state.isDark = action.payload; },
    toggleHighContrast(state) { state.highContrast = !state.highContrast; },
    setHighContrast(state, action: PayloadAction<boolean>) { state.highContrast = action.payload; },
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) { state.sidebarCollapsed = action.payload; },
    addToast(state, action: PayloadAction<{ msg: string; type?: ToastType }>) {
      const toast: Toast = { id: ++toastId, msg: action.payload.msg, type: action.payload.type ?? 'success' };
      state.toasts = [toast, ...state.toasts.slice(0, 4)];
    },
    removeToast(state, action: PayloadAction<number>) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const { toggleDark, setDark, toggleHighContrast, setHighContrast, toggleSidebar, setSidebarCollapsed, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
