import React, { useState, useEffect } from 'react';
import {
    ArrowRight, Brain, Briefcase, GraduationCap, Sparkles,
    Shield, CheckCircle2, Menu, X, Lock, Users, Target,
    Mail, Twitter, Linkedin, Github, Globe, Eye, Zap,
    Heart, Timer, TrendingUp, Search, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPageV2 = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const missionVision = [
        {
            icon: Eye,
            title: "Our Mission",
            subtitle: "Stop looking at resumes, start looking at minds.",
            content: "We're on a mission to eliminate the 'memorization' culture. By focusing on thinking patterns rather than just right or wrong answers, we provide fairness for all builders, regardless of their background.",
            color: "text-purple-400",
            bgColor: "bg-purple-500/10"
        },
        {
            icon: Target,
            title: "Our Vision",
            subtitle: "The world's most trusted way to find talent.",
            content: "One day, every person will have an 'EVOM Profile' that showcases their real skills. We envision a world where hiring is automatic, certain, and takes just 7 days instead of months.",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10"
        }
    ];

    const coreValues = [
        { icon: Heart, title: "Honesty", desc: "We value 'I don't know, but I'll find out' over fake perfection." },
        { icon: Timer, title: "Speed", desc: "Hiring should be as fast as ordering food. 7-day guarantee." },
        { icon: Zap, title: "Journey Focused", desc: "We watch how you solve it, how you stay calm, and how you pivot." }
    ];

    return (
        <div className="min-h-screen bg-[#030303] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans scroll-smooth">

            {/* Premium Background Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/[0.03] rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/[0.03] rounded-full blur-[160px] animate-pulse duration-[10s]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.2]"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#030303]/80 backdrop-blur-2xl border-b border-white/5 py-4' : 'py-8 bg-transparent'}`}>
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/home')}>
                        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl shadow-2xl shadow-purple-900/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tighter text-white leading-none">
                                ENTERVUE
                            </span>
                            <span className="text-[7px] font-bold tracking-[0.4em] text-purple-400 uppercase mt-1">EVOM Ecosystem</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <a href="#about" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors">Our Story</a>
                        <button
                            onClick={() => navigate('/get-started')}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-600/20"
                        >
                            Student Login
                        </button>
                    </div>

                    <button className="md:hidden text-white/60" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Main Hero */}
            <main className="relative z-10 pt-32 pb-10 lg:pt-48">
                <div className="container mx-auto px-6 max-w-7xl">

                    <div className="text-center mb-20 lg:mb-32">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 animate-in fade-in duration-1000 delay-500">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
                                <Award size={14} className="text-orange-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Incubated at IIIT Surat</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
                                <Shield size={14} className="text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">SSIP 2.0 Certified</span>
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                            A peek inside how you <br className="hidden lg:block" /> think & solve problems.
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg lg:text-xl text-gray-500 font-medium leading-relaxed">
                            Most platforms only check if your code is right or wrong. <span className="text-white">We see what others miss</span>—we watch the journey of your mind.
                        </p>
                    </div>

                    {/* Mission & Vision Section */}
                    <div id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32 pt-10">
                        {missionVision.map((item, i) => (
                            <div key={i} className="p-10 lg:p-14 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                                <div className={`absolute -right-8 -top-8 w-40 h-40 ${item.bgColor} blur-[80px] opacity-20`} />
                                <item.icon className={`w-12 h-12 ${item.color} mb-8`} />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-4">{item.title}</h3>
                                <h4 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">{item.subtitle}</h4>
                                <p className="text-gray-500 font-medium leading-relaxed text-lg">{item.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Dual Segment Selection */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-32">

                        {/* Student Segment */}
                        <div className="group relative p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/20 transition-all duration-700">
                            <div className="bg-[#050505] rounded-[2.4rem] p-8 lg:p-12 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <GraduationCap size={120} />
                                </div>
                                <div className="mb-10 w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                    <Users size={32} />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-6 text-white text-left">For Students & <br />Job Seekers</h2>
                                <p className="text-gray-500 text-left font-medium mb-10 leading-relaxed text-lg">
                                    Showcase your thinking patterns. Practice with AI as your coach to fix weaknesses and prove your skills regardless of your background.
                                </p>
                                <div className="mt-auto space-y-4">
                                    {[
                                        "Unified Interview Simulator",
                                        "Proven Thinking Pattern Reports",
                                        "7-Day Hiring Cycle Acceleration"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                                            <CheckCircle2 size={16} className="text-purple-500" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate('/get-started')}
                                        className="mt-8 w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Practice Now <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Company Segment */}
                        <div className="group relative p-1 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent hover:from-blue-500/10 transition-all duration-700">
                            <div className="bg-[#050505] rounded-[2.4rem] p-8 lg:p-12 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Briefcase size={120} />
                                </div>
                                <div className="mb-10 w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                    <Target size={32} />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-6 text-white leading-tight text-left">AI-Driven Hiring Solution <br />with High Accuracy</h2>
                                <p className="text-gray-500 text-left font-medium mb-10 leading-relaxed text-lg">
                                    Collapse months of hiring into 7 days. Automate filtering by seeing only the top 1% who possess the actual thinking required for the role.
                                </p>
                                <div className="mt-auto space-y-4 text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                        <Lock size={12} />
                                        Coming Soon
                                    </div>
                                    {[
                                        "Reduce HR Workload by 90%",
                                        "100% Technical Certainty",
                                        "Zero-Bias Candidate Evaluations"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-500 opacity-50">
                                            <CheckCircle2 size={16} />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                    <button
                                        disabled
                                        className="mt-8 w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-black uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        Company Access
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-y border-white/5 py-24">
                        {coreValues.map((val, i) => (
                            <div key={i} className="text-center space-y-4 group">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <val.icon className="text-purple-400" size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-white">{val.title}</h4>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="relative z-10 py-20 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-16">
                        <div className="md:col-span-2 space-y-8 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-white">ENTERVUE</span>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                                Architecting the future of human potential. Stop looking at resumes and start looking at minds.
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-gray-600 hover:text-white transition-colors duration-300">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-white transition-colors duration-300">
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-white transition-colors duration-300">
                                    <Github size={20} />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-white transition-colors duration-300">
                                    <Mail size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-6 text-left">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Platforms</h4>
                            <ul className="space-y-4 text-sm font-bold text-gray-400">
                                <li className="hover:text-purple-400 transition-colors cursor-pointer">Candidate Portal</li>
                                <li className="hover:text-blue-400 transition-colors cursor-pointer text-gray-600 italic">EVPOM Recruiter (Soon)</li>
                                <li className="hover:text-white transition-colors cursor-pointer">EVOM Profiles</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Neural Analytics</li>
                            </ul>
                        </div>

                        <div className="space-y-6 text-left">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Ecosystem</h4>
                            <ul className="space-y-4 text-sm font-bold text-gray-400">
                                <li className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</li>
                                <li className="hover:text-white transition-colors cursor-pointer italic text-orange-400/80">Incubated at IIIT Surat</li>
                                <li className="hover:text-white transition-colors cursor-pointer">SSIP 2.0 Gujarat</li>
                                <li className="hover:text-white transition-colors cursor-pointer">Contact Hub</li>
                                <li className="flex items-center gap-2 text-emerald-500/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Global Nodes Active</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                            © 2026 Entervue of Minds (EVOM) — The Neural Frontier.
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-white/20" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">A peek inside how you think.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPageV2;
