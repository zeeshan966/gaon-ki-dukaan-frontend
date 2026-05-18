import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaBoxOpen, FaArrowLeft, FaEdit, FaTimes, FaMicrophone, FaSearch } from "react-icons/fa";

// --- 🌾 CATEGORY WISE DYNAMIC CONFIGURATION (UNITS & LABELS) ---
const categoryConfigs = {
  grocery: {
    units: ['kg', 'gm', 'packet', 'piece', 'litre'],
    defaultUnit: 'kg',
    placeholder: 'e.g. Loose Sugar (Chini) or Fortune Oil',
    priceLabel: 'Asset Price Per Unit/Kg (INR)'
  },
  kirana: {
    units: ['kg', 'gm', 'packet', 'piece', 'litre'],
    defaultUnit: 'kg',
    placeholder: 'e.g. Loose Sugar (Chini) or Fortune Oil',
    priceLabel: 'Asset Price Per Unit/Kg (INR)'
  },
  medical: {
    units: ['strip', 'tablet', 'bottle', 'piece'],
    defaultUnit: 'strip',
    placeholder: 'e.g. Paracetamol Strip or Cough Syrup',
    priceLabel: 'Asset Price Per Strip/Bottle (INR)'
  },
  pharmacy: {
    units: ['strip', 'tablet', 'bottle', 'piece'],
    defaultUnit: 'strip',
    placeholder: 'e.g. Paracetamol Strip or Cough Syrup',
    priceLabel: 'Asset Price Per Strip/Bottle (INR)'
  },
  garments: {
    units: ['piece', 'meter', 'pair'],
    defaultUnit: 'piece',
    placeholder: 'e.g. Denim Jeans or Cotton Fabrics',
    priceLabel: 'Asset Price Per Piece/Meter (INR)'
  },
  clothing: {
    units: ['piece', 'meter', 'pair'],
    defaultUnit: 'piece',
    placeholder: 'e.g. Denim Jeans or Cotton Fabrics',
    priceLabel: 'Asset Price Per Piece/Meter (INR)'
  },
  other: {
    units: ['piece', 'set', 'box', 'packet'],
    defaultUnit: 'piece',
    placeholder: 'e.g. Custom Item Name',
    priceLabel: 'Asset Price (INR)'
  }
};

