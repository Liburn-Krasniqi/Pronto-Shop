import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../../utils/auth';
import { useAuth } from '../../../../hooks/useAuth';

interface SigninFormData {
  email: string;
  password: string;
  type: 'user' | 'vendor';
}

export const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, userType } = useAuth();

  if(isAuthenticated && userType === 'user') navigate('user/profile');
  if(isAuthenticated && userType === 'vendor') navigate('/vendor/show');
  
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
    type: 'user',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(form.email, form.password, form.type);
      window.location.href = 'user/profile';
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className='text-center mb-5'>
        <img alt="Pronto Logo" src="/letter-p.svg" />
      </div>      
      <div className="row justify-content-center">
        <div className="col-md-8 mb-5">
          <div className="card rounded-4 shadow-bottom border-0">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 color-1 mb-4">ProntoShop Log-In</h3>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
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

                <button type="submit" className="w-100 background-2 rounded p-2 text-white border-0 mt-2">
                  {loading ? 'Signing in...' : 'Log In'}
                </button>
              </form>

              <p className='text-center my-4'>
                By signing in, you agree to ProntoShop's 
                <Link to="" className='color-2 text-decoration-none'> Conditions of Use </Link>
                and <Link to="" className='color-2 text-decoration-none'>Privacy Notice </Link>
              </p>
              
              <hr />
              <p className='text-center mt-4'>
                Don't have an account? 
                <Link to="/signup" className='color-2 text-decoration-none'> Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
