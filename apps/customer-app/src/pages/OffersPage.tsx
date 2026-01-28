import React, { useState, useEffect } from 'react';
import { fetchOffers, Offer } from '../lib/api/offers';

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffersFromApi();
  }, []);

  const fetchOffersFromApi = async () => {
    try {
      const data = await fetchOffers();
      setOffers(data);
      setLoading(false);
    } catch (err) {
      setError('فشل في تحميل العروض');
      setLoading(false);
    }
  };

  const isOfferValid = (offer: Offer) => {
    const now = new Date();
    const validFrom = new Date(offer.validFrom);
    const validTo = new Date(offer.validTo);
    return now >= validFrom && now <= validTo;
  };

  if (loading) {
    return (
      <div className="offers-page">
        <h2>العروض والتخفيضات</h2>
        <p>جاري تحميل العروض...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="offers-page">
        <h2>العروض والتخفيضات</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <h2>العروض والتخفيضات</h2>
      {offers.length === 0 ? (
        <p>لا توجد عروض حالياً</p>
      ) : (
        <div className="offers-grid">
          {offers.filter(isOfferValid).map((offer) => (
            <div key={offer.id} className="offer-card">
              {offer.imageUrl && (
                <img src={offer.imageUrl} alt={offer.title} className="offer-image" />
              )}
              <div className="offer-content">
                <h3>{offer.title}</h3>
                <p>{offer.description}</p>
                <div className="offer-details">
                  <span className="discount">
                    {offer.discountType === 'percentage'
                      ? `${offer.discountValue}% خصم`
                      : `${offer.discountValue} ريال خصم`
                    }
                  </span>
                  {offer.minimumOrder && (
                    <span className="minimum">الحد الأدنى: {offer.minimumOrder} ريال</span>
                  )}
                  {offer.code && (
                    <span className="code">كود الخصم: {offer.code}</span>
                  )}
                </div>
                <div className="validity">
                  صالح حتى: {new Date(offer.validTo).toLocaleDateString('ar-SA')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