export default function InventoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isListening, setIsListening] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");

  // Clean Configuration Object Based on Current Shop Category
  const shopCategory = shop?.category?.toLowerCase() || 'other';
  const currentConfig = categoryConfigs[shopCategory] || categoryConfigs.other;

  const [newItem, setNewItem] = useState({ 
    itemName: "", 
    price: "", 
    category: "General", 
    isAvailable: true,
    unit: "piece" // Handled dynamically in useEffect below
  });

  // Automatically update default dynamic unit once shop loads successfully
  useEffect(() => {
    if (shop) {
      setNewItem(prev => ({ ...prev, unit: currentConfig.defaultUnit }));
    }
  }, [shop, currentConfig.defaultUnit]);

  // Dynamic Voice Logic
  const handleVoiceInput = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(field);
    
    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.replace(/[.]/g, "");

      if (field === "search") {
        setSearchQuery(transcript);
      } else if (field === "price") {
        const numericValue = transcript.replace(/[^\d]/g, "");
        if (editingItem) {
          setEditingItem(prev => ({ ...prev, price: numericValue }));
        } else {
          setNewItem(prev => ({ ...prev, price: numericValue }));
        }
      } else if (field === "itemName") {
        if (editingItem) {
          setEditingItem(prev => ({ ...prev, itemName: transcript }));
        } else {
          setNewItem(prev => ({ ...prev, itemName: transcript }));
        }
      }
      setIsListening(null);
    };

    recognition.onerror = () => setIsListening(null);
    recognition.onend = () => setIsListening(null);
    recognition.start();
  };

  // Smart Filter Logic
  const filteredItems = items.filter(item => 
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => { 
    const fetchInventoryData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // --- 🛡️ EXTREME RBAC & IDOR GUARD INTERACTION ---
        if (!user) {
          alert("Access Denied. Please log in first.");
          navigate('/login');
          return;
        }

        const res = await API.get(`/shops/${id}`);
        const fetchedShop = res.data;

        if (user.role?.toLowerCase() === 'shopkeeper') {
          const actualOwnerId = fetchedShop.owner?._id || fetchedShop.owner || fetchedShop.userId;
          
          if (actualOwnerId !== user.id) {
            alert("🔒 Access Restricted: You are not authorized to modify this shop's inventory!");
            navigate('/dashboard');
            return;
          }
        }

        setShop(fetchedShop);
        setItems(fetchedShop.inventory || []);
        setLoading(false);
      } catch (err) {
        console.error("Fetch failed", err);
        alert("Error loading shop resources.");
        navigate(-1);
      }
    };

    fetchInventoryData(); 
  }, [id, navigate]);

  const toggleStatus = async (itemId, currentStatus) => {
    const newStatus = !currentStatus;
    setItems(prev => prev.map(item => item._id === itemId ? { ...item, isAvailable: newStatus } : item));
    try { 
      await API.put(`/shops/${id}/items/${itemId}`, { isAvailable: newStatus }); 
    } catch (err) { 
      // Rollback on error
      setItems(prev => prev.map(item => item._id === itemId ? { ...item, isAvailable: currentStatus } : item));
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editingItem,
        price: Number(editingItem.price) // Parse explicitly to number
      };
      await API.put(`/shops/${id}/items/${editingItem._id}`, payload);
      setItems(items.map(item => item._id === editingItem._id ? payload : item));
      setEditingItem(null); 
    } catch (err) { console.error("Update failed"); }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        price: Number(newItem.price) // Save explicitly as number datatype
      };
      const { data } = await API.post(`/shops/${id}/items`, payload);
      setItems(prev => [...prev, data]);
      setNewItem({ itemName: "", price: "", category: "General", isAvailable: true, unit: currentConfig.defaultUnit });
      setShowForm(false);
    } catch (err) { console.error("Add failed"); }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/shops/${id}/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (err) { console.error("Delete failed"); }
  };

  const formatPrice = (p) => String(p).replace(/[^\d.]/g, "");

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] flex items-center justify-center">
      <div className="text-blue-600 font-black animate-pulse uppercase tracking-[5px] text-sm font-mono">LOADING CONTROL UNIT...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 p-4 md:p-8 pt-24 selection:bg-blue-500/20 font-sans antialiased">
      
      {/* Background Soft Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* --- 1. TOP SHOP DETAILS CARD --- */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white/70 backdrop-blur-md border border-white/80 p-6 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600"></div>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <button 
                onClick={() => navigate('/dashboard')} 
                className="flex items-center gap-1.5 text-blue-600 text-[9px] font-black uppercase tracking-widest mb-3 hover:text-blue-500 transition-all"
              >
                <FaArrowLeft size={10} /> Exit Dashboard
              </button>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 italic">
                {shop?.shopName}<span className="text-blue-600">.</span>
              </h1>
              <p className="text-slate-400 font-black text-[9px] uppercase tracking-[0.25em]">{shop?.category}</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl text-center shadow-sm">
              <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Items</span>
              <span className="text-2xl font-light text-blue-600 leading-none font-mono">{items.length}</span>
            </div>
          </div>
        </motion.div>

        {/* --- 2. SEARCH BAR COMPONENT --- */}
        <div className="relative group px-1">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <FaSearch size={14} />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name..."
            className="w-full bg-white border border-slate-200 py-4 pl-12 pr-14 rounded-2xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm text-slate-800 shadow-sm font-medium placeholder:text-slate-300"
          />
          <button 
            onClick={() => handleVoiceInput("search")}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-sm ${isListening === "search" ? "bg-rose-500 text-white animate-pulse" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"}`}
          >
            <FaMicrophone size={13} />
          </button>
        </div>

        {/* --- 3. SECTION CONTROL HEADER --- */}
        <div className="flex justify-between items-center px-2 mt-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Dashboard</h2>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`px-5 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all shadow-sm ${showForm ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' : 'bg-blue-600 text-white hover:bg-blue-500 border-b-[3px] border-blue-800 active:border-b-0 active:translate-y-[3px]'}`}
          >
            {showForm ? "Cancel Asset" : "Add Item +"}
          </button>
        </div>

        {/* --- ADD ITEM DYNAMIC DROPDOWN FORM --- */}
        <AnimatePresence>
          {showForm && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddItem} 
              className="overflow-hidden flex flex-col gap-4 bg-white/70 border border-white/80 backdrop-blur-md rounded-[2.5rem] p-6 shadow-sm"
            >
              {/* ITEM DESIGNATION NAME INPUT */}
              <div className="flex flex-col gap-1.5 group/field">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 transition-colors group-focus-within/field:text-blue-600">Item Designation</label>
                <div className="relative">
                  <input 
                    value={newItem.itemName} 
                    onChange={(e)=>setNewItem({...newItem, itemName: e.target.value})} 
                    className="w-full bg-white border border-slate-200 p-3.5 pr-12 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-sm text-slate-800 shadow-sm font-medium" 
                    placeholder={currentConfig.placeholder} 
                    required 
                  />
                  <button type="button" onClick={() => handleVoiceInput("itemName")} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 ${isListening === "itemName" ? "text-rose-500 animate-pulse" : "text-blue-500"}`}><FaMicrophone size={13}/></button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PRICE INPUT */}
                <div className="flex flex-col gap-1.5 group/field">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 transition-colors group-focus-within/field:text-purple-600">
                    {currentConfig.priceLabel}
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      value={newItem.price} 
                      onChange={(e)=>setNewItem({...newItem, price: e.target.value})} 
                      className="w-full bg-white border border-slate-200 p-3.5 pr-12 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 text-sm text-slate-800 shadow-sm font-medium" 
                      placeholder="0.00" 
                      required 
                    />
                    <button type="button" onClick={() => handleVoiceInput("price")} className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 ${isListening === "price" ? "text-rose-500 animate-pulse" : "text-purple-500"}`}><FaMicrophone size={13}/></button>
                  </div>
                </div>

                {/* DYNAMIC MEASUREMENT UNIT SELECT DROPDOWN */}
                <div className="flex flex-col gap-1.5 group/field">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 transition-colors group-focus-within/field:text-amber-500">Measurement Scale Unit</label>
                  <select 
                    value={newItem.unit}
                    onChange={(e)=>setNewItem({...newItem, unit: e.target.value})}
                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 text-sm text-slate-800 shadow-sm font-bold uppercase cursor-pointer"
                  >
                    {currentConfig.units.map((unitOpt) => (
                      <option key={unitOpt} value={unitOpt}>{unitOpt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border-b-[4px] border-blue-800 active:border-b-0 active:translate-y-[4px] shadow-sm flex items-center justify-center"
              >
                Confirm & Add to Stock 📦
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* --- 4. LIVE INVENTORY MANAGEMENT LIST --- */}
        <div className="flex flex-col gap-3">
          <div className="px-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {searchQuery ? `Search Results (${filteredItems.length})` : 'All Stock Assets'}
            </h2>
          </div>
          
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div 
                layout 
                key={item._id} 
                className={`group flex items-center justify-between p-4 px-5 rounded-2xl border transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.01)] ${item.isAvailable ? 'bg-white/70 border-slate-200/80 hover:border-blue-400 hover:shadow-md' : 'bg-slate-100/60 border-slate-200 opacity-60'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${item.isAvailable ? 'text-blue-600 border-blue-100 bg-blue-50' : 'text-slate-400 border-slate-200 bg-slate-50'}`}>
                    <FaBoxOpen size={15} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm tracking-tight transition-colors ${item.isAvailable ? 'text-slate-800 group-hover:text-blue-600' : 'text-slate-400 line-through'}`}>{item.itemName}</h3>
                    {/* DISPLAY DYNAMIC PRICING AND UNIT */}
                    <p className="font-black text-[11px] text-blue-600 font-mono">
                      ₹{formatPrice(item.price)} <span className="text-[9px] text-slate-400 lowercase font-sans">/ {item.unit || 'piece'}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleStatus(item._id, item.isAvailable)} 
                    className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all shadow-sm ${item.isAvailable ? 'text-emerald-600 border-emerald-200 bg-emerald-50 hover:bg-emerald-600 hover:text-white' : 'text-rose-500 border-rose-200 bg-rose-50 hover:bg-rose-600 hover:text-white'}`}
                  >
                    {item.isAvailable ? "In Stock" : "Out of Stock"}
                  </button>
                  <button onClick={() => setEditingItem(item)} className="p-2.5 bg-white text-slate-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-200 shadow-sm"><FaEdit size={13}/></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-white text-slate-400 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200 shadow-sm"><FaTrash size={13}/></button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-white/40 rounded-[2.5rem] border border-dashed border-slate-200">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em]">No items found in stock</p>
            </div>
          )}
        </div>
      </div>

      {/* --- EDIT MODAL ASSET MODAL --- */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 p-8 rounded-[2.5rem] w-full max-w-sm relative shadow-xl flex flex-col gap-4"
            >
              <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"><FaTimes /></button>
              
              <div className="mb-2 space-y-1">
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 italic">Update <span className="text-blue-600">Item</span></h2>
                <div className="h-1 w-10 bg-blue-600/30 rounded"></div>
              </div>

              <form onSubmit={handleUpdateItem} className="flex flex-col gap-4">
                {/* ITEM NAME EDIT */}
                <div className="relative group/modal">
                  <input 
                    value={editingItem.itemName} 
                    onChange={(e)=>setEditingItem({...editingItem, itemName: e.target.value})} 
                    className="w-full bg-white border border-slate-200 p-3.5 pr-12 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-sm text-slate-800 font-medium" 
                  />
                  <button type="button" onClick={() => handleVoiceInput("itemName")} className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${isListening === "itemName" ? "text-rose-500 animate-pulse" : "text-blue-500"}`}><FaMicrophone size={12} /></button>
                </div>
                
                {/* PRICE EDIT */}
                <div className="relative group/modal">
                  <input 
                    type="number"
                    value={editingItem.price} 
                    onChange={(e)=>setEditingItem({...editingItem, price: e.target.value})} 
                    className="w-full bg-white border border-slate-200 p-3.5 pr-12 rounded-xl outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 text-sm text-slate-800 font-medium" 
                  />
                  <button type="button" onClick={() => handleVoiceInput("price")} className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${isListening === "price" ? "text-rose-500 animate-pulse" : "text-purple-500"}`}><FaMicrophone size={12} /></button>
                </div>

                {/* MODAL EDIT DROPDOWN FOR UNIT */}
                <div className="flex flex-col gap-1">
                  <select 
                    value={editingItem.unit || currentConfig.defaultUnit}
                    onChange={(e)=>setEditingItem({...editingItem, unit: e.target.value})}
                    className="w-full bg-white border border-slate-200 p-3.5 rounded-xl outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/5 text-sm text-slate-800 font-bold uppercase cursor-pointer"
                  >
                    {currentConfig.units.map((unitOpt) => (
                      <option key={unitOpt} value={unitOpt}>{unitOpt}</option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all border-b-[4px] border-blue-800 active:border-b-0 active:translate-y-[4px] shadow-sm"
                >
                  Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}