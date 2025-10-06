import React, { useEffect, useState } from 'react';
import { adminStatus, adminExists } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [exists, setExists] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ex = await adminExists();
        setExists(ex);
      } catch (e) {}
      try {
        const st = await adminStatus();
        setStatus(st);
      } catch (e) {
        setError(e.message || 'Failed to load admin status');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in-up">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Quick verification of your admin role and system status.</p>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Current User</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">{user?.name} ({user?.email})</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Role: {user?.role}</div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Admin Exists (DB)</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {exists ? (exists.exists ? `Yes (${exists.email})` : 'No') : 'Loading...'}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">Token Status</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {status ? 'OK (admin)' : 'Loading or not authorized'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
