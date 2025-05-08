import React from 'react';

// Mock components for local development
export const PassportProvider = ({ children }) => children;

export const AuthCallback = () => (
  <div>Authentication bypassed for local development</div>
);

export const Login = () => (
  <div>Login bypassed for local development</div>
);

export const Profile = () => (
  <button className="px-3 py-2 bg-slate-700 rounded-lg text-white">
    Local User
  </button>
);

// Comment out original exports for reference
// export { default as PassportProvider } from './PassportProvider';
// export { default as AuthCallback } from './AuthCallback';
// export { default as Login } from './Login';
// export { default as Profile } from './Profile'; 