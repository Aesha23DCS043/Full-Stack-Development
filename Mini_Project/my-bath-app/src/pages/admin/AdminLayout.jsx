import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/analytics', label: 'Analytics' },
  { to: '/admin/settings', label: 'Settings' },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
        <div className="text-xl font-semibold mb-4">Admin Panel</div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-[#2d3b54] text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="p-4 lg:p-6 animate-fade-in-up">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
