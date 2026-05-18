import { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AddShop() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    owner: '',
    category: '',
    address: '',
    contact: ''
  });

  // 📸 State photo file aur live image preview handler ke liye
  const [shopImage, setShopImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // File selection capture function
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setShopImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Real-time preview link generation
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🚨 Multipart FormData pipeline setup
      const data = new FormData();
      data.append('shopName', formData.shopName);
      data.append('category', formData.category);
      data.append('contact', formData.contact);
      data.append('owner', formData.owner);
      data.append('address', formData.address);
      
      if (shopImage) {
        data.append('shopImage', shopImage);
      }

      await API.post('/shops', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert("System Updated: New Shop is now Live! 🚀");
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || "Admin authorization failed!");
    } finally {
      setLoading(false);
    }
  };

  // --- Style Constants (Updated for White Glassmorphism Context) ---
  const labelStyle = "block text-[10px] font-black text-slate-400 uppercase tracking-[2.5px] mb-1.5 ml-1 group-focus-within:text-blue-600 transition-colors duration-300";
  const inputContainer = "group relative mb-5";
  const inputStyle = "w-full bg-white border border-slate-200 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-300 text-sm rounded-xl transition-all shadow-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 font-medium";

  return (
    <div className="flex justify-center items-center py-24 px-4 min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] font-sans antialiased selection:bg-blue-500/20">
      
      {/* Container width limited to 'md' for perfect vertical balance */}
      <div className="relative w-full max-w-md">
        
        {/* Subtle Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-xl opacity-10"></div>

        <div className="relative w-full p-8 md:p-10 rounded-[2.5rem] bg-white/70 border border-white/80 backdrop-blur-md z-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-lg">
          
          {/* Top Decorative Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>

          {/* Vertical Centered Header */}
          <div className="mb-8 text-center space-y-1">
            <div className="mx-auto w-max px-3 py-1 rounded-full border border-slate-200 bg-white shadow-sm text-slate-400 text-[8px] font-black tracking-[3px] uppercase mb-2">
              System Operations
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
              Admin <span className="text-blue-600">Console</span>
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
              Deploy New Service Unit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            
            {/* 1. Shop Designation */}
            <div className={inputContainer}>
              <label className={labelStyle}>Shop Designation</label>
              <div className="relative overflow-hidden rounded-xl">
                <input 
                  type="text" required placeholder="Sharma Kirana Store" className={inputStyle}
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-500 group-focus-within:w-full"></div>
              </div>
            </div>

            {/* 2. Service Category */}
            <div className={inputContainer}>
              <label className={labelStyle}>Service Category</label>
              <div className="relative overflow-hidden rounded-xl">
                <input 
                  type="text" required placeholder="e.g. Grocery, Medical" className={inputStyle}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-purple-600 transition-all duration-500 group-focus-within:w-full"></div>
              </div>
            </div>

            {/* 3. Communication Link */}
            <div className={inputContainer}>
              <label className={labelStyle}>Communication Link</label>
              <div className="relative overflow-hidden rounded-xl">
                <input 
                  type="text" required placeholder="10-digit mobile number" className={inputStyle}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-emerald-600 transition-all duration-500 group-focus-within:w-full"></div>
              </div>
            </div>

            {/* 4. Shopkeeper ID */}
            <div className={inputContainer}>
              <label className={labelStyle}>Assign Owner ID</label>
              <div className="relative overflow-hidden rounded-xl">
                <input 
                  type="text" required placeholder="MongoDB _id of Shopkeeper" className={inputStyle}
                  onChange={(e) => setFormData({...formData, owner: e.target.value})}
                />
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-blue-600 transition-all duration-500 group-focus-within:w-full"></div>
              </div>
            </div>

            {/* 5. Address */}
            <div className={inputContainer}>
              <label className={labelStyle}>Location Address</label>
              <div className="relative overflow-hidden rounded-xl">
                <textarea 
                  required rows="2" placeholder="Street, Village, Landmark" className={`${inputStyle} resize-none`}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-purple-600 transition-all duration-500 group-focus-within:w-full"></div>
              </div>
            </div>

            {/* 📸 6. NEW GLASS IMAGE SELECTOR BLOCK */}
            <div className={`${inputContainer} bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm`}>
              <label className={labelStyle}>Shop Identity Photo</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-blue-100 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-600 hover:file:text-white file:transition-all cursor-pointer"
              />
              
              {/* Image Preview Box */}
              {previewUrl && (
                <div className="mt-4 border-t border-slate-200/60 pt-3 text-center">
                  <img 
                    src={previewUrl} 
                    alt="Upload Preview" 
                    className="w-24 h-24 object-cover rounded-xl mx-auto border-2 border-white shadow-md transition-all duration-300"
                  />
                  <p className="text-[8px] text-blue-600 font-mono mt-1.5 uppercase tracking-widest font-bold">Image Loaded Ready</p>
                </div>
              )}
            </div>

            {/* Submit Button (Matches 3D Tactile Action) */}
            <button 
              type="submit" 
              disabled={loading} 
              className="mt-2 w-full relative overflow-hidden py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-150 transform active:scale-[0.98] border-b-[4px] border-blue-800 active:border-b-0 active:translate-y-[4px] shadow-sm flex items-center justify-center gap-2 disabled:opacity-50
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000"
            >
              <span>{loading ? 'Uploading Assets... ⚡' : 'Deploy Unit ⚡'}</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}