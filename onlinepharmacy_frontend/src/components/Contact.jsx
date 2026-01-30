import React from "react";
import { FaEnvelope, FaMapMarkedAlt, FaPhone } from "react-icons/fa";
import { Send, MessageSquare, User, Mail } from "lucide-react";

import pharmacyBg from "../assets/pharmacyimage3.png"; 

const Contact = () => {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen py-20 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${pharmacyBg})` }}
        >
    
            <div className="absolute inset-0 bg-[#1e2f2e]/50 backdrop-blur-[1px]"></div>

            <div className="relative z-10 bg-white shadow-2xl rounded-[2.5rem] p-8 md:p-12 w-full max-w-xl border border-slate-100 mx-4">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl mb-6">
                        <MessageSquare size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-[#1e2f2e] tracking-tight mb-4">Get in Touch</h1>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Have questions? Our team is here to help you 24/7.
                    </p>
                </div>

                <form className="space-y-5">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#1e2f2e] ml-1">
                            <User size={14} className="text-teal-500" /> Full Name
                        </label>
                        <input 
                            type="text"
                            placeholder="Your Name"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#1e2f2e] ml-1">
                            <Mail size={14} className="text-teal-500" /> Email Address
                        </label>
                        <input 
                            type="email"
                            placeholder="Your email id"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-[#1e2f2e] ml-1">Message</label>
                        <textarea 
                            rows="4"
                            placeholder="How can we help?"
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none resize-none"
                        />
                    </div>

                    <button className="w-full bg-[#1e2f2e] text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-600 shadow-xl transition duration-300 flex items-center justify-center gap-3 active:scale-[0.98]">
                        Send Message <Send size={20} />
                    </button>
                </form>

                <div className="mt-12 pt-10 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <FaPhone className="text-teal-500 mb-2" />
                            <span className="text-xs font-bold text-[#1e2f2e]">+1(123)456 7890</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaEnvelope className="text-teal-500 mb-2" />
                            <span className="text-xs font-bold text-[#1e2f2e]">care@pharmaconnect</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaMapMarkedAlt className="text-teal-500 mb-2" />
                            <span className="text-xs font-bold text-[#1e2f2e]">123 Main, USA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;