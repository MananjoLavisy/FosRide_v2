import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ReviewList({ targetId }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!targetId) return;
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/for/${targetId}`);
        setReviews(data);
      } catch { /* ignore */ }
    };
    fetchReviews();
  }, [targetId]);

  if (reviews.length === 0) {
    return <p>{t('reviews.no_reviews')}</p>;
  }

  return (
    <div>
      {reviews.map(r => (
        <div key={r._id} className="review-item">
          <div className="review-header">
            <strong>{r.reviewer?.username || 'Anonyme'}</strong>
            <span className="review-rating">
              {r.rating} <span style={{ color: 'var(--orange)' }}>&#9733;</span>
            </span>
          </div>
          {r.comment && <p className="review-comment">{r.comment}</p>}
          <small className="review-date">{new Date(r.createdAt).toLocaleDateString()}</small>
        </div>
      ))}
    </div>
  );
}
