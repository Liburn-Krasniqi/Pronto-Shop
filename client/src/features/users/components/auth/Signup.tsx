import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../../../../hooks/useAuth';

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  passwordRepeat: string;
  type: 'user' | 'vendor';
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userType } = useAuth();

  if(isAuthenticated && userType === 'user') navigate('user/profile');
  if(isAuthenticated && userType === 'vendor') navigate('/vendor/show');

  const [form, setForm] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    passwordRepeat: '',
    type: 'user',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const [firstName = '', lastName = ''] = form.fullName.trim().split(' ');

    try {
      const res = await fetch('http://localhost:3333/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          passwordRepeat: form.passwordRepeat,
          firstName,
          lastName,
          type: form.type 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
      } else {
        setSuccess('Signup successful!');
        navigate('/login')
        setForm({
          fullName: '',
          email: '',
          password: '',
          passwordRepeat: '',
          type: 'user',
        });
      }
    } catch (err: any) {
      setError('Something went wrong. Please try again. ' + err);
      console.log(err);
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
              <h3 className="card-title text-center mb-4 color-1 mb-4">Create ProntoShop Account</h3>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Your name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    placeholder="First and Last Name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

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
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Re-enter password</label>
                  <input
                    type="password"
                    name="passwordRepeat"
                    className="form-control"
                    value={form.passwordRepeat}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="w-100 background-2 rounded p-2 text-white border-0 mt-2">
                  Create Account
                </button>
              </form>

              <p className='text-center my-4'>
                By creating an account, you agree to ProntoShop's 
                <Link to="" className='color-2 text-decoration-none'> Conditions of Use </Link>
                and <Link to="" className='color-2 text-decoration-none'>Privacy Notice </Link>
              </p>
              
              <hr />
              <p className='text-center mt-4'>
                Already have an account? 
                <Link to="/login" className='color-2 text-decoration-none'> Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
