import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion'; 

export default function Home() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isListening, setIsListening] = useState(false); 
  const navigate = useNavigate();

  // --- 🛡️ SMART ROLE MANAGEMENT ---
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const isShopkeeper = userRole === 'shopkeeper';
  const isCustomer = !isAdmin && !isShopkeeper;

  // --- 🛠️ UNIVERSAL RURAL CATEGORY ICONS MAPPING ---
  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('kirana') || cat.includes('grocery') || cat.includes('store')) return '🌾';
    if (cat.includes('medical') || cat.includes('medicine') || cat.includes('doctor')) return '🏥';
    if (cat.includes('salon') || cat.includes('parlour') || cat.includes('barber')) return '✂️';
    if (cat.includes('electronic') || cat.includes('bijli') || cat.includes('mobile')) return '⚡';
    if (cat.includes('garment') || cat.includes('kapde') || cat.includes('cloth')) return '👕';
    return '🏪'; 
  };

  // --- 🎤 DYNAMIC VOICE SEARCH ---
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support voice search. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      const cleanText = transcript.replace(/[.]/g, "").trim().toLowerCase();
      setSearchTerm(cleanText); 
    };
    recognition.start();
  };

  // --- 🔊 SPEAK STATUS LOGIC (WITH REAL-TIME OFFERS) ---
  const speakStatus = (e, shopName, category, isOpen, offers) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    if ('speechSynthesis' in window) {
      let statusText = isOpen 
        ? `The shop named ${shopName}, which is a ${category} store, is currently open. ` 
        : `The shop named ${shopName}, which is a ${category} store, is currently closed. `;
      
      if (offers?.isActive && offers?.discountText) {
        statusText += `Special deal active right now! They are offering ${offers.discountText}. ${offers.description || ''}`;
      }
      
      const utterance = new SpeechSynthesisUtterance(statusText);
      utterance.lang = 'en-IN'; 
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchShops = async () => {
    try {
      const { data } = await API.get('/shops');
      setShops(data);
      loading && setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      loading && setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = shops.filter((shop) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase().trim();
    const nameMatch = shop.shopName.toLowerCase().includes(searchLower);
    const categoryMatch = shop.category.toLowerCase().includes(searchLower);
    return nameMatch || categoryMatch;
  });

  const totalShops = filteredShops.length;
  const openShops = filteredShops.filter(shop => shop.isOpen === true).length;
  const closedShops = filteredShops.filter(shop => !shop.isOpen).length;

  const handleDelete = async (e, id) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this shop?")) {
      try {
        await API.delete(`/shops/${id}`);
        setShops(shops.filter(shop => shop._id !== id));
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const handleCardClick = (shopId) => {
    if (isAdmin || isShopkeeper) {
      return; 
    }
    navigate(`/shop/${shopId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.02 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 25 } }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh] bg-[#f1f5f9]">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-300"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 px-4 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] min-h-screen text-slate-800 font-sans tracking-tight antialiased">
      
      {/* GLOSSY INFINITE MARQUEE */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-smooth-scroll {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
      `}</style>

      <div className="w-full bg-white/80 border-b border-white/60 py-4 overflow-hidden shadow-sm backdrop-blur-md">
        <div className="animate-smooth-scroll whitespace-nowrap">
          <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-blue-600 px-10 flex items-center gap-2">
            <span>✨ Welcome to Gaon Shop Availability Portal</span> <span className="text-slate-300">•</span> <span>Real-time live glossy updates</span> <span className="text-slate-300">•</span>
          </h2>
          <h2 className="text-xs md:text-sm font-black uppercase tracking-widest text-blue-600 px-10 flex items-center gap-2">
            <span>✨ Welcome to Gaon Shop Availability Portal</span> <span className="text-slate-300">•</span> <span>Real-time live glossy updates</span> <span className="text-slate-300">•</span>
          </h2>
        </div>
      </div>

      {/* COUNTERS */}
      <div className="max-w-5xl mx-auto px-2 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-200/50 p-2 rounded-2xl border border-white/40 backdrop-blur-sm shadow-inner">
          <div className="bg-white/90 p-5 rounded-xl flex flex-col items-center justify-center border border-white shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-md">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Shops</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{totalShops}</h3>
          </div>
          <div className="bg-white/90 p-5 rounded-xl flex flex-col items-center justify-center border border-white shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-emerald-400 hover:shadow-md">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Open Now</p>
            </div>
            <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{openShops}</h3>
          </div>
          <div className="bg-white/90 p-5 rounded-xl flex flex-col items-center justify-center border border-white shadow-[0_4px_10px_rgba(0,0,0,0.02)] transition-all duration-200 hover:border-rose-400 hover:shadow-md">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Closed Units</p>
            <h3 className="text-3xl font-black text-rose-600 tracking-tight">{closedShops}</h3>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-2xl mx-auto px-2">
        <div className="relative flex items-center bg-white/90 border border-white rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus-within:border-blue-500 focus-within:shadow-[0_4px_20px_rgba(37,99,235,0.15)] transition-all duration-300 backdrop-blur-md">
          <input 
            type="text" 
            value={searchTerm}
            placeholder="Type store name or category to filter instantly..." 
            className="w-full bg-transparent text-slate-900 px-5 py-4 focus:outline-none font-bold placeholder:text-slate-400 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={startVoiceSearch} 
            className={`mr-3 p-2.5 rounded-xl text-sm font-bold transition-all ${isListening ? 'bg-rose-500 text-white shadow-lg animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'}`}
            title="Voice Search"
          >
            🎤
          </button>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="max-w-6xl mx-auto px-2">
        <AnimatePresence mode='wait'>
          {filteredShops.length > 0 ? (
            <motion.div 
              key="grid"
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              exit="hidden"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredShops.map((shop) => {
                const isOfferActive = shop.offers?.isActive && shop.offers?.discountText;

                // 🛠️ LIVE ON-THE-FLY IMAGE URL RESOLVER
                let finalImageUrl = "";
                if (shop.shopImage) {
                  if (shop.shopImage.includes("localhost:5000")) {
                    finalImageUrl = shop.shopImage.replace("http://localhost:5000", "https://gaon-ki-dukaan-backend.onrender.com");
                  } else if (shop.shopImage.startsWith("http")) {
                    finalImageUrl = shop.shopImage;
                  } else {
                    finalImageUrl = `https://gaon-ki-dukaan-backend.onrender.com${shop.shopImage.startsWith('/') ? '' : '/'}${shop.shopImage}`;
                  }
                }

                return (
                  <motion.div 
                    key={shop._id} 
                    variants={cardVariants}
                    onClick={() => handleCardClick(shop._id)}
                    className={`relative p-5 pt-16 rounded-2xl bg-white/70 border border-white/60 shadow-[0_4px_15px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden backdrop-blur-md group transition-all duration-300 ${
                      isAdmin || isShopkeeper 
                        ? 'cursor-default opacity-95' 
                        : 'cursor-pointer hover:shadow-[0_22px_45px_rgba(37,99,235,0.15)] hover:border-blue-300 hover:-translate-y-2'
                    } ${isOfferActive ? 'ring-2 ring-amber-500/30' : ''}`}
                  >
                    
                    {/* ✨ SHINE GLOSS OVERLAY EFFECT ON HOVER */}
                    {isCustomer && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />
                    )}

                    {/* --- 🛠️ HEADER ACTIONS CONTAINER --- */}
                    <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30 pointer-events-none">
                      
                      {/* 🟢/🔴 STATUS BADGE */}
                      <div className="flex items-center gap-1.5 bg-white/90 border border-slate-200 shadow-sm px-2.5 py-1 rounded-lg pointer-events-auto">
                        <div className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${shop.isOpen ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {shop.isOpen ? "Active Open" : "Closed"}
                        </span>
                      </div>

                      {/* RIGHT SIDE BADGES CONTAINER */}
                      <div className="flex items-center gap-2 pointer-events-auto">
                        {/* 🔥 BALANCED DYNAMIC OFFER CHIP */}
                        {isOfferActive && (
                          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-md shadow-orange-500/10 animate-pulse">
                            ★ {shop.offers.discountText}
                          </div>
                        )}

                        {/* 🔊 AUDIO SPEAKER */}
                        <button 
                          onClick={(e) => speakStatus(e, shop.shopName, shop.category, shop.isOpen, shop.offers)}
                          className="p-1.5 rounded-lg bg-blue-50/90 text-blue-600 border border-blue-200/50 hover:bg-blue-600 hover:text-white transition-all duration-200 text-xs flex items-center gap-1 font-black shadow-sm"
                        >
                          <span>🔊</span> <span className="text-[9px] uppercase tracking-widest hidden sm:inline">Suniye</span>
                        </button>
                      </div>
                    </div>

                    {/* ⚙️ MANAGEMENT MODE BADGE */}
                    {(isAdmin || isShopkeeper) && (
                      <div className="absolute top-[46px] left-4 z-30 bg-slate-100 border border-slate-200 text-slate-500 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                        Dashboard Only ⚙️
                      </div>
                    )}

                    {/* 🛍️ CORE CONTENT AREA */}
                    <div className="mt-2 flex flex-col items-center text-center flex-grow relative z-20"> 
                      
                      {/* IMAGE WITH SPECULAR GLOW BORDER */}
                      <div className={`w-24 h-24 bg-gradient-to-b from-white to-slate-100 border-2 border-white rounded-full flex items-center justify-center text-4xl shadow-[0_4px_12px_rgba(0,0,0,0.08),_inset_0_2px_4px_rgba(0,0,0,0.06)] overflow-hidden transition-transform duration-300 ${isCustomer && 'group-hover:scale-105'} ${isOfferActive ? 'ring-4 ring-amber-500/20' : ''}`}>
                        {finalImageUrl ? (
                          <img 
                            src={finalImageUrl} 
                            alt={shop.shopName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails, fallback to rendering the category icon text dynamically
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = getCategoryIcon(shop.category);
                            }}
                          />
                        ) : (
                          getCategoryIcon(shop.category)
                        )}
                      </div>

                      {/* SHOP NAME */}
                      <h3 className={`text-base font-black text-slate-900 mt-4 leading-tight tracking-tight uppercase transition-colors ${isCustomer && 'group-hover:text-blue-600'}`}>
                        {shop.shopName}
                      </h3>
                      
                      {/* CATEGORY TAG */}
                      <p className="text-blue-700 font-extrabold text-[9px] mt-1.5 bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                        {shop.category}
                      </p>

                      {/* 📢 BOTTOM PROMOTIONAL LOUDSPEAKER BANNER BOX */}
                      {isOfferActive && (
                        <div className="w-full mt-4 p-2.5 bg-gradient-to-r from-amber-500/5 to-orange-500/5 border border-amber-500/20 rounded-xl text-left flex items-start gap-2 shadow-inner">
                          <span className="text-sm mt-0.5 animate-bounce">📢</span>
                          <div className="truncate">
                            <p className="text-[9px] font-black text-amber-800 uppercase tracking-wide">Special Deal Running</p>
                            <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5">
                              {shop.offers.description || 'Hurry! Limited time store discount active.'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* 📞 📍 INFO CONTAINERS */}
                      <div className="w-full mt-4 space-y-2.5 text-left text-xs mb-4">
                        
                        {/* Phone Box */}
                        <div className="bg-gradient-to-r from-slate-50 to-white p-3 rounded-xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex items-center gap-3">
                          <span className="text-base bg-white p-1 rounded-md shadow-sm border border-slate-100">📞</span>
                          <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black">Contact Number</p>
                            <p className="font-extrabold text-slate-900 tracking-wide select-all mt-0.5">
                              {shop.contact}
                            </p>
                          </div>
                        </div>

                        {/* Address Box */}
                        <div className="bg-gradient-to-r from-slate-50 to-white p-3 rounded-xl border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex items-center gap-3">
                          <span className="text-base bg-white p-1 rounded-md shadow-sm border border-slate-100">📍</span>
                          <div className="flex-1">
                            <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black">Shop Location</p>
                            <p className="font-bold text-slate-700 leading-snug mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                              {shop.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* --- 🌟 INTERACTIVE CLICK INDICATOR BANNER FOR CUSTOMERS --- */}
                    {isCustomer && (
                      <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                        <span>View Catalogue</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-200">➔</span>
                      </div>
                    )}

                    {/* ADMIN CONTROL PANEL ACTION BUTTONS */}
                    {isAdmin && (
                      <div className="mt-auto flex gap-2 z-50 relative pt-1">
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/edit-shop/${shop._id}`); }} 
                          className="flex-1 py-2 bg-white/90 border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 uppercase hover:bg-blue-600 hover:text-white hover:border-blue-600 shadow-sm transition-all cursor-pointer"
                        >
                          Modify ✏️
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, shop._id)} 
                          className="p-2 bg-rose-50 text-rose-600 border border-rose-200/50 rounded-xl hover:bg-rose-600 hover:text-white shadow-sm transition-all cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-md">
                 <span className="text-3xl animate-bounce">🔍</span>
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 uppercase">No Matches Found</h2>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-xs">
                  We couldn't find any local stores matching your exact keyword.
                </p>
              </div>
              <button 
                onClick={() => setSearchTerm("")}
                className="px-6 py-2.5 bg-blue-600 text-white border border-blue-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 shadow-md transition-all"
              >
                Reset Search Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}