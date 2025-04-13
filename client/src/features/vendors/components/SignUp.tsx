import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  phone_number: string;
  country: string;
  city: string;
  zipCode: string;
  street: string;
}

interface Message {
  type: 'success' | 'danger';
  text: string;
}

export function SignupForm() {
  const [form, setForm] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    businessName: '',
    phone_number: '',
    country: '',
    city: '',
    zipCode: '',
    street: ''
  });

  const [message, setMessage] = useState<Message | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      address: {
        country: form.country,
        city: form.city,
        zipCode: form.zipCode,
        street: form.street,
      },
    };

    try {
      const res = await axios.post('http://localhost:3333/vendor/signup', payload);
      setMessage({ type: 'success', text: `Welcome, ${res.data.name}! 🎉` });
      setForm({
        name: '',
        email: '',
        password: '',
        businessName: '',
        phone_number: '',
        country: '',
        city: '',
        zipCode: '',
        street: ''
      });
      
      
    } catch (err: any) {
      const errorText = err.response?.data?.message || err.message;
      setMessage({ type: 'danger', text: `Signup failed: ${errorText}` });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4 color-1">Business Signup</h3>

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


                <hr className="my-4" />
                <h5 className="mb-3">Address Information</h5>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      name="street"
                      className="form-control"
                      value={form.street}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={form.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3 col-md-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="form-control"
                      value={form.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-control"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="w-100 background-1 rounded p-2 text-white border-0">
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
