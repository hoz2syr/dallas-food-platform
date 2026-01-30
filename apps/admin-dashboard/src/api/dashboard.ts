// دوال API وهمية لإحصائيات لوحة التحكم
export async function fetchDashboardStats() {
  // في التطبيق الفعلي: استبدل هذا باستدعاء API حقيقي
  return {
    ordersCount: 1280,
    revenue: 45200,
    customersCount: 320,
    menuItemsCount: 54,
    staffCount: 18,
    lastOrders: [
      { id: 1280, customer: 'سارة', total: 120, status: 'مكتمل' },
      { id: 1279, customer: 'محمد', total: 85, status: 'قيد التنفيذ' },
      { id: 1278, customer: 'أحمد', total: 200, status: 'ملغي' },
      { id: 1277, customer: 'ليلى', total: 60, status: 'مكتمل' },
      { id: 1276, customer: 'خالد', total: 150, status: 'قيد التنفيذ' }
    ],
    chartData: {
      revenue: [
        { month: 'يناير', value: 6000 },
        { month: 'فبراير', value: 7200 },
        { month: 'مارس', value: 8000 },
        { month: 'أبريل', value: 9000 },
        { month: 'مايو', value: 8000 },
        { month: 'يونيو', value: 6000 }
      ],
      orders: [
        { month: 'يناير', value: 120 },
        { month: 'فبراير', value: 140 },
        { month: 'مارس', value: 160 },
        { month: 'أبريل', value: 180 },
        { month: 'مايو', value: 170 },
        { month: 'يونيو', value: 140 }
      ],
      customers: [
        { month: 'يناير', value: 30 },
        { month: 'فبراير', value: 40 },
        { month: 'مارس', value: 50 },
        { month: 'أبريل', value: 60 },
        { month: 'مايو', value: 55 },
        { month: 'يونيو', value: 45 }
      ]
    }
  };
}
