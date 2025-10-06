import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Package, Heart, Settings, LogOut, BadgeCheck, CreditCard, MapPin, Save } from 'lucide-react';
import { getMyOrders, getMyAddress, updateMyAddress } from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { show } = useToast();
  const [active, setActive] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const data = await getMyOrders(token);
        setOrders(data || []);
      } catch {
        setOrders([]);
      }
    })();
  }, [token]);
  const wishlist = [
    { id: 'W1', name: 'Jaquar Wall Mixer', price: 5999, img: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?q=80&w=600&auto=format&fit=crop' },
    { id: 'W2', name: 'Kidlen Premium Sink', price: 8999, img: 'https://images.unsplash.com/photo-1598300053658-8a3f284d47a9?q=80&w=600&auto=format&fit=crop' },
    { id: 'W3', name: 'Kohler Bath Tub', price: 45999, img: 'https://images.unsplash.com/photo-1629778712710-ec0cc3f7df7b?q=80&w=600&auto=format&fit=crop' },
  ];

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  // Load user address on component mount
  useEffect(() => {
    const loadAddress = async () => {
      if (!token) return;
      try {
        setAddressLoading(true);
        const addressData = await getMyAddress(token);
        if (addressData) {
          setShipping(prev => ({
            fullName: addressData.fullName || user?.name || '',
            address: addressData.address || '',
            city: addressData.city || '',
            state: addressData.state || '',
            zip: addressData.zip || '',
            phone: addressData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Failed to load address:', error);
        show('Failed to load address', 'error');
      } finally {
        setAddressLoading(false);
      }
    };
    loadAddress();
  }, [token, user?.name, show]);
  const [payment, setPayment] = useState({
    cardName: user?.name || '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  if (!user) return null;

  const handleSaveAddress = async () => {
    if (!token) return;
    
    // Basic validation
    if (!shipping.fullName.trim() || !shipping.address.trim() || !shipping.city.trim() || !shipping.state.trim() || !shipping.zip.trim() || !shipping.phone.trim()) {
      show('Please fill in all address fields', 'error');
      return;
    }
    
    try {
      setAddressLoading(true);
      await updateMyAddress(shipping, token);
      setAddressSaved(true);
      show('Address saved successfully!', 'success');
      setTimeout(() => setAddressSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save address:', error);
      show('Failed to save address', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    show('You have been logged out.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:sticky lg:top-6 h-max">
          <div className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-[#6f89a8] to-[#8aa7c1] text-white shadow">
            <div className="w-14 h-14 rounded-full border-4 border-white/40 bg-[#607d9e] flex items-center justify-center text-xl uppercase">
              {user.name?.[0] || 'U'}
            </div>
            <div>
              <div className="font-semibold leading-tight">{user.name}</div>
              <div className="text-xs opacity-90">{user.email}</div>
            </div>
          </div>
          <nav className="mt-4 space-y-1">
            <button onClick={() => setActive('profile')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 ${active==='profile'?'bg-gray-100 dark:bg-gray-700':''}`}><User size={16}/> Profile</button>
            <button onClick={() => setActive('orders')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 ${active==='orders'?'bg-gray-100 dark:bg-gray-700':''}`}><Package size={16}/> Orders</button>
            <button onClick={() => setActive('wishlist')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 ${active==='wishlist'?'bg-gray-100 dark:bg-gray-700':''}`}><Heart size={16}/> Wishlist</button>
            <button onClick={() => setActive('settings')} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700 ${active==='settings'?'bg-gray-100 dark:bg-gray-700':''}`}><Settings size={16}/> Settings</button>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition hover:bg-red-50 text-red-600 border border-red-200 dark:border-red-700/40 dark:hover:bg-red-900/20"><LogOut size={16}/> Logout</button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Header card with membership */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-[#8aa7c1] shadow-inner bg-[#607d9e] text-white flex items-center justify-center text-2xl uppercase">
                  {user.name?.[0] || 'U'}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">{user.name}</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700 rounded-full px-3 py-1.5">
                <BadgeCheck size={16} />
                <span className="text-sm font-medium">Gold Member</span>
              </div>
            </div>
          </section>

          {/* Profile details / editable sections */}
          {active === 'profile' && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition hover:shadow-md">
                <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200">
                  <MapPin size={18}/> <h2 className="font-semibold">Shipping Address</h2>
                </div>
                
                {/* Display current address if available */}
                {shipping.address && shipping.city && shipping.state && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Address:</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">{shipping.fullName}</p>
                      <p>{shipping.address}</p>
                      <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
                      <p>Phone: {shipping.phone}</p>
                    </div>
                  </div>
                )}
                {addressLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#607d9e] mx-auto"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Loading address...</p>
                  </div>
                ) : (
                  <form className="space-y-3">
                    <input 
                      className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#607d9e] focus:border-transparent" 
                      placeholder="Full name" 
                      value={shipping.fullName} 
                      onChange={e=>setShipping({...shipping, fullName:e.target.value})}
                    />
                    <input 
                      className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#607d9e] focus:border-transparent" 
                      placeholder="Address" 
                      value={shipping.address} 
                      onChange={e=>setShipping({...shipping, address:e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        className="rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#607d9e] focus:border-transparent" 
                        placeholder="City" 
                        value={shipping.city} 
                        onChange={e=>setShipping({...shipping, city:e.target.value})}
                      />
                      <input 
                        className="rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#607d9e] focus:border-transparent" 
                        placeholder="State" 
                        value={shipping.state} 
                        onChange={e=>setShipping({...shipping, state:e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        className="rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#607d9e] focus:border-transparent" 
                        placeholder="ZIP" 
                        value={shipping.zip} 
                        onChange={e=>setShipping({...shipping, zip:e.target.value})}
                      />
                      <input 
                        className="rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#607d9e] focus:border-transparent" 
                        placeholder="Phone" 
                        value={shipping.phone} 
                        onChange={e=>setShipping({...shipping, phone:e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={handleSaveAddress}
                        disabled={addressLoading}
                        className={`mt-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                          addressSaved 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-[#607d9e] text-white hover:bg-[#546f8d]'
                        }`}
                      >
                        <Save size={16} />
                        {addressLoading ? 'Saving...' : addressSaved ? 'Saved!' : 'Save Address'}
                      </button>
                      {addressSaved && (
                        <span className="text-green-600 text-sm font-medium">✓ Address saved successfully!</span>
                      )}
                    </div>
                  </form>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 transition hover:shadow-md">
                <div className="flex items-center gap-2 mb-3 text-gray-800 dark:text-gray-200">
                  <CreditCard size={18}/> <h2 className="font-semibold">Payment Methods</h2>
                </div>
                <form className="space-y-3">
                  <input className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" placeholder="Name on card" value={payment.cardName} onChange={e=>setPayment({...payment, cardName:e.target.value})}/>
                  <input className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" placeholder="Card number" value={payment.cardNumber} onChange={e=>setPayment({...payment, cardNumber:e.target.value})}/>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" placeholder="MM/YY" value={payment.expiry} onChange={e=>setPayment({...payment, expiry:e.target.value})}/>
                    <input className="rounded-lg border px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700" placeholder="CVV" value={payment.cvv} onChange={e=>setPayment({...payment, cvv:e.target.value})}/>
                  </div>
                  <button type="button" className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#607d9e] text-white px-4 py-2 text-sm font-medium hover:bg-[#546f8d] transition">Save</button>
                </form>
              </div>
            </section>
          )}

          {/* Orders */}
          {active === 'orders' && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"><Package size={18}/> Order History</h2>
              {(!orders || orders.length === 0) ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o._id} className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-gray-900 dark:text-gray-100">Order #{o._id.slice(-6)}</div>
                        <div className={`text-xs mt-1 inline-flex items-center px-2 py-0.5 rounded-full ${o.status==='Delivered'?'bg-green-100 text-green-700':o.status==='Shipped'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-700'}`}>{o.status}</div>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Placed on {new Date(o.createdAt).toLocaleDateString()}</div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {(o.items || []).map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 py-2">
                            {it.image && <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover" />}
                            <div className="flex-1 min-w-0">
                              <div className="text-gray-900 dark:text-gray-100 truncate">{it.name}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">Qty: {it.qty} • ₹{Number(it.price).toLocaleString('en-IN')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-right mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Total: ₹{Number(o.totalPrice).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Wishlist */}
          {active === 'wishlist' && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2"><Heart size={18}/> Wishlist</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {wishlist.map(w => (
                  <div key={w.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition">
                    <img src={w.img} alt={w.name} className="w-full h-28 object-cover" />
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{w.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">₹{w.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Settings placeholder */}
          {active === 'settings' && (
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2"><Settings size={18}/> Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage your account preferences.</p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
