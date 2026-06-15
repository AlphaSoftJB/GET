export type UserRole = 'Admin' | 'User' | 'Moderator';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export interface User {
  id: number; avatar: string; name: string; email: string;
  role: UserRole; status: UserStatus; lastLogin: string; scans: number; joined: string;
}

export type InventoryStatus = 'Fresh' | 'Expiring Soon' | 'Expired';
export type InventoryCategory = 'Dairy' | 'Produce' | 'Meat' | 'Bakery' | 'Pantry' | 'Beverage' | 'Frozen';

export interface InventoryItem {
  id: number; name: string; category: InventoryCategory; expiryDate: string;
  daysLeft: number; status: InventoryStatus; quantity: number; unit: string;
  userId: number; userName: string;
}

export type ReportType = 'User' | 'Inventory' | 'Health' | 'Analytics';
export type ReportFormat = 'PDF' | 'CSV' | 'Excel';

export interface Report {
  id: number; name: string; type: ReportType; date: string; format: ReportFormat; size: string;
}

export interface KpiCard {
  icon: string; title: string; value: number | string;
  suffix?: string; prefix?: string; trend: string; trendUp: boolean;
  color: string; tooltip?: string;
}

export interface ChartDataPoint {
  date: string; users?: number; scans?: number; items?: number;
  expired?: number; alerts?: number;
}

export interface AllergenDataPoint { name: string; value: number; color: string; }
export interface ProductDataPoint { name: string; scans: number; }
export interface CategoryDataPoint { cat: string; count: number; }

export interface LiveFeedEvent {
  id: number; user: string; action: string; icon: string; color: string; time: string;
}

export interface SystemHealthMetric { label: string; value: string; ok: boolean | null; }

export interface AnomalyDetection {
  time: string; metric: string; value: string;
  severity: 'high' | 'medium' | 'low' | 'info'; desc: string;
}

export interface PredictionDataPoint { week: string; actual: number | null; predicted: number; }
export interface StorageZone { zone: string; temp: string; items: string[]; emoji: string; }

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast { id: number; msg: string; type: ToastType; }

export interface Theme {
  bg: string; surface: string; card: string; border: string;
  text: string; textSub: string; hover: string; navBg: string;
  inputBg: string; chartGrid: string;
  shadow: Record<string, unknown>; spacing: Record<string, number>;
  radius: Record<string, number>; anim: Record<string, unknown>;
  zIndex: Record<string, number>; size: Record<string, unknown>;
}

export type PageId = 'dashboard' | 'users' | 'inventory' | 'analytics' | 'ai-analytics' | 'inventory-optimization' | 'health' | 'reports' | 'settings';

export interface NavItem { id: string; label: string; icon: string; badge?: number; }

export interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: UserRole; avatar: string } | null;
  token: string | null;
}

export interface UiState {
  isDark: boolean; highContrast: boolean; sidebarCollapsed: boolean; toasts: Toast[];
}

export interface InventoryState {
  items: InventoryItem[]; loading: boolean; error: string | null;
  filter: { search: string; category: string; status: string; };
}
