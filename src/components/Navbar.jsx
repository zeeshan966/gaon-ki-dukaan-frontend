import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const pathParts = location.pathname.split('/');
  const isShopDetailPage = pathParts[1] === 'shop' && pathParts[2];
  const currentShopId = pathParts[2];

  const handleLogout = () => {
    localStorage.clear();
    console.log("Session terminated. User logged out.");
    navigate('/login');
  };

  // --- THE MODERN SOLID 3D WHITE-CONTEXT BUTTON STYLE ---
  // Mobile par elements balanced rahein isliye px aur gap ko optimize kiya gaya hai
  const heavyBtn = `
    relative group overflow-hidden 
    px-2 py-1.5 md:px-5 md:py-2.5 
    rounded-xl font-black uppercase 
    text-[9px] md:text-[11px] tracking-[0.8px] md:tracking-[1.5px] 
    transition-all duration-300 ease-out
    flex items-center gap-1 md:gap-2 
    border-b-[4px] active:border-b-0 active:translate-y-[4px]
    hover:-translate-y-0.5 hover:scale-102
    transform-gpu
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/30 before:to-white/0 
    before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000
  `;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/75 backdrop-blur-md border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-3 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* --- LOGO WITH GLOSSY BLUE REFLECTION --- */}
        <Link to="/" className="relative flex flex-col group shrink-0">
          <div className="absolute -inset-2 bg-blue-500/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <span className="relative text-lg md:text-2xl font-black italic tracking-tighter text-slate-900 group-hover:text-blue-600 transition-all duration-300">
            GAON<span className="text-blue-600 group-hover:text-slate-900">DUKAAN</span>
          </span>
          <span className="text-[6px] md:text-[9px] font-black text-slate-400 tracking-[2px] md:tracking-[3px] -mt-0.5 group-hover:text-blue-500 transition-all duration-300">
            STATUS HUB
          </span>
        </Link>

        {/* --- NAVIGATION LINKS CONTAINER --- */}
        <div className="flex items-center gap-1.5 md:gap-4">
          
          {/* 🏠 HOME */}
          <Link to="/" className={`${heavyBtn} bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200/80 hover:border-blue-500 hover:text-blue-600`}>
            <span className="relative z-10 flex items-center gap-1 font-black">
               <span>Home</span> <span className="text-xs">🏠</span>
            </span>
          </Link>

          {/* ℹ️ ABOUT US */}
          <Link to="/about" className={`${heavyBtn} bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200/80 hover:border-purple-500 hover:text-purple-600`}>
            <span className="relative z-10 flex items-center gap-1 font-black">
               <span>About</span> <span className="text-xs">ℹ️</span>
            </span>
          </Link>

          {/* --- LOGGED IN USER INTERFACES --- */}
          {token && (
            <div className="flex items-center gap-1.5 md:gap-4">
              
              {/* 🟢 MANAGE STOCK */}
              {user?.role?.toLowerCase() === 'shopkeeper' && isShopDetailPage && (
                <Link 
                  to={`/inventory/${currentShopId}`} 
                  className={`${heavyBtn} bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500 hover:border-emerald-600 shadow-sm`}
                >
                  <span className="relative z-10 font-black flex items-center gap-1">
                    <span>Stocks</span> 📦
                  </span>
                </Link>
              )}

              {/* 🔵 MY SHOP (DASHBOARD) */}
              {user?.role?.toLowerCase() === 'shopkeeper' && !isShopDetailPage && (
                <Link to="/dashboard" className={`${heavyBtn} bg-blue-600 text-white border-blue-800 hover:bg-blue-500 hover:border-blue-600 shadow-sm`}>
                  <span className="relative z-10 font-black flex items-center gap-1">
                    <span>My Shop</span> 24
                  </span>
                </Link>
              )}

              {/* 🟣 ADMIN ACCESS */}
              {user?.role?.toLowerCase() === 'admin' && (
                <Link to="/add-shop" className={`${heavyBtn} bg-blue-600 text-white border-blue-800 hover:bg-blue-500 hover:border-blue-600 shadow-sm`}>
                  <span className="relative z-10 font-black flex items-center gap-1">
                    <span>+ Add</span> ✨
                  </span>
                </Link>
              )}
              
              {/* 🔴 LOGOUT */}
              <button onClick={handleLogout} className={`${heavyBtn} bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-700`}>
                <span className="relative z-10 font-black flex items-center gap-1">
                  <span>Logout</span> 🚪
                </span>
              </button>
            </div>
          )}

          {/* --- 🔑 DUAL ACCESS CHANNELS (LOGGED OUT STATE) --- */}
          {!token && (
            <div className="flex items-center gap-1.5 md:gap-3">
              {/* ADMIN ENTRY BUTTON */}
              <button 
                onClick={() => navigate('/login', { state: { targetRole: 'admin' } })}
                className={`${heavyBtn} bg-blue-600 text-white border-blue-800 hover:bg-blue-500 hover:border-blue-600 shadow-sm`}
              >
                <span className="relative z-10 flex items-center gap-1 font-black">
                  <span>Admin</span> 🔐
                </span>
              </button>
              
              {/* SHOPKEEPER ENTRY BUTTON */}
              <button 
                onClick={() => navigate('/login', { state: { targetRole: 'shopkeeper' } })}
                className={`${heavyBtn} bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200/80 hover:border-blue-500 hover:text-blue-600 shadow-sm`}
              >
                <span className="relative z-10 flex items-center gap-1 font-black">
                  <span>Shopkeeper</span> ⚡
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}