import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ Import fixed here
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AddShop from './pages/AddShop';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import EditShop from './pages/EditShop';
import ShopDetail from './pages/ShopDetail'; 
import InventoryPage from './pages/InventoryPage'; 
import About from './pages/About.jsx'; // About Us Page Route

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const timeOptions = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    console.log("Application initialized: Routing and Clock active.");
    
    return () => clearInterval(timer);
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 font-sans antialiased selection:bg-blue-500/20 overflow-x-hidden relative">
        
        {/* --- GLOBAL APP-LEVEL BACKGROUND BLURS --- */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        {/* Navigation Bar */}
        <Navbar />
        
        {/* --- 🕒 STICKY ROLE-BASED OVERLAY CLOCK --- */}
        <div className="fixed top-28 right-6 z-[150] pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/70 border border-white/80 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.03)] pointer-events-auto flex flex-col items-end"
          >
            {user ? (
              <div className="text-right flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-[2px] text-blue-600 italic">
                  {isAdmin ? `Admin: ${user.name}` : `Shopkeeper: ${user.name}`} ⚡
                </span>
                <span className="text-sm font-mono font-black text-slate-800 mt-0.5">
                  {currentTime.toLocaleTimeString([], timeOptions)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-base font-black italic tracking-tighter font-mono text-blue-600">
                  {currentTime.toLocaleTimeString([], timeOptions)}
                </span>
                <span className="text-[7px] font-black uppercase tracking-[3px] text-slate-400 mt-0.5">LIVE TIME FEED</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* --- MAIN PAGE ROUTER UNIT --- */}
        <main className="pt-32 pb-24 px-4 md:px-6 max-w-7xl mx-auto min-h-[85vh]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} /> 
            <Route path="/add-shop" element={<AddShop />} />
            <Route path="/shop/:id" element={<ShopDetail />} />
            <Route path="/inventory/:id" element={<InventoryPage />} />
            <Route path="/edit-shop/:id" element={<EditShop />} />
            <Route path="/dashboard" element={<ShopkeeperDashboard />} />
          </Routes>
        </main>

        {/* --- MULTI-COLUMN FAT FOOTER --- */}
        <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="sm:col-span-2 lg:col-span-1">
                <h2 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase">
                  GAON <span className="text-blue-600">SHOP</span> STATUS<span className="text-blue-600">.</span>
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                  Connecting local communities with accurate, real-time shop availability.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Explore</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm font-bold text-slate-500">
                  <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                  <a href="/about" className="hover:text-blue-600 transition-colors">About Us</a>
                  <a href="/login" className="hover:text-blue-600 transition-colors">Sign In</a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">For Businesses</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm font-bold text-slate-500">
                  <a href="/login" className="hover:text-blue-600 transition-colors">Shopkeeper Login</a>
                  <a href="/login" className="hover:text-blue-600 transition-colors">Admin Access</a>
                  <a href="/dashboard" className="hover:text-blue-600 transition-colors">Shop Dashboard</a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Platform</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm font-bold text-slate-500">
                  <span>Live Shop Status</span>
                  <span>Digital Catalogues</span>
                  <span>Community Updates</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                &copy; 2026 Gaon Shop Status
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Built for the community ⚡
              </p>
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;