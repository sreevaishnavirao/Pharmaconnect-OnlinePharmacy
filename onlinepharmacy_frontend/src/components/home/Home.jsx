import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { 
  ShieldCheck, 
  Truck, 
  Stethoscope,
  Quote,
  Mail,
  Phone,
  MapPin,
  Send
} from "lucide-react";

import HeroBanner from "./HeroBanner";
import { fetchProducts } from "../../store/actions";
import ProductCard from "../shared/ProductCard";
import Loader from "../shared/Loader";
import pharmacy1 from "../../assets/pharmacy1.png";

const Home = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const recommended = (products || []).slice(0, 6);
  const newArrivals = (products || []).slice(6, 12);

  const testimonials = [
    {
      name: "John Smith",
      role: "Regular Customer",
      text: "The prescription delivery service is phenomenal! I received my medications on the same day I ordered them. Highly recommended!",
      image: "https://i.pravatar.cc/150?u=john"
    },
    {
      name: "Sarah Johnson",
      role: "Premium Member",
      text: "As someone with chronic conditions, this pharmacy has made my life so much easier. The medication reminders are lifesavers!",
      image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Robert Williams",
      role: "New Customer",
      text: "The pharmacists are incredibly knowledgeable. They provided detailed and helpful information regarding my medications.",
      image: "https://i.pravatar.cc/150?u=robert"
    }
  ];

  return (
    <div className="lg:px-14 sm:px-8 px-4 bg-slate-50/30">
    
      <div className="pb-20">
        <div className="py-6">
          <HeroBanner />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-10 border-b border-slate-100">
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="p-3 bg-teal-100 rounded-2xl text-teal-600"><ShieldCheck size={28}/></div>
            <div>
              <h4 className="font-bold text-slate-800">100% Genuine</h4>
              <p className="text-xs text-slate-500 font-medium">Verified pharmaceutical sources</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><Truck size={28}/></div>
            <div>
              <h4 className="font-bold text-slate-800">Fast Delivery</h4>
              <p className="text-xs text-slate-500 font-medium">Home delivery within 24 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600"><Stethoscope size={28}/></div>
            <div>
              <h4 className="font-bold text-slate-800">Expert Advice</h4>
              <p className="text-xs text-slate-500 font-medium">Free consultations available</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : errorMessage ? (
          <div className="flex justify-center items-center h-[300px]">
            <FaExclamationTriangle className="text-rose-500 text-3xl mr-3" />
            <span className="text-slate-800 text-lg font-bold">{errorMessage}</span>
          </div>
        ) : (
          <>
            <section className="py-12">
              <div className="text-center space-y-3 mb-12">
                <h1 className="text-slate-800 text-4xl font-black tracking-tight">Recommended for You</h1>
                <p className="text-slate-500 max-w-xl mx-auto font-medium">Our pharmacists' top picks for your wellness.</p>
              </div>
              <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8">
                {recommended.map((item, i) => <ProductCard key={item?.productId ?? i} product={item} />)}
              </div>
            </section>

            <section className="py-12">
              <div className="flex items-end justify-between gap-4 mb-10">
                <div>
                  <h2 className="text-slate-800 text-3xl font-black tracking-tight">New Arrivals</h2>
                  <p className="text-slate-500 mt-1 font-medium">Freshly added medical supplies.</p>
                </div>
                <Link to="/products" className="group flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700">
                  View All <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
              <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 gap-8">
                {newArrivals.map((item, i) => <ProductCard key={item?.productId ?? `new-${i}`} product={item} />)}
              </div>
            </section>

            <section className="mt-16 relative rounded-[3rem] overflow-hidden p-1 shadow-2xl group">
              <div className="absolute inset-0 z-0">
                <img src={pharmacy1} alt="BG" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/50 to-teal-600/20 backdrop-blur-[1px]" />
              </div>
              <div className="relative z-10 grid md:grid-cols-2 min-h-[450px]">
                <div className="m-4 md:m-10 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-14 flex flex-col justify-center text-white">
                  <h3 className="text-4xl md:text-5xl font-black leading-tight">Save 20% on <span className="text-teal-300">Monthly Essentials</span></h3>
                  <p className="mt-6 text-lg text-white/90 max-w-sm leading-relaxed font-medium">Subscribe and save on regular medications.</p>
                  <Link to="/products" className="mt-10 inline-flex items-center justify-center rounded-2xl bg-white text-teal-900 font-black px-8 py-4 w-fit hover:bg-teal-50 transition-all">Subscribe Now</Link>
                </div>
              </div>
            </section>

            <section className="py-24 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="text-center mb-16 relative">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">What Our Customers Say</h2>
                <p className="text-slate-500 font-semibold mt-3 text-lg">Real stories from our family</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 relative">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="p-10 rounded-[2.5rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500">
                    <div>
                      <Quote className="text-teal-500/20 mb-6" size={48} />
                      <p className="text-slate-700 italic text-lg font-medium mb-8">"{t.text}"</p>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <img src={t.image} alt={t.name} className="w-12 h-12 rounded-xl object-cover border-2 border-white" />
                      <div>
                        <h5 className="font-black text-slate-800">{t.name}</h5>
                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{t.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <footer className="relative mt-10 rounded-t-[4rem] bg-[#1e2f2e] overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
       
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-teal-300/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-8 pt-24 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
      
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-white tracking-tighter">
                Pharma<span className="text-teal-300">Connect</span>
              </h2>
              <p className="text-teal-50/60 font-medium text-sm leading-relaxed max-w-xs">
                Empowering your health journey with verified pharmaceuticals and 24/7 expert care.
              </p>
              <div className="flex gap-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                  <a key={i} href="#" className="w-11 h-11 rounded-2xl bg-white/10 border border-white/5 flex items-center justify-center text-teal-300 hover:bg-teal-400 hover:text-[#1e2f2e] hover:scale-110 transition-all duration-300">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black text-lg uppercase tracking-widest">Explore</h4>
              <ul className="space-y-5">
               
                <li>
                  <Link to="/about" className="text-teal-50/60 hover:text-teal-300 font-bold text-sm transition-all flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-800 group-hover:bg-teal-300 transition-colors" />
                    About Us
                  </Link>
                </li>
                {['Health Resources', 'Our Services', 'Privacy Policy'].map(link => (
                  <li key={link}>
                    <Link to="/" className="text-teal-50/60 hover:text-teal-300 font-bold text-sm transition-all flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-800 group-hover:bg-teal-300 transition-colors" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black text-lg uppercase tracking-widest">Support</h4>
              <div className="space-y-5">
                <div className="flex items-center gap-4 text-teal-50/60 group">
                  <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform"><Phone size={18} /></div>
                  <span className="text-sm font-bold tracking-tight">+1 (123) 456-7890</span>
                </div>
                <div className="flex items-center gap-4 text-teal-50/60 group">
                  <div className="w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform"><Mail size={18} /></div>
                  <span className="text-sm font-bold tracking-tight">care@pharmaconnect.com</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-white font-black text-lg uppercase tracking-widest">Newsletter</h4>
              <p className="text-teal-50/60 font-medium text-sm">Join our medical community for verified updates.</p>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 flex focus-within:ring-2 focus-within:ring-teal-400/30 transition-all">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="w-full bg-transparent py-3 px-4 text-sm text-white placeholder-teal-50/30 focus:outline-none"
                />
                <button className="bg-teal-400 text-[#1e2f2e] rounded-xl px-4 flex items-center justify-center hover:bg-teal-300 transition-all active:scale-90">
                  <Send size={18} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-teal-50/40 text-[10px] font-black uppercase tracking-[0.3em]">
              © 2026 PharmaConnect • Secure Healthcare Partner
            </p>
            <div className="flex gap-10">
              {['Terms', 'Cookies', 'Sitemap'].map(item => (
                <Link key={item} to="/" className="text-teal-50/40 hover:text-teal-300 text-[10px] font-black uppercase tracking-widest transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;