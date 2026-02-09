import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function FAQPage() {
  const { t, i18n } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data } = await axios.get('/api/support/faq');
        setFaqs(data);
      } catch { /* ignore */ }
    };
    fetchFAQs();
  }, []);

  const lang = i18n.language || 'fr';

  const getQuestion = (faq) => faq[`question_${lang}`] || faq.question_fr;
  const getAnswer = (faq) => faq[`answer_${lang}`] || faq.answer_fr;

  return (
    <div>
      <div className="card">
        <h2>{t('faq.title')}</h2>
        {faqs.length === 0 ? (
          <p>{t('faq.no_faq')}</p>
        ) : (
          <div className="faq-list">
            {faqs.map(faq => (
              <div key={faq._id} className={`faq-item ${openId === faq._id ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                >
                  <span>{getQuestion(faq)}</span>
                  <span className="faq-toggle">{openId === faq._id ? '−' : '+'}</span>
                </button>
                {openId === faq._id && (
                  <div className="faq-answer">
                    <p>{getAnswer(faq)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
