import "./index.css"
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function LoginRegister() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    registerName: '',
    registerEmail: '',
    registerPassword: '',
    registerConfirm: ''
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    
    if (type === 'login') {
      toast.success('Login successful! Redirecting...');
    } else {
      toast.success('Registration successful! Please check your email.');
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="auth-container">
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabChange('login')}
            >
              Login
            </div>
            <div 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => handleTabChange('register')}
            >
              Register
            </div>
          </div>

          <div className="auth-forms">
            <form 
              className={`auth-form ${activeTab === 'login' ? 'active' : ''}`}
              onSubmit={(e) => handleSubmit(e, 'login')}
            >
              <h2 className="form-title">Welcome Back</h2>
              
              <div className="form-group">
                <label htmlFor="loginEmail" className="form-label">Email</label>
                <input 
                  type="email"
                  id="loginEmail"
                  className="form-input"
                  value={formData.loginEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <input
                  type="password" 
                  id="loginPassword"
                  className="form-input"
                  value={formData.loginPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Login</button>
            </form>

            <form 
              className={`auth-form ${activeTab === 'register' ? 'active' : ''}`}
              onSubmit={(e) => handleSubmit(e, 'register')}
            >
              <h2 className="form-title">Create Account</h2>

              <div className="form-group">
                <label htmlFor="registerName" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="registerName" 
                  className="form-input"
                  value={formData.registerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registerEmail" className="form-label">Email</label>
                <input
                  type="email"
                  id="registerEmail"
                  className="form-input"
                  value={formData.registerEmail}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registerPassword" className="form-label">Password</label>
                <input
                  type="password"
                  id="registerPassword"
                  className="form-input"
                  value={formData.registerPassword}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registerConfirm" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="registerConfirm"
                  className="form-input"
                  value={formData.registerConfirm}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Create Account</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}
