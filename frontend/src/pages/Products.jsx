import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    api.get('/products/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/products', { params: { search, category, sort, page, limit: 12 } })
      .then((r) => { setProducts(r.data.products); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  const update = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">
          {category || search ? (category || `"${search}"`) : 'All Products'}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '1rem', marginLeft: '.8rem' }}>
            ({total} items)
          </span>
        </h1>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
          {/* Category filter */}
          <select value={category} onChange={(e) => update('category', e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Sort */}
          <select value={sort} onChange={(e) => update('sort', e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Highest Rated</option>
          </select>

          {(search || category) && (
            <button className="btn btn-outline btn-sm" onClick={() => setSearchParams({})}>Clear filters ✕</button>
          )}
        </div>

        {loading ? <div className="spinner" /> : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p>No products found. Try a different search or filter.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className="btn"
                    style={{
                      padding: '.5rem .9rem',
                      background: p === page ? 'var(--primary)' : 'var(--surface)',
                      color: p === page ? '#fff' : 'var(--text)',
                      border: '1.5px solid var(--border)',
                    }}
                    onClick={() => update('page', p)}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
