import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditShop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // 1. Form State (Added isOpen for Toggle)
  const [formData, setFormData] = useState({
    shopName: '',
    category: 'Kirana',
    address: '',
    contact: '',
    isOpen: false // 👈 Default status
  });

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const { data } = await API.get(`/shops/${id}`);
        setFormData({
          shopName: data.shopName,
          category: data.category,
          address: data.address,
          contact: data.contact,
          isOpen: data.isOpen // 👈 Purana status fetch kiya
        });
        setLoading(false);
      } catch (err) {
        setError('Shop data is not found.');
        setLoading(false);
      }
    };
    fetchShopData();
  }, [id]);

  // 2. Input Handle (Checkbox ke liye special logic)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/shops/${id}`, formData);
      alert('Shop data is successful update! 🚀');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed!');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]">
      <div className="text-blue-600 font-black animate-pulse uppercase tracking-[5px] text-sm font-mono">LOADING GAON DATA...</div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-6 py-24 font-sans antialiased selection:bg-blue-500/20">
      
      {/* --- FIXED TITLE & HEADER AREA (Perfectly Aligned) --- */}
      <div className="mb-10 text-center space-y-3">
        <div className="inline-block px-4 py-1 rounded-full border border-slate-200 bg-white shadow-sm text-slate-400 text-[9px] font-black tracking-[4px] uppercase">
          Management Console
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 italic tracking-tighter uppercase leading-tight">
          Update <span className="text-blue-600 drop-shadow-[0_4px_10px_rgba(37,99,235,0.1)]">Shop Settings</span>
        </h2>
        <div className="h-[2px] w-16 bg-blue-600/30 mx-auto mt-1"></div>
      </div>

      {error && (
        <p className="text-rose-600 bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs font-bold uppercase mb-8 shadow-sm text-center">
          {error}
        </p>
      )}

      {/* --- FORM WITH PERFECT VERTICAL FLOW --- */}
      <form onSubmit={handleSubmit} className="relative group space-y-6 p-8 md:p-10 rounded-[2.5rem] bg-white/70 border border-white/80 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 overflow-hidden">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>

        {/* Dynamic Subtle Neon Background Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[100px] pointer-events-none transition-colors duration-700 ${formData.isOpen ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}></div>

        <div className="relative space-y-5 flex flex-col">
          
          {/* --- ⚡ STATUS TOGGLE SECTION --- */}
          <div className={`flex items-center justify-between p-5 rounded-2xl bg-white border transition-all duration-300 shadow-sm ${formData.isOpen ? 'border-emerald-200 shadow-emerald-100/50' : 'border-rose-200 shadow-rose-100/50'}`}>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current Shop Status</p>
              <h3 className={`text-lg font-black uppercase italic tracking-tight ${formData.isOpen ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formData.isOpen ? "● Shop is Open" : "○ Shop is Closed"}
              </h3>
            </div>

            {/* Custom Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="isOpen"
                checked={formData.isOpen} 
                onChange={handleChange}
                className="sr-only peer" 
              />
              <div className="w-14 h-7 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500 shadow-inner"></div>
            </label>
          </div>

          {/* 1. Shop Name */}
          <div className="space-y-1.5 group/field">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 transition-colors group-focus-within/field:text-blue-600">Shop Name</label>
            <div className="relative overflow-hidden rounded-xl">
              <input 
                type="text" name="shopName" value={formData.shopName} onChange={handleChange} required 
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm font-medium text-sm"
              />
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-focus-within/field:w-full"></div>
            </div>
          </div>

          {/* 2. Category */}
          <div className="space-y-1.5 group/field">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 transition-colors group-focus-within/field:text-purple-600">Category</label>
            <div className="relative overflow-hidden rounded-xl">
              <select 
                name="category" value={formData.category} onChange={handleChange} required 
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-800 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm font-medium text-sm appearance-none cursor-pointer"
              >
                <option value="Kirana">Kirana</option>
                <option value="Medical">Medical</option>
                <option value="Salon">Salon/Parlour</option>
                <option value="Electronic">Electronic</option>
                <option value="Garments">Garments</option>
              </select>
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-purple-600 transition-all duration-300 group-focus-within/field:w-full"></div>
              <span className="absolute right-5 top-4 text-slate-400 pointer-events-none text-xs">▼</span>
            </div>
          </div>

          {/* 3. Address */}
          <div className="space-y-1.5 group/field">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 transition-colors group-focus-within/field:text-emerald-600">Address</label>
            <div className="relative overflow-hidden rounded-xl">
              <input 
                type="text" name="address" value={formData.address} onChange={handleChange} required 
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm font-medium text-sm"
              />
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-600 transition-all duration-300 group-focus-within/field:w-full"></div>
            </div>
          </div>

          {/* 4. Contact Number */}
          <div className="space-y-1.5 group/field">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 transition-colors group-focus-within/field:text-blue-600">Contact Number</label>
            <div className="relative overflow-hidden rounded-xl">
              <input 
                type="text" name="contact" value={formData.contact} onChange={handleChange} required 
                className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm font-medium text-sm"
              />
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-focus-within/field:w-full"></div>
            </div>
          </div>

        </div>

        {/* --- ACTIONS/BUTTONS BLOCK --- */}
        <div className="relative flex flex-col gap-3 pt-6 border-t border-slate-200/60 mt-4">
          
          {/* Save Button (Tactile 3D Action Style) */}
          <button 
            type="submit" 
            className="w-full relative overflow-hidden py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-150 transform active:scale-[0.98] border-b-[4px] border-blue-800 active:border-b-0 active:translate-y-[4px] shadow-sm flex items-center justify-center gap-2
            before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000"
          >
            <span>Save All Changes 💾</span>
          </button>

          {/* Cancel Button */}
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="w-full py-3 bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-500 hover:text-rose-600 font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-200 text-center shadow-sm"
          >
            Cancel Operations ❌
          </button>
          
        </div>
      </form>
    </div>
  );
}