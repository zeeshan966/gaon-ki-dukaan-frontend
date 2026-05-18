import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function ShopkeeperDashboard() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // --- 📝 MODAL PROFILE & OFFERS STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    shopName: '', 
    contact: '', 
    address: '',
    discountText: '',
    offerDescription: '',
    isOfferActive: false 
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Data extraction logic
  const user = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
    const fetchMyShop = async () => {
      try {
        if (user && user.id) {
          const { data } = await API.get(`/shops/owner/${user.id}`);
          setShop(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Shop fetching error:", err);
        setLoading(false);
      }
    };
    fetchMyShop();
  }, [user?.id]);

  const toggleStatus = async () => {
    try {
      const shopId = shop._id || shop.id; 
      const { data } = await API.put(`/shops/${shopId}/status`);
      setShop(data); 
    } catch (err) {
      alert("Failed to update status. Server error!");
    }
  };

  // --- 🛠️ UPDATE PROFILE & OFFERS CONTROLLER HANDLER ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const data = new FormData();
    data.append('shopName', formData.shopName);
    data.append('contact', formData.contact);
    data.append('address', formData.address);
    
    // 🔥 Injecting Offer values into FormData matching backend expectations
    data.append('discountText', formData.discountText);
    data.append('offerDescription', formData.offerDescription);
    data.append('isOfferActive', formData.isOfferActive); // Will pass string 'true' or 'false'

    if (selectedFile) {
      data.append('shopImage', selectedFile);
    }

    try {
      const shopId = shop._id || shop.id;
      // PUT request hitting backend controller
      const response = await API.put(`/shops/${shopId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 🔥 CRITICAL REAL-TIME UPDATE: Bin page refresh data chamkega
      setShop(response.data);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile details.");
    } finally {
      setEditLoading(false);
    }
  };

  // Open modal and prefill current data including offers object safely
  const openEditModal = () => {
    setFormData({
      shopName: shop.shopName,
      contact: shop.contact,
      address: shop.address,
      discountText: shop.offers?.discountText || '',
      offerDescription: shop.offers?.description || '',
      isOfferActive: shop.offers?.isActive || false
    });
    setIsEditing(true);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
      <div className="text-blue-600 font-black animate-pulse uppercase tracking-[5px] text-sm font-mono">LOADING CONTROL UNIT...</div>
    </div>
  );

  if (!shop) return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full py-12 px-8 bg-white/70 backdrop-blur-md border border-slate-200 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
        <h2 className="text-xl font-black text-rose-600 uppercase tracking-tight italic">No Shop Linked!</h2>
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl my-4 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
          Owner ID: <span className="text-slate-700 font-bold">{user?.id || 'N/A'}</span>
        </div>
        <p className="text-slate-400 text-xs font-medium leading-relaxed">
          Aapka account kisi registered shop ke sath connected nahi hai. Please system admin se contact karein.
        </p>
      </div>
    </div>
  );

  const shopId = shop._id || shop.id;
  const isLiveOfferActive = shop.offers?.isActive && shop.offers?.discountText;

  return (
    <div className="flex justify-center items-center min-h-[75vh] px-4 font-sans antialiased selection:bg-blue-500/20 pt-20">
      <div className="relative group w-full max-w-xl">
        
        {/* --- DYNAMIC AMBIENT BACKDROP GLOW --- */}
        <div className={`absolute -inset-4 rounded-[3.5rem] blur-3xl opacity-40 transition-colors duration-1000 pointer-events-none -z-10 ${shop.isOpen ? 'bg-emerald-400/20' : 'bg-rose-400/20'}`}></div>

        {/* --- MAIN GLASS CONTAINER --- */}
        <div className="relative bg-white/70 backdrop-blur-md border border-white/80 p-8 md:p-12 rounded-[2.8rem] text-center shadow-[0_15px_50px_rgba(0,0,0,0.03)] overflow-hidden">
          
          {/* Top Architectural Branding Strip */}
          <div className={`absolute top-0 left-0 w-full h-1.5 transition-colors duration-500 ${shop.isOpen ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-rose-400 to-pink-500'}`}></div>

          <span className="inline-block px-3.5 py-1 rounded-full border border-slate-200 bg-white text-slate-400 text-[9px] font-black tracking-[4px] uppercase shadow-sm">
            Terminal Console
          </span>
          
          <h2 className="text-3xl md:text-4xl font-black italic text-slate-900 uppercase mt-4 tracking-tighter leading-tight">
            {shop.shopName}<span className="text-blue-600">.</span>
          </h2>

          {/* --- 🔥 NEW: LIVE OFFER DASHBOARD DISPLAY BANNER --- */}
          {isLiveOfferActive && (
            <div className="mt-4 px-4 py-2.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl animate-pulse flex items-center justify-between gap-3 text-left">
              <div className="truncate">
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-black uppercase tracking-wider mr-2 inline-block">
                  {shop.offers.discountText}
                </span>
                <span className="text-xs font-bold text-amber-700 font-sans">
                  {shop.offers.description || 'Special offer active!'}
                </span>
              </div>
              <span className="text-xs">🔥</span>
            </div>
          )}
          
          {/* --- BIG HEADS-UP STATUS MONITOR --- */}
          <div className="my-8 py-6 rounded-3xl bg-slate-50/60 border border-slate-100 shadow-inner relative group">
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[3px] mb-2">Live Transmission</p>
            <div className={`text-6xl md:text-7xl font-black italic tracking-tighter transition-all duration-300 ${
              shop.isOpen 
              ? 'text-emerald-600 drop-shadow-[0_4px_12px_rgba(16,185,129,0.15)]' 
              : 'text-rose-600 drop-shadow-[0_4px_12px_rgba(244,63,148,0.15)]'
            }`}>
              {shop.isOpen ? "OPEN" : "CLOSED"}
            </div>
          </div>

          {/* --- ACTION HUBS (DASHBOARD GRID) --- */}
          <div className="flex flex-col gap-4">
            
            {/* TACTILE 3D STATUS SWITCH ACTION */}
            <button 
              onClick={toggleStatus}
              className={`w-full py-4.5 rounded-2xl font-black uppercase tracking-[3px] text-xs transition-all duration-150 transform active:scale-[0.98] active:translate-y-[4px] shadow-md cursor-pointer ${
                shop.isOpen 
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-b-[4px] border-rose-800 active:border-b-0' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-b-[4px] border-emerald-800 active:border-b-0'
              }`}
            >
              {shop.isOpen ? "Switch to Offline 🚪" : "Go Live Now ⚡"}
            </button>

            {/* 📦 DIRECT INVENTORY MANAGEMENT GATEWAY */}
            <button 
              onClick={() => navigate(`/inventory/${shopId}`)}
              className="w-full py-4.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[3px] text-xs rounded-2xl transition-all duration-150 transform active:scale-[0.98] active:translate-y-[4px] border-b-[4px] border-blue-800 active:border-b-0 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Manage Inventory / Stock 📦
            </button>

            {/* ✏️ MODERN EDIT SHOP DETAILS & OFFERS GATEWAY */}
            <button 
              onClick={openEditModal}
              className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-[3px] text-xs rounded-2xl transition-all duration-150 transform active:scale-[0.98] active:translate-y-[4px] border-b-[4px] border-slate-950 active:border-b-0 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              Modify Profile & Offers ✏️
            </button>
          </div>

          {/* --- METADATA FOOTER AREA --- */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <div className="bg-white/50 py-2.5 px-4 rounded-xl border border-slate-100 shadow-sm truncate text-center">
              📍 {shop.address ? shop.address.substring(0, 24) : 'No Address'}...
            </div>
            <div className="bg-white/50 py-2.5 px-4 rounded-xl border border-slate-100 shadow-sm text-center font-mono text-slate-500">
              📞 {shop.contact || 'No Contact Info'}
            </div>
          </div>

        </div>
      </div>

      {/* --- GLOSSY EMBEDDED GLASS MODAL POPUP --- */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-md flex justify-center items-center z-[100] p-4 transition-all duration-300">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-8 w-full max-w-md border border-white/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] h-[85vh] overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
            
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic mb-6">
              Update Settings <span className="text-blue-600">⚙️</span>
            </h3>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4 text-left">
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Shop Name</label>
                <input 
                  type="text" 
                  value={formData.shopName} 
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} 
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-inner" 
                  required 
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Contact Number</label>
                <input 
                  type="text" 
                  value={formData.contact} 
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })} 
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-inner" 
                  required 
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Location Address</label>
                <input 
                  type="text" 
                  value={formData.address} 
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                  className="w-full mt-1.5 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-blue-500 transition-colors shadow-inner" 
                  required 
                />
              </div>

              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">New Shop Banner (File)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                  className="w-full mt-1.5 p-2 bg-slate-100/50 rounded-xl text-xs font-bold text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 cursor-pointer" 
                />
              </div>

              {/* --- 🔥 NEW SEPARATOR & OFFERS PANEL SECTION --- */}
              <div className="pt-4 mt-6 border-t border-dashed border-slate-200 bg-amber-50/40 border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-800 tracking-tight">Promotional Offer Setup</h4>
                    <p className="text-[9px] font-bold text-amber-600/70 lowercase">Manage live discounts on cards</p>
                  </div>
                  
                  {/* iOS Style Toggle Slider Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.isOfferActive} 
                      onChange={(e) => setFormData({ ...formData, isOfferActive: e.target.checked })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                <div className={`space-y-3 transition-all duration-300 ${formData.isOfferActive ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <div>
                    <label className="text-[9px] font-black uppercase text-amber-700 tracking-wider">Offer Badge Chip Text</label>
                    <input 
                      type="text" 
                      placeholder="e.g., 20% OFF, FREE DELIVERY"
                      value={formData.discountText} 
                      onChange={(e) => setFormData({ ...formData, discountText: e.target.value })} 
                      className="w-full mt-1 p-2.5 bg-white border border-amber-200/60 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm" 
                      required={formData.isOfferActive}
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase text-amber-700 tracking-wider">Offer Terms Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g., On grocery bills above Rs. 500"
                      value={formData.offerDescription} 
                      onChange={(e) => setFormData({ ...formData, offerDescription: e.target.value })} 
                      className="w-full mt-1 p-2.5 bg-white border border-amber-200/60 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/95 py-2">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl text-xs uppercase border border-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  disabled={editLoading} 
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-xs uppercase shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
                >
                  {editLoading ? "Saving..." : "Save Config ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}