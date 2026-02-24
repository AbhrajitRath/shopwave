import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Stars({ rating }) {
  return <span>{[1,2,3,4,5].map((s) => <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'empty'}`}>★</span>)}</span>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewMsg, setReviewMsg] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    api.get(`/products/${id}`).then((r) => setProduct(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const handleAddToCart = () => {
    addItem(product, qty);
    navigate('/cart');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      setReviewMsg('Review submitted!');
      load();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!product) return <div className="container page"><p>Product not found.</p></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start', marginBottom: '3rem' }}>
          {/* Image */}
          <div>
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }} />
          </div>

          {/* Info */}
          <div>
            <span className="badge badge-primary">{product.category}</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '.8rem 0' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
              <Stars rating={product.rating} />
              <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{product.numReviews} reviews</span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{product.description}</p>

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1.5rem' }}>
              ${product.price.toFixed(2)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 500 }}>Qty:</label>
              <input type="number" value={qty} min={1} max={product.stock}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{ width: 80 }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {product.stock > 0 ? (
              <button className="btn btn-primary" style={{ padding: '.8rem 2rem', fontSize: '1rem' }} onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
            ) : (
              <button className="btn" disabled style={{ background: 'var(--border)', color: 'var(--text-muted)', cursor: 'not-allowed', padding: '.8rem 2rem' }}>
                Out of Stock
              </button>
            )}

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: 8, fontSize: '.9rem', color: 'var(--text-muted)' }}>
              <div>🚀 Free shipping on orders over $100</div>
              <div>↩️ 30-day return policy</div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Customer Reviews</h2>

          {product.reviews.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {product.reviews.map((r) => (
                <div key={r._id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
                    <strong>{r.name}</strong>
                    <Stars rating={r.rating} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user && (
            <form onSubmit={handleReview} style={{ maxWidth: 480 }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Write a Review</h3>
              {reviewMsg && <div className={`alert ${reviewMsg.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1rem' }}>{reviewMsg}</div>}
              <div className="form-group">
                <label>Rating</label>
                <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}>
                  {[5,4,3,2,1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea rows={3} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
