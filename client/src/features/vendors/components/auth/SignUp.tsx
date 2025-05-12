import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';


interface AddressData {
  country: string;
  city: string;
  postalCode: string;
  street: string;
  state: string;
}

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  businessName: string;
  phone_number: string;
  address: AddressData;
  type: 'user' | 'vendor';
}

interface Message {
  type: 'success' | 'danger';
  text: string;
}

export function VendorSignupForm() {
  const [form, setForm] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    passwordRepeat: '',
    businessName: '',
    phone_number: '',
    address: {
        country: '',
        city: '',
        postalCode: '',
        street: '',
        state: ''
    },
    type: 'vendor'
  });

  const [message, setMessage] = useState<Message | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
        if (isAuthenticated) {
           navigate('/vendor/show');
        }
      }, [isAuthenticated, navigate]);
  
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  
  if (['country', 'city', 'postalCode', 'street','state'].includes(name)) {
      setForm({
          ...form,
          address: {
              ...form.address,
              [name]: value
          }
      });
  } else {
      setForm({ 
          ...form, 
          [name]: value 
      });
  }
};

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  try {
      const res = await axios.post('http://localhost:3333/auth/signup', form);
      setMessage({ type: 'success', text: `Welcome, ${res.data.name}! 🎉` });
      setForm({
          name: '',
          email: '',
          password: '',
          passwordRepeat: '',
          businessName: '',
          phone_number: '',
          address: {
              country: '',
              city: '',
              postalCode: '',
              street: '',
              state: ''
          },
          type: 'vendor'
      });

      const { access_token, refresh_token } = res.data;
      Cookies.set('access_token', access_token);
      Cookies.set('refresh_token', refresh_token);
      navigate('/vendor/show');
  } catch (err: any) {
      const errorText = err.response?.data?.message || err.message;
      setMessage({ type: 'danger', text: `Signup failed: ${errorText}` });
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
              <h3 className="card-title text-center mb-4 color-1 mb-4">Create <span className='color-1'>ProntoBusiness</span> Account</h3>

              {message && (
                <div className={`alert alert-${message.type}`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-6">
                    <label className="form-label">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      className="form-control"
                      value={form.businessName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
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

                  <div className="mb-3 col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      name="phone_number"
                      className="form-control"
                      value={form.phone_number}
                      onChange={handleChange}
                      required
                    />
                  </div>
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

                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="passwordRepeat"
                    className="form-control"
                    value={form.passwordRepeat}
                    onChange={handleChange}
                    required
                  />
                </div>


                <hr className="my-4" />
                <h5 className="mb-3">Address Information (Optional)</h5>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Street</label>
                    <input
                        type="text"
                        name="street"
                        value={form.address.street}
                        onChange={handleChange}
                        className="form-control"
                    />
                  </div>

                  <div className="mb-3 col-md-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.address.city}
                      onChange={handleChange}
                      
                    />
                  </div>

                  <div className="mb-3 col-md-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      className="form-control"
                      value={form.address.postalCode}
                      onChange={handleChange}
                      
                    />
                  </div>
                </div>

                <div className='row'>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={form.address.state}
                      onChange={handleChange}
                      
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="country"
                      className="form-control"
                      value={form.address.country}
                      onChange={handleChange}
                      
                    />
                  </div>
                </div>

                <button type="submit" className="w-100 background-2 rounded p-2 text-white border-0 mt-2">
                  Create Account
                </button>
               
              </form> 
              <p className='text-center my-4'>
                By creating an account, you agree to ProntoShop’s 
                <Link to="" className='color-2 text-decoration-none'> Conditions of Use </Link>
                and <Link to="" className='color-2 text-decoration-none'>Privacy Notice </Link>
              </p>
              
              <hr />
              <p className='text-center mt-4'>
                Already have an account? 
                <Link to="../../vendor/signin" className='color-2 text-decoration-none'> Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
