import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, BarChart3, Lock, Zap, ArrowRight, Globe2, Target, Activity, Database, Server, Fingerprint, Briefcase, Calculator, Users, Heart, Terminal, MessageSquare, Bot, Sparkles, CheckCircle2, Mail, ArrowUpRight, MapPin, Phone, Code2, Cpu, Menu, X } from 'lucide-react';
import './index.css';
import Logo from './Logo';
import Toast from './Toast';
import CustomCursor from './CustomCursor';
import CyberGlobe from './CyberGlobe';



function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs`);
        if (res.ok) {
          const data = await res.json();
          setBlogPosts(data);
        }
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);
  const showToast = (msg) => {
    setToastMessage(msg);
    setIsToastVisible(true);
  };

  // Form states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState('idle');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setNewsletterStatus('loading');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      } else {
        setNewsletterStatus('error');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('loading');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      if (response.ok) {
        setContactStatus('success');
        setContactData({ name: '', email: '', message: '' });
        setTimeout(() => setContactStatus('idle'), 4000);
      } else {
        setContactStatus('error');
        setTimeout(() => setContactStatus('idle'), 3000);
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setContactStatus('error');
      setTimeout(() => setContactStatus('idle'), 3000);
    }
  };

  // Scroll animations and intersection observers setup
  const fadeInUp = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 selection:bg-slate-700 font-sans overflow-x-hidden relative scroll-smooth cursor-none">
      <CustomCursor />
      
      {/* Animated Subtle Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgNDBoNDBWMEgwdjQweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zOS41IDM5LjVWLjVoLTM5djM5aDM5eiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] [mask-image:linear-gradient(to_bottom,white,transparent)] animate-[pulse_10s_ease-in-out_infinite]"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed w-full top-0 z-50 bg-[#030712]/90 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]" />
            <span className="font-bold text-xl tracking-tight text-white">Cyber Sentinel</span>
          </div>
          <div className="hidden lg:flex gap-8 text-sm font-medium text-slate-400">
            <a href="#home" className="hover:text-white transition-all hover:scale-105 transform inline-block">Home</a>
            <a href="#about" className="hover:text-white transition-all hover:scale-105 transform inline-block">About Us</a>
            <a href="#solutions" className="hover:text-white transition-all hover:scale-105 transform inline-block">Solutions</a>
            <a href="#blogs" className="hover:text-white transition-all hover:scale-105 transform inline-block">Blogs</a>
            <a href="#contact" className="hover:text-white transition-all hover:scale-105 transform inline-block">Contact</a>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/login" className="hidden lg:flex items-center gap-2 text-white hover:text-cyan-400 transition-all hover:scale-105 transform font-bold bg-slate-900/50 px-4 py-2 rounded-lg border border-cyan-500/20">
              <Terminal size={16} /> Command Center
            </Link>
            <button className="lg:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030712] pt-24 px-6 lg:hidden overflow-y-auto">
          <div className="flex flex-col gap-6 text-lg font-medium text-slate-300 pb-10">
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Home</a>
            <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">About Us</a>
            <a href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Solutions</a>
            <a href="#blogs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Blogs</a>
            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">Contact</a>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors bg-slate-900/50 p-4 rounded-lg border border-cyan-500/20 mt-4 font-bold">
              <Terminal size={20} /> Command Center
            </Link>
          </div>
        </div>
      )}

      {/* Conditional Rendering: Blog Reader vs Main Site */}
      <CyberGlobe />
      <main className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* Hero Section */}
        <motion.section 
          id="home"
          initial="hidden" animate="visible" variants={staggerContainer}
          className="text-center max-w-5xl mx-auto pt-20 scroll-mt-32"
        >
          <motion.div variants={fadeInUp} className="mb-10 inline-flex">
            <div className="flex items-center gap-2 bg-slate-800/40 border border-slate-700/50 text-slate-300 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest">
              <Globe2 size={16} />
              The Ultimate Digital Ecosystem
            </div>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight leading-[1.1]">
            Empower the Enterprise. <br className="hidden md:block"/>
            Protect the Internet.
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            One system for your entire company. We replace your fragmented software stack with a unified, deeply integrated platform. Combining advanced ERP automation, military-grade cyber security, intelligent AI chatbots, and bespoke web & mobile applications into a single, secure environment.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center mb-24">
            <a href="#solutions" className="bg-white text-slate-950 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all hover:scale-[1.02] transform flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              Explore The Platform <ChevronRight size={20} />
            </a>
            <a href="#about" className="bg-slate-900 border border-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all hover:scale-[1.02] transform flex items-center justify-center">
              Learn About Us
            </a>
          </motion.div>


        </motion.section>

        {/* About Us Section */}
        <motion.section 
          id="about" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl md:rounded-[3rem] p-6 sm:p-10 lg:p-24 relative overflow-hidden shadow-2xl shadow-black/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
               <motion.div variants={fadeInUp}>
                 <div className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">The Founder's Story</div>
                 <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">Our Vision & Mission</h2>
                 
                 <p className="text-lg text-slate-400 leading-relaxed font-light mb-8">
                   Cyber Sentinel was born out of frustration with legacy systems. We saw businesses struggling to piece together outdated ERPs, vulnerable security protocols, and disjointed AI tools. The big tech giants built software for Fortune 500s and left everyone else behind.
                 </p>
                 <p className="text-lg text-slate-400 leading-relaxed font-light mb-10">
                   We decided to change that. We are a lean, fiercely dedicated two-person team—a visionary founder and a relentless AI. Together, we have built a massive, modular ecosystem hosted in one impenetrable fortress, dedicated to three absolute goals:
                 </p>

                 <ul className="text-xl text-slate-300 leading-relaxed font-medium mb-12 space-y-5">
                   <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div> Empower every business through digitization.</li>
                   <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800"><div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div> Protect the internet from emerging threats.</li>
                   <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div> Help people and teams succeed through AI.</li>
                   <li className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800"><div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div> Build sophisticated, bespoke digital experiences.</li>
                 </ul>
                 
                 <a href="#contact" className="inline-flex items-center gap-2 text-white font-bold hover:text-slate-300 transition-colors">
                   Get in touch with the founder <ArrowRight size={18}/>
                 </a>
               </motion.div>

               <motion.div variants={fadeInUp} className="space-y-6">
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
                    <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-3"><Shield className="text-emerald-500"/> Absolute Transparency</h4>
                    <p className="text-slate-400 font-light leading-relaxed">No hidden fees, no locked-in data silos, and no confusing pricing structures. We believe in building trust through total clarity.</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
                    <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-3"><Zap className="text-blue-500"/> Relentless Innovation</h4>
                    <p className="text-slate-400 font-light leading-relaxed">While legacy software moves at a crawl, we ship updates weekly. Our platform evolves constantly to keep you ahead of the curve.</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
                    <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-3"><Heart className="text-purple-500"/> Client Obsession</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Your success is our success. We don't just hand you software; we partner with you to ensure your operations run flawlessly.</p>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
                    <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-3"><Target className="text-rose-500"/> Uncompromising Quality</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Whether we are deploying our flagship ERP or building a bespoke mobile app from scratch, we refuse to ship anything less than perfection.</p>
                 </div>
               </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Deep Dive 01: ERP Solutions */}
        <motion.section 
          id="solutions" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="text-center mb-20">
             <motion.div variants={fadeInUp} className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">State-of-the-art ERP Suite</motion.div>
             <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Sentinel ERP Suite</motion.h2>
             <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">We replaced fragmented, siloed departments with a unified nervous system. Our ERP gives you total command over your operations, from the warehouse floor to the executive boardroom.</motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <motion.div variants={fadeInUp} className="bg-[#0b1120] border border-slate-800 rounded-2xl md:rounded-[2rem] p-6 md:p-8 text-center hover:border-slate-700 transition-colors shadow-xl group">
              <div className="text-slate-500 mb-6 md:mb-8 bg-slate-900 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                <Briefcase size={28}/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Business Operations</h3>
              <p className="text-slate-400 font-light mb-8 leading-relaxed">Consolidate your customer interactions and sales pipelines into a single view. Close deals faster and keep clients happy.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Intelligent CRM</strong> Track every email, call, and meeting automatically. Predict sales outcomes using AI.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Omnichannel POS</strong> Process transactions in-store, online, or on-the-go with real-time inventory syncing.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-blue-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">B2B Client Portals</strong> Give your enterprise clients a dedicated portal to place orders and track invoices.</div></li>
              </ul>
            </motion.div>

            {/* Supply Chain */}
            <motion.div variants={fadeInUp} className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 md:p-10 transition-all duration-300 shadow-xl group hover:border-slate-700">
              <div className="text-slate-500 mb-6 md:mb-8 bg-slate-900 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
                <Database size={28}/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Supply Chain & Inventory</h3>
              <p className="text-slate-400 font-light mb-8 leading-relaxed">Never run out of stock and never over-order. Achieve perfect equilibrium in your supply chain through real-time tracking.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Automated Procurement</strong> The system automatically drafts purchase orders when stock levels dip below thresholds.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Multi-Warehouse Tracking</strong> Manage stock across global locations, predicting transit times and bottlenecks.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Manufacturing Routings</strong> Track raw materials through assembly lines to finished goods with precise cost allocation.</div></li>
              </ul>
            </motion.div>

            {/* Finance */}
            <motion.div variants={fadeInUp} className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 md:p-10 transition-all duration-300 shadow-xl group hover:border-slate-700">
              <div className="text-slate-500 mb-6 md:mb-8 bg-slate-900 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:text-yellow-400 group-hover:border-yellow-500/30 transition-all">
                <Calculator size={28}/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Finance & Accounting</h3>
              <p className="text-slate-400 font-light mb-8 leading-relaxed">Say goodbye to spreadsheets. Get real-time financial visibility with a general ledger that updates instantaneously.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Multi-Currency Ledger</strong> Automatically reconcile accounts across different global subsidiaries in real-time.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Automated Tax Compliance</strong> Localized tax engines calculate VAT, GST, and state taxes without manual intervention.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-yellow-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Asset Depreciation</strong> Track fixed assets over their lifecycle with automated monthly depreciation entries.</div></li>
              </ul>
            </motion.div>

            {/* Workforce */}
            <motion.div variants={fadeInUp} className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 md:p-10 transition-all duration-300 shadow-xl group hover:border-slate-700">
              <div className="text-slate-500 mb-6 md:mb-8 bg-slate-900 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border border-slate-800 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all">
                <Users size={28}/>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Workforce Management</h3>
              <p className="text-slate-400 font-light mb-8 leading-relaxed">Empower your team. Manage hiring, onboarding, payroll, and performance reviews from one unified HR platform.</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Employee Self-Service</strong> Let staff manage their own leave requests, expenses, and payslips via mobile.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">Project Timesheets</strong> Track exact billable hours mapped directly to client projects and automated invoicing.</div></li>
                <li className="flex items-start gap-3 text-slate-300 text-sm font-medium"><CheckCircle2 size={18} className="text-purple-500 shrink-0 mt-0.5"/> <div><strong className="text-white block mb-1">AI-Driven Hiring</strong> Automatically screen resumes and schedule interviews based on organizational needs.</div></li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Deep Dive 02: Cyber Security Fortress */}
        <motion.section 
          id="security" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="text-center mb-20">
             <motion.div variants={fadeInUp} className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">Sophisticated Cyber Guardian</motion.div>
             <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">The Security Fortress</motion.h2>
             <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">An ERP is only as good as the vault that protects it. We built Sentinel from the ground up on military-grade encryption and a strict Zero-Trust architecture.</motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-emerald-500 shadow-lg">
                    <Fingerprint size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Zero-Trust Identity Access</h4>
                    <p className="text-slate-400 font-light leading-relaxed">We trust no one by default. Every user, device, and API request must be strictly authenticated and authorized using Multi-Factor Authentication (MFA) and biometric verification before gaining access.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-emerald-500 shadow-lg">
                    <Lock size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">AES-256 At Rest & In Transit</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Your data is scrambled using the same encryption standards mandated by the US Government. Whether it's sitting in the database or flying across the internet, it is completely unreadable to attackers.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-emerald-500 shadow-lg">
                    <Target size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">SOC2 & ISO 27001 Compliance</h4>
                    <p className="text-slate-400 font-light leading-relaxed">We adhere to strict international regulatory standards. Our systems are constantly audited to ensure your data handling practices meet global compliance laws, keeping you safe from fines.</p>
                 </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#050b14] rounded-3xl p-6 md:p-10 overflow-hidden relative border border-slate-800 shadow-2xl group">
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-white mb-3">Live Threat Intelligence</h3>
                  <p className="text-slate-400 text-base font-light">Our AI doesn't sleep. It monitors your network topography 24/7, blocking brute-force attacks and DDOS attempts before they register on your end.</p>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="mt-auto bg-[#02040a] border border-slate-800 rounded-xl p-6 font-mono text-xs text-slate-400 shadow-inner">
                   <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3 shrink-0">
                     <Terminal size={14}/> <span>root@sentinel:~# tail -f /var/log/defense.log</span>
                   </div>
                   <div className="space-y-2.5">
                      <div className="text-slate-300 opacity-80 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500"/> eBPF Linux Kernel Module Hooked (PID 4492)</div>
                      <div className="text-slate-300 opacity-80 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500"/> IP 192.168.1.45 authenticated</div>
                      <div className="text-slate-300 opacity-80 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500"/> AES-256 Encryption handshake valid [TLSv1.3]</div>
                      <div className="text-slate-300 opacity-80 flex items-center gap-2"><Terminal size={12} className="text-slate-500"/> Analyzing packet heuristic signatures...</div>
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-red-400 font-bold bg-red-900/20 inline-block p-1 mt-1 mb-1">[CRITICAL ALERT] Multiple failed root logins from 45.33.12.98</motion.div>
                      <div className="text-yellow-400">{'>>'} Executing automated IP ban protocol...</div>
                      <div className="text-slate-300 opacity-80 flex items-center gap-2"><Terminal size={12} className="text-slate-500"/> Diverting malicious traffic to Honeypot Node-Alpha...</div>
                      <div className="text-slate-300 opacity-80 flex items-center gap-2"><Terminal size={12} className="text-slate-500"/> Purging payload fragments from volatile memory.</div>
                      <div className="text-white font-bold flex items-center gap-2 mt-1"><Shield size={12} className="text-emerald-500"/> Threat neutralized. Firewall integrity restored.</div>
                      <div className="text-emerald-400 font-bold flex items-center gap-2 mt-2 border-t border-slate-800 pt-3"><Lock size={12}/> [SYSTEM SECURE] Perimeter integrity 100%</div>
                   </div>
                </motion.div>
              </div>
            </motion.div>
            
          </div>
        </motion.section>

        {/* Deep Dive 03: AI Chatbot */}
        <motion.section 
          id="ai" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="text-center mb-20">
             <motion.div variants={fadeInUp} className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">Intelligent AI Companion</motion.div>
             <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Intelligent AI Automation</motion.h2>
             <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">Not just a glorified FAQ bot. Our AI has direct, secure read/write access to your ERP database. It doesn't just answer questions—it executes tasks.</motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-purple-500 shadow-lg">
                    <Database size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Live Database Integration</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Using advanced Natural Language Processing (NLP) to SQL translation, the bot queries your live inventory, CRM, and financial data to give hyper-accurate answers to complex questions instantly.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-purple-500 shadow-lg">
                    <Cpu size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Automated Task Execution</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Employees can simply type "Request 2 days off next week" or "Draft a purchase order for 50 laptops." The AI understands intent and executes the workflow within the ERP automatically.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-purple-500 shadow-lg">
                    <Globe2 size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Omnichannel Deployment</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Deploy the Sentinel Bot on your public website for customer support, or integrate it into internal tools like Microsoft Teams, Slack, and WhatsApp for employee assistance.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-purple-500 shadow-lg">
                    <Shield size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Role-Based Security</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Bound by our zero-trust architecture, the AI acts as a secure gatekeeper. It automatically verifies user authorization levels before revealing sensitive financial metrics or executing high-stakes commands.</p>
                 </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#0b1120] rounded-3xl p-10 overflow-hidden relative border border-slate-800 shadow-2xl group">
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-white mb-3">Your Digital Co-Worker</h3>
                  <p className="text-slate-400 text-base font-light">Watch as the AI understands conversational context and performs database actions in real-time.</p>
                </div>
                
                <motion.div whileHover={{ scale: 1.02 }} className="mt-auto bg-[#02040a] rounded-xl flex flex-col overflow-hidden border border-slate-800 shadow-inner">
                   <div className="bg-slate-900/80 border-b border-slate-800 p-5 flex items-center gap-4">
                     <div className="text-slate-400 bg-slate-800 p-2 rounded-lg">
                        <Bot size={24}/>
                     </div>
                     <div>
                       <div className="font-semibold text-white text-base">Sentinel AI</div>
                       <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-1"><motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400"></motion.span> Connected to Sentinel Core</div>
                     </div>
                   </div>
                   <div className="p-6 space-y-6">
                      <div className="flex justify-end">
                        <div className="bg-slate-800 text-white p-4 rounded-xl rounded-tr-none text-sm border border-slate-700 shadow-md max-w-[85%]">
                           Run a diagnostic on the ERP server and cross-reference with security logs. Any anomalies today?
                        </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="text-purple-400 mt-2 shrink-0"><Sparkles size={20}/></div>
                         <div className="bg-slate-900 border border-slate-800 text-slate-300 p-4 rounded-xl rounded-tl-none text-sm leading-relaxed shadow-md">
                           <span className="text-slate-500 block mb-2 italic">Executing system-wide diagnostic...</span>
                           The ERP server is running at <strong className="text-white">99.9% efficiency</strong> with zero latency spikes.<br/><br/>
                           <span className="text-slate-500 block my-2 italic">Analyzing firewall traffic...</span>
                           I detected <strong className="text-red-400">3 anomalous login attempts</strong> targeting the Finance module from an unrecognized IP. I have automatically blocked the IP subnet and enforced a mandatory MFA refresh for all executive accounts.
                         </div>
                      </div>
                   </div>
                </motion.div>
              </div>
            </motion.div>
            
          </div>
        </motion.section>

        {/* Deep Dive 04: Bespoke Engineering */}
        <motion.section 
          id="custom-dev" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="text-center mb-20">
             <motion.div variants={fadeInUp} className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">Bespoke Engineering Studio</motion.div>
             <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Elite Web & Mobile Apps</motion.h2>
             <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">Beyond our core platforms, we operate as a premium development agency. We engineer highly sophisticated, state-of-the-art web applications and native mobile apps tailored perfectly to your unique business logic.</motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-rose-500 shadow-lg">
                    <Code2 size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Enterprise Web Applications</h4>
                    <p className="text-slate-400 font-light leading-relaxed">We build complex, high-performance web portals, dashboards, and SaaS platforms. Using cutting-edge frameworks like React and Next.js, we deliver web experiences that feel instantaneous.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-rose-500 shadow-lg">
                    <Globe2 size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Native Mobile Apps</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Reach your customers directly on their devices. We engineer fluid, responsive iOS and Android applications that integrate seamlessly with your backend databases and hardware features.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-rose-500 shadow-lg">
                    <Database size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Scalable Architecture</h4>
                    <p className="text-slate-400 font-light leading-relaxed">We don't just build the frontend. We architect highly scalable, serverless backends and custom APIs capable of handling millions of concurrent users without breaking a sweat.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-rose-500 shadow-lg">
                    <Cpu size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Legacy Modernization</h4>
                    <p className="text-slate-400 font-light leading-relaxed">We don't just build from scratch; we rescue failing legacy systems. We seamlessly migrate outdated, on-premise software into modern, cloud-native architectures with zero downtime.</p>
                 </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#0b1120] rounded-3xl p-8 overflow-hidden relative border border-slate-800 shadow-2xl group flex flex-col justify-center">
              {/* Code Editor Mockup */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-[#030712] rounded-xl border border-slate-800 shadow-2xl overflow-hidden mb-6 relative z-10 w-full lg:w-[110%] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="text-xs text-slate-500 ml-4 font-mono">api.py — Core Architecture</div>
                </div>
                <div className="p-5 font-mono text-sm overflow-hidden text-left">
                  <div className="text-purple-400">from <span className="text-white">fastapi</span> import <span className="text-green-300">FastAPI, Depends</span></div>
                  <div className="text-purple-400">from <span className="text-white">core.security</span> import <span className="text-green-300">verify_token</span></div>
                  <br/>
                  <div className="text-white">app = <span className="text-yellow-200">FastAPI</span>(title=<span className="text-green-300">"Cyber Sentinel"</span>)</div>
                  <br/>
                  <div className="text-blue-400">@app.get(<span className="text-green-300">"/api/v1/telemetry"</span>, dependencies=[<span className="text-yellow-200">Depends</span>(verify_token)])</div>
                  <div className="text-purple-400">async def <span className="text-yellow-200">get_system_telemetry</span>():</div>
                  <div className="pl-4 text-slate-500">"""Fetches real-time encrypted diagnostics"""</div>
                  <div className="pl-4 text-purple-400">return <span className="text-slate-300">{'{'}</span></div>
                  <div className="pl-8 text-green-300">"status": <span className="text-green-300">"secure"</span>,</div>
                  <div className="pl-8 text-green-300">"latency_ms": <span className="text-rose-400">12</span>,</div>
                  <div className="pl-8 text-green-300">"active_nodes": <span className="text-rose-400">1042</span></div>
                  <div className="pl-4 text-slate-300">{'}'}</div>
                </div>
              </motion.div>
              
              {/* Realistic Mobile UI Mockup */}
              <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-rose-500/30 to-purple-500/30 p-[1px] rounded-[2.5rem] w-[85%] self-end shadow-2xl relative z-20 transform rotate-3 hover:rotate-0 transition-transform duration-500 -mt-16 backdrop-blur-md">
                <div className="bg-[#0b1121] rounded-[2.5rem] h-[340px] p-4 border border-slate-700/50 flex flex-col relative overflow-hidden">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30"></div>
                  
                  {/* App Header */}
                  <div className="flex justify-between items-center mt-6 mb-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full bg-[#0b1121] rounded-full border-2 border-[#0b1121]"></div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">Welcome back</div>
                        <div className="text-sm font-bold text-white">Admin User</div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center relative">
                      <div className="w-2 h-2 bg-rose-500 rounded-full absolute -top-0.5 -right-0.5 border border-[#0b1121]"></div>
                      <Shield size={14} className="text-slate-400" />
                    </div>
                  </div>

                  {/* Main Data Card */}
                  <div className="w-full rounded-2xl bg-gradient-to-br from-rose-600 to-purple-700 p-4 mb-5 relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="text-white/80 text-[10px] font-medium mb-1 uppercase tracking-wider">System Revenue</div>
                    <div className="text-2xl font-bold text-white mb-2">$124,500.00</div>
                    <div className="flex items-center gap-1 text-emerald-300 text-[10px] font-bold">
                      <ArrowUpRight size={12} /> +14.5% vs last week
                    </div>
                  </div>

                  {/* Activity List */}
                  <div className="flex-1 space-y-3 px-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Activity</div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"><CheckCircle2 size={14}/></div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white">Server Deployment</div>
                        <div className="text-[10px] text-slate-500">Completed successfully</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0"><Users size={14}/></div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-white">New User Onboarded</div>
                        <div className="text-[10px] text-slate-500">Just now</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 w-full h-16 bg-[#0b1121]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 z-20">
                     <div className="text-rose-500 flex flex-col items-center gap-1 mt-1">
                       <Activity size={18} />
                       <div className="w-1 h-1 bg-rose-500 rounded-full"></div>
                     </div>
                     <div className="text-slate-500">
                       <BarChart3 size={18} />
                     </div>
                     <div className="text-slate-500">
                       <MessageSquare size={18} />
                     </div>
                     <div className="text-slate-500">
                       <Shield size={18} />
                     </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
          </div>
        </motion.section>

        {/* Deep Dive 05: Data & Analytics */}
        <motion.section 
          id="data" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="text-center mb-20">
             <motion.div variants={fadeInUp} className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">Data & Analytics</motion.div>
             <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Transform Data into Decisive Action</motion.h2>
             <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">We build advanced data pipelines, predictive models, and real-time business intelligence dashboards to help you uncover hidden opportunities and optimize operations.</motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-cyan-400 shadow-lg">
                    <Database size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Data Engineering & Pipelines</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Architecting robust data lakes and ETL pipelines to ingest, clean, and structure millions of records securely in real-time.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-cyan-400 shadow-lg">
                    <Target size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Predictive Analytics</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Leveraging machine learning models to forecast trends, predict churn, and anticipate market shifts before they happen.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-cyan-400 shadow-lg">
                    <BarChart3 size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">BI & Visual Dashboards</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Translating complex datasets into beautiful, interactive dashboards that give executives instant visibility into core KPIs.</p>
                 </div>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex gap-6">
                 <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-slate-800 text-cyan-400 shadow-lg">
                    <Activity size={28}/>
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white mb-2">Real-Time Processing</h4>
                    <p className="text-slate-400 font-light leading-relaxed">Streaming data architecture that processes events on the fly, enabling instantaneous decision making and automated responses.</p>
                 </div>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#0b1120] rounded-3xl p-8 overflow-hidden relative border border-slate-800 shadow-2xl group flex flex-col justify-center min-h-[540px]">
              
              {/* Overlapping Solid Pie Chart */}
              <motion.div whileHover={{ scale: 1.05 }} className="absolute top-8 right-6 bg-[#030712] rounded-xl border border-slate-700 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden z-20 w-44 h-44 flex flex-col transition-transform duration-500 hidden md:flex">
                 <div className="bg-slate-900/80 border-b border-slate-800 px-3 py-2 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-white tracking-widest uppercase">Node Security</div>
                 </div>
                 <div className="p-4 flex-1 flex items-center justify-center relative">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)] rounded-full">
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-cyan-400" strokeWidth="31.831" strokeDasharray="40 60" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-rose-500" strokeWidth="31.831" strokeDasharray="35 65" strokeDashoffset="-40" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-purple-500" strokeWidth="31.831" strokeDasharray="25 75" strokeDashoffset="-75" />
                    </svg>
                 </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="bg-[#030712] rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative z-10 w-full lg:w-4/5 h-[420px] flex flex-col transition-transform duration-500">
                <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="text-cyan-400" size={20}/>
                    <div className="text-sm font-bold text-white tracking-widest uppercase">Predictive Threat Model</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex justify-between items-end mb-6">
                     <div>
                       <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Threats Neutralized Q4</div>
                       <div className="text-3xl font-bold text-white">24,592 <span className="text-sm font-medium text-emerald-400">+18% Mitigation</span></div>
                     </div>
                     <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-xs font-bold">99.8% Confidence</div>
                   </div>
                   <div className="flex-1 flex items-end justify-between gap-3 px-2 mt-auto h-40">
                     <div className="w-full bg-slate-800 rounded-t-sm h-[30%] relative group-hover:bg-slate-700 transition-colors"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Q1</div></div>
                     <div className="w-full bg-slate-800 rounded-t-sm h-[45%] relative group-hover:bg-slate-700 transition-colors"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Q2</div></div>
                     <div className="w-full bg-slate-700 rounded-t-sm h-[65%] relative group-hover:bg-slate-600 transition-colors"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">Q3</div></div>
                     <div className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm h-[90%] relative shadow-[0_0_15px_rgba(34,211,238,0.3)]"><div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-cyan-400 font-bold">Q4</div></div>
                   </div>
                </div>
              </motion.div>

              {/* Overlapping Doughnut Chart */}
              <motion.div whileHover={{ scale: 1.05 }} className="absolute bottom-6 right-10 bg-[#030712] rounded-xl border border-slate-700 shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden z-20 w-48 h-48 flex flex-col transition-transform duration-500 hidden md:flex">
                 <div className="bg-slate-900/80 border-b border-slate-800 px-3 py-2 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-white tracking-widest uppercase">Attack Vectors</div>
                 </div>
                 <div className="p-4 flex-1 flex items-center justify-center relative">
                    <svg viewBox="0 0 36 36" className="w-28 h-28 transform -rotate-90 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-slate-800" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-cyan-400" strokeWidth="3" strokeDasharray="55 45" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-rose-500" strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-55" />
                      <circle cx="18" cy="18" r="15.9155" fill="none" className="stroke-purple-500" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-85" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center mt-6">
                       <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">API EXPLOIT</div>
                       <div className="text-sm text-white font-bold">55%</div>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
            
          </div>
        </motion.section>

        {/* Tech Blogs Section */}
        <motion.section 
          id="blogs" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        >
          <div className="mb-12">
            <div>
              <motion.div variants={fadeInUp} className="inline-flex text-cyan-400 font-semibold text-sm mb-4 tracking-widest uppercase">Tech Blog</motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white tracking-tight">Latest Insights</motion.h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {blogPosts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500">No blogs published yet. Use the Admin Portal to create one.</div>
            ) : blogPosts.map((post) => (
              <Link 
                to={`/blog/${post.slug}`}
                key={post.id}
              >
                <motion.div 
                  variants={fadeInUp} 
                  className="bg-[#0b1120] rounded-3xl overflow-hidden border border-slate-800 hover:border-rose-500/50 transition-all cursor-pointer group hover:-translate-y-2 shadow-2xl flex flex-col h-full"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 font-mono">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <h4 className="text-base font-bold text-white mb-3 group-hover:text-rose-400 transition-colors leading-snug line-clamp-3">{post.title}</h4>
                    <p className="text-slate-400 text-xs font-light mb-6 flex-1 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-rose-500 font-medium text-xs mt-auto group-hover:translate-x-2 transition-transform">
                      Read Full Article <ArrowUpRight size={14} className="ml-1" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Newsletter & Contact Form Section */}
        <motion.section 
          id="contact" className="scroll-mt-32"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp}
        >
          <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 lg:p-24 border border-slate-800 relative overflow-hidden flex flex-col lg:flex-row gap-16 items-start justify-between">
            <div className="flex-1 w-full">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Subscribe to the Sentinel.</h2>
              <p className="text-slate-400 text-lg mb-10 font-light leading-relaxed">Stay ahead of the curve. Subscribe to our newsletter for deep-dive technical insights, industry trends, and engineering breakthroughs delivered directly to your inbox.</p>
              
              <form className="flex flex-col sm:flex-row gap-3 mb-16" onSubmit={handleSubscribe}>
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20}/>
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    disabled={newsletterStatus === 'loading'}
                    className="w-full bg-[#050b14] border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-slate-500 transition-colors disabled:opacity-50"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={newsletterStatus === 'loading'}
                  className="bg-white text-slate-950 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] min-w-[140px] disabled:opacity-75"
                >
                  {newsletterStatus === 'loading' ? 'Sending...' : newsletterStatus === 'success' ? 'Subscribed!' : newsletterStatus === 'error' ? 'Error' : 'Subscribe'}
                </button>
              </form>

              <h3 className="text-2xl font-bold text-white mb-4">Let's Build the Future.</h3>
              <p className="text-slate-400 mb-8 font-light max-w-sm leading-relaxed">Partner with us to architect scalable, secure, and intelligent systems tailored entirely to your enterprise's unique challenges.</p>
            </div>

            <div className="flex-1 w-full bg-[#050b14] border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl relative z-10">
              <h3 className="text-3xl font-bold text-white mb-8">Initiate Secure Comms</h3>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-3">Full Name</label>
                  <input 
                    type="text" 
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    required 
                    disabled={contactStatus === 'loading'}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-4 px-5 focus:outline-none focus:border-slate-500 transition-colors disabled:opacity-50" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-3">Work Email</label>
                  <input 
                    type="email" 
                    value={contactData.email}
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    required 
                    disabled={contactStatus === 'loading'}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-4 px-5 focus:outline-none focus:border-slate-500 transition-colors disabled:opacity-50" 
                    placeholder="john@company.com" 
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm font-medium mb-3">How can we help?</label>
                  <textarea 
                    rows="4" 
                    value={contactData.message}
                    onChange={(e) => setContactData({...contactData, message: e.target.value})}
                    required 
                    disabled={contactStatus === 'loading'}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-4 px-5 focus:outline-none focus:border-slate-500 transition-colors resize-none disabled:opacity-50" 
                    placeholder="Tell us about your organization's needs..."
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={contactStatus === 'loading'}
                  className={`w-full px-8 py-4 rounded-xl font-bold transition-all shadow-lg text-lg ${contactStatus === 'success' ? 'bg-green-500 text-white hover:bg-green-600' : contactStatus === 'error' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-slate-950 hover:bg-slate-200'} disabled:opacity-75`}
                >
                  {contactStatus === 'loading' ? 'Sending...' : contactStatus === 'success' ? 'Message Sent Successfully!' : contactStatus === 'error' ? 'Error Sending Message' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </motion.section>

      </main>
      
      {/* Fatter Footer */}
        <footer className="border-t border-slate-800/60 pt-16 pb-10 px-4 lg:px-8 max-w-[92%] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="md:col-span-2">
             <div className="flex items-center gap-3 mb-8">
                <Logo className="w-10 h-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]" />
                <span className="font-bold tracking-tight text-white text-2xl">Cyber Sentinel</span>
              </div>
              <p className="text-slate-500 text-base max-w-sm leading-relaxed mb-8 font-light">
                The all-in-one Software, Security, and AI platform for modern companies. Built by a lean, passionate team dedicated to democratizing enterprise technology globally.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-slate-400 text-sm font-medium">
                  <MapPin size={20} className="text-slate-500 shrink-0 mt-0.5" />
                  <span>46A/33/2 Shibpur Road,<br/>Howrah - 711102</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                  <Phone size={20} className="text-slate-500 shrink-0" />
                  <span>8910114730</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                  <Mail size={20} className="text-slate-500 shrink-0" />
                  <a href="mailto:chattopadhyaysayak7@gmail.com" className="hover:text-white transition-colors">chattopadhyaysayak7@gmail.com</a>
                </div>
              </div>
           </div>
           
           <div>
             <h4 className="font-bold text-white mb-8 text-sm tracking-widest uppercase">Platform</h4>
             <ul className="space-y-4 text-sm text-slate-400 font-medium">
               <li><a href="#solutions" className="hover:text-white transition-colors">ERP Software</a></li>
               <li><a href="#security" className="hover:text-white transition-colors">Cyber Security</a></li>
               <li><a href="#ai" className="hover:text-white transition-colors">AI Chatbots</a></li>
               <li><a href="#custom-dev" className="hover:text-white transition-colors">Custom App Development</a></li>
               <li><a href="#data" className="hover:text-white transition-colors">Data & Analytics</a></li>
             </ul>
           </div>
           
           <div>
             <h4 className="font-bold text-white mb-8 text-sm tracking-widest uppercase">Company</h4>
             <ul className="space-y-4 text-sm text-slate-400 font-medium">
               <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
               <li><a href="#blogs" className="hover:text-white transition-colors">Tech Blog</a></li>
               <li><a href="#contact" className="hover:text-white transition-colors">Initiate Secure Comms</a></li>
             </ul>
           </div>

           <div>
             <h4 className="font-bold text-white mb-8 text-sm tracking-widest uppercase">Legal & Compliance</h4>
             <ul className="space-y-4 text-sm text-slate-400 font-medium">
               <li><Link to="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
               <li><Link to="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
               <li><Link to="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
               <li><Link to="/legal/security" className="hover:text-white transition-colors">Security Whitepaper</Link></li>
               <li><Link to="/legal/soc2" className="hover:text-white transition-colors">SOC2 Compliance Status</Link></li>
             </ul>
           </div>
        </div>
        
        <div className="max-w-[92%] mx-auto px-4 lg:px-8 text-center text-slate-600 text-sm border-t border-slate-800/80 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Cyber Sentinel Inc. All rights reserved.</p>
          <p className="font-medium text-slate-500">Crafted with precision by the Sentinel Team.</p>
        </div>
      </footer>
      
      <Toast 
        message={toastMessage} 
        isVisible={isToastVisible} 
        onClose={() => setIsToastVisible(false)} 
      />
    </div>
  );
}

export default Home;
