import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import SearchFilters from '../components/Search/SearchFilters';
import SearchResults from '../components/Search/SearchResults';

export default function SearchPage() {
  const { t } = useTranslation();
  const [searchTab, setSearchTab] = useState('rides');
  const [filters, setFilters] = useState({ transportType: 'all', source: '', destination: '', date: '', status: 'all' });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v && v !== 'all') params.set(k, v); });

      let endpoint = '/api/search/rides';
      if (searchTab === 'drivers') endpoint = '/api/search/drivers';
      if (searchTab === 'transports') endpoint = '/api/search/transports';

      const { data } = await axios.get(`${endpoint}?${params.toString()}`);
      setResults(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { doSearch(); }, [searchTab]);

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${searchTab === 'rides' ? 'active' : ''}`} onClick={() => setSearchTab('rides')}>{t('search.search_rides')}</button>
        <button className={`tab ${searchTab === 'drivers' ? 'active' : ''}`} onClick={() => setSearchTab('drivers')}>{t('search.search_drivers')}</button>
        <button className={`tab ${searchTab === 'transports' ? 'active' : ''}`} onClick={() => setSearchTab('transports')}>{t('search.search_transports')}</button>
      </div>

      <div className="card">
        <h2>{t('search.title')}</h2>
        <SearchFilters filters={filters} onChange={setFilters} />
        <button className="btn btn-orange" onClick={doSearch} disabled={loading} style={{ marginBottom: 20 }}>
          {loading ? t('common.loading') : t('search.title')}
        </button>
        <SearchResults results={results} type={searchTab} />
      </div>
    </div>
  );
}
