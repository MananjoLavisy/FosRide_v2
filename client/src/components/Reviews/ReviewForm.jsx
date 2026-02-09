import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function ReviewForm({ rideId, revieweeId, revieweeRole, onSubmitted }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) return;
    setLoading(true);
    try {
      await axios.post('/api/reviews', { rideId, revieweeId, revieweeRole, rating, comment });
      setMsg({ type: 'success', text: t('reviews.review_submitted') });
      setRating(0);
      setComment('');
      if (onSubmitted) onSubmitted();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || t('common.failed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h3>{t('reviews.write_review')}</h3>
      {msg.text && <div className={`msg-${msg.type}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('reviews.your_rating')}</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(s => (
              <span key={s} className={`star ${s <= rating ? 'filled' : ''}`} onClick={() => setRating(s)}>&#9733;</span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>{t('reviews.your_comment')}</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder={t('reviews.comment_placeholder')}
            rows={3}
          />
        </div>
        <button className="btn btn-orange" type="submit" disabled={loading || rating < 1}>
          {loading ? t('common.loading') : t('reviews.submit')}
        </button>
      </form>
    </div>
  );
}
