import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../../utils/auth';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './SignIn.module.css';

interface SigninFormData {
  email: string;
  password: string;
  type: 'user' | 'vendor' | 'admin';
}

interface Message {
  type: 'success' | 'danger';
  text: string;
}

export const AdminSigninForm: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState<Message | null>(null);
  const { isAuthenticated, userType } = useAuth();
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
    type: 'admin',
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    console.log('Admin login started, loading:', true);

    try {
      // Add a small delay to make the loading state visible for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await login(form.email, form.password, form.type);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setMessage({ type: 'danger', text: 'Invalid credentials. Please try again.' });
      console.error(err);
    } finally {
      setLoading(false);
      console.log('Admin login finished, loading:', false);
    }
  };

  return (
    <div className="container mt-5">
      <div className='text-center mb-5'>
        <img alt="Pronto Logo" src="/letter-p.svg" />
      </div>      
      <div className="row justify-content-center">
        <div className="col-md-8 mb-5">
          <div className={`card rounded-4 shadow-bottom border-0 ${styles.formContainer}`}>
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 color-1 mb-4">
                <span className='color-1'>Admin</span> Login
              </h3>

              {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`w-100 background-2 rounded p-2 text-white border-0 mt-2 d-flex align-items-center justify-content-center ${styles.loadingButton}`}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#6c757d' : '',
                    opacity: loading ? 0.8 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 