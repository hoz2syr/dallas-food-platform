#!/bin/bash
set -e

echo "=== بدء اختبار تحديث البنية التحتية ==="

echo "1. اختبار صحة RabbitMQ الجديدة..."
docker-compose exec rabbitmq rabbitmq-diagnostics ping || { echo "❌ RabbitMQ غير صحي"; exit 1; }
echo "✅ RabbitMQ يعمل"

echo "2. التحقق من إنشاء الطوابير والتبادلات..."
docker-compose exec rabbitmq rabbitmqadmin list exchanges name type durable --username admin --password admin123 | grep order.events
docker-compose exec rabbitmq rabbitmqadmin list queues name durable --username admin --password admin123 | grep order.status.updates
echo "✅ الهيكل الجديد موجود"

echo "3. اختبار صحة خدمة الطلبات (يجب أن تتضمن فحص RabbitMQ)..."
curl -f http://localhost:3000/health | jq '.checks.rabbitmq.healthy' | grep true
echo "✅ خدمة الطلبات تتصل بـ RabbitMQ بنجاح"

echo "4. اختبار سير عمل الطلب مع المراسلة..."
ORDER_ID=$(curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId": 999, "items": [{"productId": 1, "quantity": 1}]}' | jq -r '.data.id')
echo "   تم إنشاء الطلب #$ORDER_ID"

curl -s -X PUT http://localhost:3000/api/orders/$ORDER_ID/stage \
  -H "Content-Type: application/json" \
  -d '{"stage": "preparation", "notes": "اختبار التكامل"}' > /dev/null
echo "   تم تحديث حالة الطلب"

sleep 1
TIMELINE_LENGTH=$(curl -s http://localhost:3000/api/orders/$ORDER_ID/tracking | jq '.data.timeline | length')
if [ "$TIMELINE_LENGTH" -gt 0 ]; then
    echo "✅ تم تسجيل الحدث في الجدول الزمني عبر النظام"
else
    echo "❌ فشل في تسجيل الحدث"
    exit 1
fi

echo "=== ✅ جميع اختبارات التكامل نجحت! ==="
echo "يمكنك فتح واجهة إدارة RabbitMQ: http://localhost:15672 (admin/admin123)"
