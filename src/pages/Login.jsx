import { useState } from 'react';
import API from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Navbar se bheji gayi targetRole catch karo (Fallback to shopkeeper if direct link visit)
  const targetRole = location.state?.targetRole || 'shopkeeper';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend ko clear information ke liye base parameters wrap kiye hain
      const { data } = await API.post('/auth/login', { email, password });
      
      // Token aur User data save karo
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert('Login Successful! 🚀');

      // 2. Exact Dynamic Role-based Redirection
      if (data.user.role?.toLowerCase() === 'shopkeeper') {
        navigate('/dashboard'); // Shopkeeper goes straight to control unit
      } else if (data.user.role?.toLowerCase() === 'admin') {
        navigate('/add-shop'); // Admin goes straight to core engine panel
      } else {
        navigate('/'); // Normal consumer/user to main page
      }

      // Sync global application context across navbar components instantly
      window.location.reload();

    } catch (err) {
      alert(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] px-6 py-12 font-sans antialiased selection:bg-blue-500/20">
      
      {/* --- MAIN GLASS CARD --- */}
      <div className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-white/70 border border-white/80 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        
        {/* --- DYNAMIC ACCENT LINE BASED ON SELECTED ACCESS CHANNEL --- */}
        <div className={`absolute top-0 left-0 w-full h-1.5 transition-all duration-500 ${
          targetRole === 'admin' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-purple-500 to-pink-600'
        }`}></div>
        
        {/* Background Subtle Radial Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>

        {/* --- HEADER --- */}
        <div className="text-center mb-8 space-y-1">
          <div className={`mx-auto w-max px-3 py-1 rounded-full border shadow-sm text-[8px] font-black tracking-[3px] uppercase mb-2 transition-all duration-500 ${
            targetRole === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'
          }`}>
            {targetRole === 'admin' ? 'Administrative Vault' : 'Merchant Terminal'}
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
            GAON<span className="text-blue-600">DUKAAN</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[2px] text-slate-400">
            LOGGING IN AS <span className={targetRole === 'admin' ? 'text-blue-600 font-extrabold' : 'text-purple-600 font-extrabold'}>{targetRole}</span>
          </p>
        </div>
        
        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* EMAIL FIELD */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Email ID ({targetRole})
            </label>
            <div className="relative group">
              <input 
                type="email" 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm font-medium"
                placeholder={targetRole === 'admin' ? 'admin.core@gaonlyf.com' : 'shopkeeper.retail@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="absolute right-4 top-3.5 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors">
                ✉️
              </span>
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              Password
            </label>
            <div className="relative group">
              <input 
                type="password" 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm font-medium"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-4 top-3.5 text-slate-400 text-sm group-focus-within:text-blue-500 transition-colors">
                🔑
              </span>
            </div>
          </div>

          {/* --- SUBMIT BUTTON (Matches Navbar 3D Tactile Style & Dynamic Colors) --- */}
          <div className="pt-3">
            <button 
              type="submit" 
              className={`w-full relative overflow-hidden py-3.5 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all duration-150 transform active:scale-[0.98] border-b-[4px] active:border-b-0 active:translate-y-[4px] shadow-sm flex items-center justify-center gap-2 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 ${
                targetRole === 'admin'
                ? 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border-blue-800'
                : 'bg-purple-600 hover:bg-purple-500 active:bg-purple-700 border-purple-800'
              }`}
            >
              <span>Verify Access Token ⚡</span>
            </button>
          </div>

        </form>

        {/* --- SYSTEM FOOTER --- */}
        <div className="mt-8 pt-4 border-t border-slate-200/60 text-center">
          <p className="text-[8px] font-black uppercase tracking-[4px] text-slate-300">
            Channel: {targetRole.toUpperCase()} GATEWAY [LIVE]
          </p>
        </div>

      </div>
    </div>
  );
}