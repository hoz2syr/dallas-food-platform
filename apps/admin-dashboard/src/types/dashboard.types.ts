export type ChartType = 'revenue' | 'orders' | 'customers';

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface Order {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface DashboardStats {
  ordersCount: number;
  revenue: number;
  customersCount: number;
  menuItemsCount: number;
  staffCount: number;
  chartData: Record<ChartType, ChartData>;
  lastOrders: Order[];
  ordersChange: number;
  revenueChange: number;
  customersChange: number;
  itemsChange: number;
  staffChange: number;
  averageOrderValue: number;
  averageOrderValueChange: number;
  tableOccupancyRate: number;
  additionalStats?: {
    // Any additional stats
  };
}
