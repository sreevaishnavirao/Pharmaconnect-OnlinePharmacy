import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  CheckCircle2, 
  Stethoscope,
  Globe,
  ShieldCheck,
  Zap
} from "lucide-react";
import pharmacyImg1 from "../../assets/pharmacy1.png";
import pharmacyImg2 from "../../assets/pharamacyimage2.jpg"; 

const AboutUs = () => {
  const stats = [
    { label: "Happy Patients", value: "50k+", icon: <Users size={20} /> },
    { label: "Verified Products", value: "10k+", icon: <CheckCircle2 size={20} /> },
    { label: "Expert Doctors", value: "100+", icon: <Stethoscope size={20} /> },
    { label: "Cities Reached", value: "25+", icon: <Globe size={20} /> },
  ];

  return (
    <div className="bg-slate-50/30 min-h-screen pb-20">
     
      <section className="relative pt-20 pb-32 lg:px-14 sm:px-8 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-teal-50 to-transparent -z-10" />
        
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
            <Zap size={14} className="fill-current" /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Your Health, <span className="text-teal-500">Our Priority.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            PharmaConnect is a modern healthcare platform built to provide seamless access 
            to verified medications.
          </p>
        </div>
      </section>

      
      <section className="lg:px-14 sm:px-8 px-4 -mt-20">
        <div className="max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden bg-[#1e2f2e] shadow-2xl">
          
         
          <div className="absolute inset-0 opacity-95">
            <img 
              src={pharmacyImg2} 
              alt="Pharmacy Background" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-[#1e2f2e]/80" />
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 items-center gap-12 p-8 md:p-20">
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-white leading-tight">
                Bridging the gap between <br />
                <span className="text-teal-300">Care and Convenience</span>
              </h2>
              <p className="text-teal-50/70 text-lg font-medium leading-relaxed">
                Founded with a mission to simplify pharmaceutical access, we combine 
                cutting-edge technology with the human touch of expert pharmacists 
                to ensure you receive 100% genuine products.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:bg-white/10">
                    <div className="text-teal-400 mb-2">{stat.icon}</div>
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-xs text-teal-100/50 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-teal-400/20 rounded-[3rem] blur-2xl group-hover:bg-teal-400/30 transition-all duration-700" />
              
            
              <img 
                src={pharmacyImg1} 
                alt="Pharmacist" 
                className="relative rounded-[2.5rem] border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02] w-full h-[400px] object-cover" 
              />
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-32 lg:px-14 sm:px-8 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Our Core Values</h2>
          <div className="h-1.5 w-24 bg-teal-500 mx-auto rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Reliability",
              desc: "Every product is sourced from verified pharmaceutical manufacturers with 100% authenticity guaranteed.",
              icon: <ShieldCheck className="text-teal-500" size={32} />,
              bg: "bg-teal-50"
            },
            {
              title: "Expertise",
              desc: "Our team consists of licensed professionals ready to provide free consultations and medical guidance.",
              icon: <Stethoscope className="text-blue-500" size={32} />,
              bg: "bg-blue-50"
            },
            {
              title: "Efficiency",
              desc: "With a 24-hour home delivery commitment, we ensure your health journey is never delayed.",
              icon: <Zap className="text-purple-500" size={32} />,
              bg: "bg-purple-50"
            }
          ].map((value, idx) => (
            <div key={idx} className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:-translate-y-2">
              <div className={`w-16 h-16 ${value.bg} rounded-2xl flex items-center justify-center mb-8`}>
                {value.icon}
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-4">{value.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="lg:px-14 sm:px-8 px-4">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-teal-600 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 relative z-10">
            Let's take care of your <br /> health together.
          </h2>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link to="/products" className="bg-white text-teal-700 px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-teal-50 transition-all active:scale-95">
              Explore Products
            </Link>
            <Link to="/contact" className="bg-teal-800/30 text-white border border-white/20 px-10 py-5 rounded-2xl font-black text-lg backdrop-blur-md hover:bg-teal-800/50 transition-all">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;