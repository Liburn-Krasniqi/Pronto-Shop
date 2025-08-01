import React, { useEffect, useState } from 'react';
// import styles from '../../../users/components/auth/Signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../../utils/auth';
import { useAuth } from '../../../../hooks/useAuth';
import styles from './SignIn.module.css';


interface SigninFormData {
  email: string;
  password: string;
  type: 'user' | 'vendor';
}

interface Message {
  type: 'success' | 'danger';
  text: string;
}


export const VendorSigninForm: React.FC = () => {
  const navigate = useNavigate();
    const [message, setMessage] = useState<Message | null>(null);
  const {isAuthenticated} = useAuth();
  const [form, setForm] = useState<SigninFormData>({
    email: '',
    password: '',
    type: 'vendor',
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
          if (isAuthenticated) {
             window.location.href = '/vendor/dashboard';
          }
  }, [isAuthenticated, navigate]);

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
    console.log('Vendor login started, loading:', true);

    try {
      // Add a small delay to make the loading state visible for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use the centralized login function
      await login(form.email, form.password, form.type);
      // Redirect to dashboard after successful login
      window.location.href = '/vendor/dashboard';
    } catch (err: any) {
      setMessage({type: 'danger', text: 'Something went wrong. Please try again.'});
      console.error(err);
    } finally {
      setLoading(false);
      console.log('Vendor login finished, loading:', false);
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
              <h3 className="card-title text-center mb-4 color-1 mb-4"><span className='color-1'>ProntoBusiness</span> Log-In </h3>

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
                    'Log In'
                  )}
                </button>
               
              </form> 
              <p className='text-center my-4'>
                By creating an account, you agree to ProntoShop's 
                <Link to="/conditions" className='color-2 text-decoration-none'> Conditions of Use </Link>
                and <Link to="/privacy" className='color-2 text-decoration-none'>Privacy Notice </Link>
              </p>
              
              <hr />
              <p className='text-center mt-4'>
                Already have an account? 
                <Link to="../../vendor/signup" className='color-2 text-decoration-none'> Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};
