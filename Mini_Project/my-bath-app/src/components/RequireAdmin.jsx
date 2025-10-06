import React from 'react';
import RequireAuth from './RequireAuth';
import { useAuth } from '../context/AuthContext';

const RequireAdmin = ({ children }) => {
  return (
    <RequireAuth>
      <AdminGate>{children}</AdminGate>
    </RequireAuth>
  );
};

const AdminGate = ({ children }) => {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <div className="p-8 text-center">Access denied. Admins only.</div>;
  return children;
};

export default RequireAdmin;
