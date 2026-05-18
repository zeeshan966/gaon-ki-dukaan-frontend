import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBoxOpen, FaStore, FaShoppingCart, FaArrowLeft, FaSearch, FaMicrophone, FaTag } from "react-icons/fa";

export default function ShopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const fetchShopDetails = async () => {
    try {
      const res = await API.get(`/shops/${id}`);
      setShop(res.data);
      setItems(res.data.inventory || []); 
      setLoading(false);
    } catch (err) {
      console.error("Critical: Failed to fetch shop details", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopDetails();
  }, [id]);

  // Dynamic Voice Search Logic
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; // Mixed Hindi/English support
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.replace(/[.]/g, ""); // Cleaning
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
      <div className="text-blue-600 font-black animate-pulse uppercase tracking-[5px] text-sm font-mono">LOADING SHOP SHELF...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 p-4 md:p-8 pt-24 font-sans antialiased selection:bg-blue-500/20">
      
      {/* GLOBAL BACKGROUND SOFT GLOWS */}
      <div className="fixed top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-500/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-purple-500/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        
        {/* TOP NAVIGATION BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] group pl-1"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Shops
        </button>

        {/* --- 1. PREMIUM GLASS SHOP PROFILE CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-md border border-white/80 p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)]"
        >
          {/* Top Elegant Color Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          
          <div className="absolute top-0 right-0 p-8 text-slate-100 pointer-events-none">
            <FaStore size={90} />
          </div>

          <div className="space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{shop?.category}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              {shop?.shopName}<span className="text-blue-600">.</span>
            </h1>
            
            <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.25em] flex items-center gap-1.5">
              {shop?.isOpen ? (
                <>
                  <span className="text-emerald-500">●</span> Currently Accepting Orders
                </>
              ) : (
                <>
                  <span className="text-rose-500">○</span> Closed for now
                </>
              )}
            </p>
          </div>
        </motion.div>

        {/* --- 🔥 1.5 DYNAMIC OFFERS SECTION (IF LIVE) --- */}
        {shop?.offers?.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-md border border-orange-200/60 p-5 rounded-2xl flex items-start gap-4 relative overflow-hidden shadow-sm"
          >
            <div className="absolute -right-4 -bottom-4 text-orange-500/10 pointer-events-none transform rotate-12">
              <FaTag size={80} />
            </div>
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl text-white shadow-sm shrink-0">
              <FaTag size={16} className="animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-sm font-black text-orange-700 uppercase tracking-tight">
                {shop.offers.discountText || "SPECIAL DISCOUNT OFFER LIVE!"}
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {shop.offers.description || "Dukan par bhaari chut chal rahi hai, jaldi loot lo!"}
              </p>
            </div>
          </motion.div>
        )}

        {/* --- 2. SMOOTH LIGHT SEARCH & MIC BAR --- */}
        <div className="relative group px-0.5">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <FaSearch size={15} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items from live catalogue..."
            className="w-full bg-white border border-slate-200 py-4.5 pl-14 pr-16 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium text-slate-800 shadow-sm placeholder:text-slate-300"
          />
          <button 
            onClick={handleVoiceSearch}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all duration-300 shadow-sm ${
              isListening 
              ? "bg-rose-500 text-white animate-bounce shadow-[0_4px_15px_rgba(244,63,94,0.3)]" 
              : "bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
          >
            <FaMicrophone size={14} />
          </button>
        </div>

        {/* --- 3. LIVE MENU/INVENTORY LIST --- */}
        <div className="space-y-3.5">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {searchQuery ? `Matching Results (${filteredItems.length})` : 'Live Menu'}
            </h2>
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    key={item._id}
                    className={`group flex items-center justify-between p-4 px-6 rounded-2xl border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] ${
                      item.isAvailable 
                      ? 'bg-white/70 border-slate-200/80 hover:border-blue-400 hover:shadow-md' 
                      : 'bg-slate-100/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                        item.isAvailable 
                        ? 'text-blue-600 border-blue-100 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white' 
                        : 'text-slate-400 border-slate-200 bg-slate-50'
                      }`}>
                        <FaShoppingCart size={15} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-sm tracking-tight transition-colors ${item.isAvailable ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-400 line-through'}`}>
                          {item.itemName}
                        </h3>
                        
                        {/* --- 💎 PREMIUM DYNAMIC PRICE PER UNIT DISPLAY --- */}
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="font-black text-sm text-blue-600 font-mono">
                            ₹{item.price}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold tracking-tight">
                            / {item.unit || "piece"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.15em] border shadow-sm ${
                      item.isAvailable 
                      ? 'text-emerald-600 border-emerald-200 bg-emerald-50' 
                      : 'text-rose-500 border-rose-200 bg-rose-50'
                    }`}>
                      {item.isAvailable ? "Available" : "Sold Out"}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-16 bg-white/40 rounded-[2.5rem] border border-dashed border-slate-200"
                >
                  <FaBoxOpen className="mx-auto text-slate-300 mb-3" size={36} />
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em]">Oops! Item nahi mila</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  ); 
}