import React from 'react';
import { AdminSigninForm } from './SignIn';

export const AdminLoginPage: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="w-100" style={{ maxWidth: '700px' }}>
        <AdminSigninForm />
      </div>
    </div>
  );
}; 