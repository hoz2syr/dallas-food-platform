import React, { useState, useEffect } from 'react';
import { fetchReviews, Review } from '../lib/api/reviews';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterItem, setFilterItem] = useState<string>('');

  useEffect(() => {
    fetchReviewsFromApi();
  }, [filterItem]);

  const fetchReviewsFromApi = async () => {
    try {
      const data = await fetchReviews(filterItem || undefined);
      setReviews(data);
      setLoading(false);
    } catch (err) {
      setError('فشل في تحميل التقييمات');
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="reviews-page">
        <h2>آراء العملاء</h2>
        <p>جاري تحميل التقييمات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reviews-page">
        <h2>آراء العملاء</h2>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <h2>آراء العملاء</h2>

      <div className="reviews-summary">
        <div className="average-rating">
          <span className="stars">{renderStars(Math.round(averageRating))}</span>
          <span className="rating-number">{averageRating.toFixed(1)}</span>
          <span className="total-reviews">({reviews.length} تقييم)</span>
        </div>
      </div>

      <div className="reviews-filter">
        <select value={filterItem} onChange={e => setFilterItem(e.target.value)}>
          <option value="">جميع التقييمات</option>
          {/* في التطبيق الفعلي: جلب قائمة الأصناف من API */}
          <option value="item-1">برجر كلاسيكي</option>
          <option value="item-2">بيتزا مارغريتا</option>
        </select>
      </div>

      {reviews.length === 0 ? (
        <p>لا توجد تقييمات</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="customer-name">{review.customerName}</span>
                <span className="rating">{renderStars(review.rating)}</span>
              </div>
              {review.itemName && (
                <div className="review-item">للصنف: {review.itemName}</div>
              )}
              <div className="review-comment">{review.comment}</div>
              <div className="review-date">
                {new Date(review.createdAt).toLocaleDateString('ar-SA')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
