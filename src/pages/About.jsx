import React from 'react';
import second_image_college from "../assets/second_image_college.jpeg";

const About = () => {
  const team = [
    { 
      name: "Zeeshan Ahmad", 
      role: "Database Architect", 
      desc: "Architected scalable MongoDB schemas and optimized data indexing for real-time shop tracking with robust AuthN/AuthZ.",
      img: second_image_college,
      neon: "hover:border-blue-500 hover:shadow-[0_20px_40px_rgba(37,99,235,0.15)]",
      accent: "text-blue-600",
      bgAccent: "bg-blue-600",
      glow: "bg-blue-500/5"
    },
    { 
      name: "Dushyant Kumar", 
      role: "Frontend Engineer", 
      desc: "Crafted high-fidelity responsive UI/UX with modern Neon aesthetics using React and Tailwind CSS 4.0.",
      img: "https://via.placeholder.com/400", 
      neon: "hover:border-purple-500 hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)]",
      accent: "text-purple-600",
      bgAccent: "bg-purple-600",
      glow: "bg-purple-500/5"
    },
    { 
      name: "Aditya Vashistha", 
      role: "API Specialist", 
      desc: "Engineered secure RESTful APIs and integrated Web Speech API for voice-driven rural accessibility.",
      img: "https://via.placeholder.com/400", 
      neon: "hover:border-emerald-500 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]",
      accent: "text-emerald-600",
      bgAccent: "bg-emerald-600",
      glow: "bg-emerald-500/5"
    }
  ];

  const techStack = [
    { name: "MERN", label: "FullStack", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", indicator: "bg-blue-600" },
    { name: "REST", label: "Architecture", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", indicator: "bg-purple-600" },
    { name: "RBAC", label: "Security", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", indicator: "bg-emerald-600" },
    { name: "VOICE", label: "AI-Interface", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", indicator: "bg-rose-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-slate-800 px-6 py-28 font-sans antialiased selection:bg-blue-500/20">
      <div className="max-w-6xl mx-auto space-y-28">
        
        {/* --- SECTION 1: HERO & VISION --- */}
        <section className="space-y-12">
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="px-4 py-1.5 rounded-full border border-slate-300 bg-white/80 shadow-sm text-slate-500 text-[9px] font-black tracking-[4px] uppercase">
              Project Documentation // 2026
            </div>
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
              Rural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">Shops Availability</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group p-10 bg-white/70 border border-white/60 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 backdrop-blur-md">
              <h2 className="text-lg font-black uppercase tracking-widest text-blue-600 mb-3 tracking-[2px]">01. The Challenge</h2>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                Rural populations often struggle with the lack of <span className="text-slate-900 font-bold">real-time connectivity</span>. Long journeys to local shops frequently result in disappointment due to unexpected closures or stock shortages.
              </p>
            </div>
            <div className="group p-10 bg-white/70 border border-white/60 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300 backdrop-blur-md border-l-emerald-500/40 border-l-4">
              <h2 className="text-lg font-black uppercase tracking-widest text-emerald-600 mb-3 tracking-[2px]">02. The Innovation</h2>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                We developed a <span className="text-slate-900 font-bold">Hyperlocal Live Tracking</span> system. By empowering shopkeepers with instant status toggles and users with voice-enabled search, we bridge the gap between rural supply and demand.
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: TECHNICAL ARCHITECTS --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-black italic uppercase tracking-[2px] text-slate-900">Project Leads</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div 
                key={i} 
                className={`group relative bg-white/70 border border-white/80 p-8 rounded-[2.5rem] shadow-[0_4px_15px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col items-center text-center overflow-hidden hover:-translate-y-2 backdrop-blur-md ${member.neon}`}
              >
                {/* Dynamic Glossy top bar indicator */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${member.bgAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* ✨ SHINE OVERLAY ON HOVER */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

                <div className="relative mb-6 z-20">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${member.glow}`}></div>
                  <div className="relative w-28 h-28 rounded-full border-2 border-white bg-slate-50 p-1 shadow-md transition-all duration-300 overflow-hidden group-hover:scale-105">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="relative z-20 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <h4 className={`text-xl font-black uppercase tracking-tight ${member.accent}`}>
                      {member.name}
                    </h4>
                    <p className="text-[9px] font-black uppercase tracking-[2.5px] text-slate-400">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-slate-600 text-xs font-bold leading-relaxed px-1 italic">
                    "{member.desc}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3: TECHNICAL CORE (Tech Stack) --- */}
        <section className="space-y-10">
          <div className="flex flex-col items-start gap-1 border-l-4 border-slate-300 pl-5">
             <span className="text-[9px] font-black uppercase tracking-[5px] text-slate-400 font-mono">./infrastructure/stack</span>
             <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">System Core</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {techStack.map((tech, i) => (
              <div 
                key={i} 
                className={`relative group p-6 rounded-2xl border ${tech.border} ${tech.bg} shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md overflow-hidden`}
              >
                <div className="relative z-10 flex flex-col items-start space-y-3 font-mono text-left">
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-400 font-black uppercase tracking-wider shadow-sm">
                    {tech.label}
                  </span>
                  <h3 className={`text-2xl font-black tracking-tight ${tech.color}`}>
                    {tech.name}
                  </h3>
                  <div className="flex gap-1 items-center">
                    <div className={`w-2 h-2 rounded-full ${tech.indicator} animate-pulse`}></div>
                    <div className="w-10 h-1.5 rounded-full bg-slate-300/40"></div>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 w-full h-1 ${tech.indicator} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center pb-6 border-t border-slate-300/60 pt-8">
          <p className="text-[9px] font-black uppercase tracking-[12px] text-slate-400">
            Internal Documentation // GAON KEE DUKAAN // 2026
          </p>
        </footer>

      </div>
    </div>
  );
};

export default About;