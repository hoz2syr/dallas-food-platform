
import React, { useEffect, useState, useCallback } from 'react';
import { StatCard } from '../components/StatCard';
import { MiniTable } from '../components/MiniTable';
import { RevenueChart } from '../components/RevenueChart';
import { fetchDashboardStats } from '../api/dashboard';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Card,
  CardContent,
  Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DashboardStats, ChartType } from '../types/dashboard.types';

interface DashboardOverviewPageProps {
  refreshInterval?: number;
}

const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({ refreshInterval = 30000 }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('revenue');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const chartLabels: Record<ChartType, string> = {
    revenue: 'الإيرادات (ر.س)',
    orders: 'عدد الطلبات',
    customers: 'عدد العملاء الجدد'
  };

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('فشل في جلب الإحصائيات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    let intervalId: NodeJS.Timeout;
    if (refreshInterval > 0) {
      intervalId = setInterval(loadDashboardData, refreshInterval);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [loadDashboardData, refreshInterval]);

  const handleRefresh = () => {
    loadDashboardData();
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLastRefresh = (date: Date): string => {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box sx={{ width: '100%', textAlign: 'center' }}>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            جاري تحميل البيانات...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="dashboard-overview-page" sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" fontWeight={700} color="primary.main">
            لوحة التحكم الرئيسية
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={`آخر تحديث: ${formatLastRefresh(lastRefresh)}`}
              size="small"
              color="info"
              variant="outlined"
            />
            <IconButton 
              onClick={handleRefresh} 
              color="primary"
              disabled={loading}
              aria-label="تحديث البيانات"
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body1" color="text.secondary">
          إحصائيات سريعة ونظرة عامة على أداء المطعم
        </Typography>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              إعادة المحاولة
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard 
                title="عدد الطلبات" 
                value={stats.ordersCount.toLocaleString('ar-SA')}
                icon="📋"
                change={stats.ordersChange}
                changeType={stats.ordersChange >= 0 ? 'increase' : 'decrease'}
                tooltip="إجمالي عدد الطلبات هذا الشهر"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard 
                title="الإيرادات" 
                value={formatCurrency(stats.revenue)}
                icon="💰"
                change={stats.revenueChange}
                changeType={stats.revenueChange >= 0 ? 'increase' : 'decrease'}
                tooltip="إجمالي الإيرادات هذا الشهر"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard 
                title="عدد العملاء" 
                value={stats.customersCount.toLocaleString('ar-SA')}
                icon="👥"
                change={stats.customersChange}
                changeType={stats.customersChange >= 0 ? 'increase' : 'decrease'}
                tooltip="إجمالي العملاء المسجلين"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard 
                title="عدد الأصناف" 
                value={stats.menuItemsCount.toLocaleString('ar-SA')}
                icon="🍽️"
                change={stats.itemsChange}
                changeType={stats.itemsChange >= 0 ? 'increase' : 'decrease'}
                tooltip="إجمالي الأصناف في القائمة"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard 
                title="عدد الموظفين" 
                value={stats.staffCount.toLocaleString('ar-SA')}
                icon="👨‍🍳"
                change={stats.staffChange}
                changeType={stats.staffChange >= 0 ? 'increase' : 'decrease'}
                tooltip="إجمالي عدد الموظفين"
              />
            </Grid>
          </Grid>

          {/* Chart and Recent Orders */}
          <Grid container spacing={3}>
            {/* Chart Section */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    المخطط البياني
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>اختر نوع البيانات</InputLabel>
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value as ChartType)}
                      label="اختر نوع البيانات"
                    >
                      <MenuItem value="revenue">الإيرادات</MenuItem>
                      <MenuItem value="orders">عدد الطلبات</MenuItem>
                      <MenuItem value="customers">عدد العملاء الجدد</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <RevenueChart 
                  data={stats.chartData[chartType]} 
                  label={chartLabels[chartType]}
                  height={300}
                />
              </Paper>
            </Grid>

            {/* Recent Orders Section */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight={600}>
                    آخر الطلبات
                  </Typography>
                  <Chip 
                    label={`${stats.lastOrders.length} طلب`}
                    size="small"
                    color="primary"
                  />
                </Box>
                <MiniTable rows={stats.lastOrders} />
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    variant="text" 
                    color="primary"
                    size="small"
                    onClick={() => window.location.href = '/orders'}
                  >
                    عرض جميع الطلبات →
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Stats - Optional */}
          {stats.additionalStats && (
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      متوسط قيمة الطلب
                    </Typography>
                    <Typography variant="h4" color="primary.main">
                      {formatCurrency(stats.averageOrderValue)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      مقارنة بالشهر الماضي: {stats.averageOrderValueChange >= 0 ? '+' : ''}
                      {stats.averageOrderValueChange.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      نسبة إشغال الطاولات
                    </Typography>
                    <Typography variant="h4" color="primary.main">
                      {stats.tableOccupancyRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.tableOccupancyRate >= 70 ? 'إشغال عالي' : 'إشغال متوسط'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default DashboardOverviewPage;
