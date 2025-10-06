import React, { useEffect, useMemo, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct, listBrands, listCategories } from '../utils/api';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  brand: '',
  category: '',
  images: '', // comma-separated URLs
  featured: false,
  isActive: true,
  originalPrice: '',
  tags: '', // comma-separated
};

const AdminProducts = () => {
  const { show } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState({ search: '', page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(1);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);

  const loadMeta = async () => {
    try {
      const [b, c] = await Promise.all([listBrands(), listCategories()]);
      setBrands(b || []);
      setCategories(c || []);
    } catch (e) {
      show(e.message || 'Failed to load brands/categories', 'error');
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await getProducts({ page: query.page, limit: query.limit, search: query.search });
      setProducts(res.products || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (e) {
      show(e.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.limit]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: String(p.price ?? ''),
      brand: p.brand?._id || p.brand || '',
      category: p.category?._id || p.category || '',
      images: (p.images || []).join(', '),
      featured: !!p.featured,
      isActive: !!p.isActive,
      originalPrice: String(p.originalPrice ?? ''),
      tags: (p.tags || []).join(', '),
    });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        brand: form.brand || undefined,
        category: form.category || undefined,
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        featured: !!form.featured,
        isActive: !!form.isActive,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editingId) {
        await updateProduct(editingId, payload);
        show('Product updated', 'success');
      } else {
        await createProduct(payload);
        show('Product created', 'success');
      }
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e) {
      show(e.message || 'Failed to save product', 'error');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      show('Product deleted', 'success');
      await load();
    } catch (e) {
      show(e.message || 'Failed to delete product', 'error');
    }
  };

  const canPrev = query.page > 1;
  const canNext = query.page < totalPages;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Manage Products</h1>
        <button onClick={startCreate} className="px-4 py-2 rounded-lg bg-[#2d3b54] text-white hover:brightness-110">New Product</button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={query.search}
          onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
          placeholder="Search products..."
          className="border rounded-lg px-3 py-2 w-full"
        />
        <button onClick={() => { setQuery(q => ({ ...q, page: 1 })); load(); }} className="px-3 py-2 rounded-lg border">Search</button>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Brand</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Featured</th>
              <th className="text-left p-3">Active</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="p-4">No products</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.brand?.name || '-'}</td>
                  <td className="p-3">{p.category?.name || '-'}</td>
                  <td className="p-3">₹{p.price}</td>
                  <td className="p-3">{p.featured ? 'Yes' : 'No'}</td>
                  <td className="p-3">{p.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => startEdit(p)} className="px-3 py-1 rounded border">Edit</button>
                    <button onClick={() => remove(p._id)} className="px-3 py-1 rounded border border-red-300 text-red-600">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">Page {query.page} of {totalPages}</div>
        <div className="space-x-2">
          <button disabled={!canPrev} onClick={() => setQuery(q => ({ ...q, page: q.page - 1 }))} className="px-3 py-1 rounded border disabled:opacity-50">Prev</button>
          <button disabled={!canNext} onClick={() => setQuery(q => ({ ...q, page: q.page + 1 }))} className="px-3 py-1 rounded border disabled:opacity-50">Next</button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[min(720px,92vw)] bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">{editingId ? 'Edit Product' : 'New Product'}</div>
              <button className="px-3 py-1 rounded border" onClick={() => setOpen(false)}>Close</button>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submit}>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Name</label>
                <input required value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Description</label>
                <textarea value={form.description} onChange={(e)=>setForm(f=>({...f,description:e.target.value}))} className="w-full border rounded-lg px-3 py-2" rows={3} />
              </div>
              <div>
                <label className="block text-sm mb-1">Price</label>
                <input required type="number" step="0.01" value={form.price} onChange={(e)=>setForm(f=>({...f,price:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Original Price</label>
                <input type="number" step="0.01" value={form.originalPrice} onChange={(e)=>setForm(f=>({...f,originalPrice:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm mb-1">Brand</label>
                <select value={form.brand} onChange={(e)=>setForm(f=>({...f,brand:e.target.value}))} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select brand</option>
                  {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select value={form.category} onChange={(e)=>setForm(f=>({...f,category:e.target.value}))} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Image URLs (comma separated)</label>
                <input value={form.images} onChange={(e)=>setForm(f=>({...f,images:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e)=>setForm(f=>({...f,tags:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="flex items-center gap-4 col-span-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.featured} onChange={(e)=>setForm(f=>({...f,featured:e.target.checked}))} />
                  <span>Featured</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={form.isActive} onChange={(e)=>setForm(f=>({...f,isActive:e.target.checked}))} />
                  <span>Active</span>
                </label>
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={()=>{setOpen(false); setEditingId(null);}} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#2d3b54] text-white">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
