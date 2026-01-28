
import React, { useEffect, useState } from 'react';
import { fetchUserProfile, UserProfile } from '../lib/api/crm';

export default function ProfilePage() {
  // في التطبيق الفعلي: userId من المصادقة
  const userId = 'user-1';
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile(userId)
      .then(setProfile)
      .catch(() => setError('فشل في جلب بيانات المستخدم'));
  }, [userId]);

  return (
    <div className="profile-page">
      <h2>الحساب الشخصي</h2>
      {error && <div className="error-msg">{error}</div>}
      {!profile ? (
        <p>جاري التحميل...</p>
      ) : (
        <ul>
          <li>الاسم: {profile.name}</li>
          <li>البريد الإلكتروني: {profile.email}</li>
          {profile.phone && <li>الجوال: {profile.phone}</li>}
          {profile.loyaltyPoints && <li>نقاط الولاء: {profile.loyaltyPoints}</li>}
          {profile.addresses && profile.addresses.length > 0 && (
            <li>العناوين:
              <ul>
                {profile.addresses.map((addr, i) => <li key={i}>{addr}</li>)}
              </ul>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
