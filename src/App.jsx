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
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-base font-black italic tracking-tighter font-mono text-blue-600">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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

        {/* --- PREMIUM LIGHT FOOTER --- */}
        <footer className="border-t border-slate-200/80 py-10 bg-white/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-black italic tracking-tighter text-slate-900 uppercase">
                GAON <span className="text-blue-600">SHOP</span> STATUS<span className="text-blue-600">.</span>
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[2px] mt-0.5">
                Connecting villages to digital reality
              </p>
            </div>
            <div className="text-slate-400 text-[9px] font-black uppercase tracking-[2.5px] bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-xl shadow-sm">
              &copy; 2026 | Built for the community ⚡
            </div>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;