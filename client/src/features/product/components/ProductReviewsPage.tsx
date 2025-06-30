import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
}

export function ProductReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3333/reviews?productId=${id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load reviews');
        setLoading(false);
      });
  }, [id]);

  // Sort reviews by createdAt descending
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Container className="py-5">
      <Row>
        <Col md={10} className="mx-auto">
          <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 24, textAlign: 'left' }}>All Reviews</h2>
          <div>
            {loading ? (
              <div>Loading reviews...</div>
            ) : error ? (
              <div className="text-danger">{error}</div>
            ) : (
              <>
                {sortedReviews.length === 0 ? (
                  <div>No reviews yet.</div>
                ) : (
                  sortedReviews.map(r => (
                    <div key={r.id} className="mb-4 pb-3" style={{ borderBottom: '1px solid #eee', display: 'flex', alignItems: 'flex-start', gap: 32 }}>
                      {/* Left column: stars, user, date */}
                      <div style={{ minWidth: 160, textAlign: 'left' }}>
                        <div style={{ marginBottom: 4 }}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} size={18} fill={i <= r.rating ? '#27ae60' : 'none'} color="#27ae60" />
                          ))}
                        </div>
                        <div style={{ color: '#888', fontSize: '1rem', marginBottom: 2 }}>
                          by {(r.user && (r.user.firstName || r.user.lastName)) ? `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() : 'Anonymous'}
                        </div>
                        <div style={{ color: '#888', fontSize: '0.95rem' }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
                      </div>
                      {/* Right column: title and body */}
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {r.comment.split(' ').slice(0, 8).join(' ')}{r.comment.split(' ').length > 8 ? ' ...' : ''}
                        </div>
                        <div style={{ color: '#111', fontSize: '1rem' }}>{r.comment}</div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
} 