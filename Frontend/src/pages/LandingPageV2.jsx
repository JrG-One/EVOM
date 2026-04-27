import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  Eye, 
  Target, 
  Heart, 
  Timer, 
  Zap, 
  Brain, 
  X, 
  Menu, 
  Award, 
  Shield, 
  GraduationCap, 
  Users, 
  ArrowRight, 
  Briefcase, 
  Lock, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Globe, 
  CheckCircle2 
} from 'lucide-react';

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
            color: "text-primary",
            bgColor: "bg-primary/10"
        },
        {
            icon: Target,
            title: "Our Vision",
            subtitle: "The world's most trusted way to find talent.",
            content: "One day, every person will have an 'EVOM Profile' that showcases their real skills. We envision a world where hiring is automatic, certain, and takes just 7 days instead of months.",
            color: "text-secondary",
            bgColor: "bg-secondary/10"
        }
    ];

    const coreValues = [
        { icon: Heart, title: "Honesty", desc: "We value 'I don't know, but I'll find out' over fake perfection." },
        { icon: Timer, title: "Speed", desc: "Hiring should be as fast as ordering food. 7-day guarantee." },
        { icon: Zap, title: "Journey Focused", desc: "We watch how you solve it, how you stay calm, and how you pivot." }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden font-sans scroll-smooth">

            {/* Premium Background Atmosphere */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/[0.05] rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/[0.05] rounded-full blur-[160px] animate-pulse duration-[10s]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-foreground)_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.03]"></div>
            </div>

            {/* Navbar */}
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? 'bg-background/70 backdrop-blur-2xl border-b border-border py-4 shadow-sm' : 'py-8 bg-transparent'}`}>
                <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/home')}>
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xl font-extrabold tracking-tighter text-foreground leading-none">
                                ENTERVUE
                            </span>
                            <span className="text-[7px] font-bold tracking-[0.4em] text-primary uppercase mt-1">EVOM Ecosystem</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <a href="#about" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Our Story</a>
                        <div className="h-4 w-[1px] bg-border mx-2" />
                        <ThemeToggle />
                        <button
                            onClick={() => navigate('/get-started')}
                            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/10"
                        >
                            Student Login
                        </button>
                    </div>

                    <div className="flex items-center gap-4 md:hidden">
                        <ThemeToggle />
                        <button className="text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Hero */}
            <main className="relative z-10 pt-32 pb-10 lg:pt-48">
                <div className="container mx-auto px-6 max-w-7xl">

                    <div className="text-center mb-20 lg:mb-32">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 animate-in fade-in duration-1000 delay-500">
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-accent/50 border border-border backdrop-blur-xl">
                                <Award size={14} className="text-orange-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Incubated at IIIT Surat</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-accent/50 border border-border backdrop-blur-xl">
                                <Shield size={14} className="text-secondary" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">SSIP 2.0 Certified</span>
                            </div>
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-tight">
                            A peek inside how you <br className="hidden lg:block" /> think & solve problems.
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg lg:text-xl text-muted-foreground font-medium leading-relaxed">
                            Most platforms only check if your code is right or wrong. <span className="text-foreground">We see what others miss</span>—we watch the journey of your mind.
                        </p>
                    </div>

                    {/* Mission & Vision Section */}
                    <div id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32 pt-10">
                        {missionVision.map((item, i) => (
                            <div key={i} className="p-10 lg:p-14 rounded-[3rem] bg-card/50 border border-border backdrop-blur-sm relative overflow-hidden group shadow-sm">
                                <div className={`absolute -right-8 -top-8 w-40 h-40 ${item.bgColor} blur-[80px] opacity-20`} />
                                <item.icon className={`w-12 h-12 ${item.color} mb-8`} />
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/30 mb-4">{item.title}</h3>
                                <h4 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 leading-tight text-left">{item.subtitle}</h4>
                                <p className="text-muted-foreground font-medium leading-relaxed text-lg text-left">{item.content}</p>
                            </div>
                        ))}
                    </div>

                    {/* Dual Segment Selection */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-32">

                        {/* Student Segment */}
                        <div className="group relative p-1 rounded-[2.5rem] bg-gradient-to-b from-primary/20 to-transparent hover:from-primary/30 transition-all duration-700 shadow-sm">
                            <div className="bg-card rounded-[2.4rem] p-8 lg:p-12 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <GraduationCap size={120} />
                                </div>
                                <div className="mb-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                    <Users size={32} />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tighter mb-6 text-foreground text-left leading-tight text-balance">For Students & <br />Job Seekers</h2>
                                <p className="text-muted-foreground text-left font-medium mb-10 leading-relaxed text-lg italic">
                                    Showcase your thinking patterns. Practice with AI as your coach to fix weaknesses and prove your skills regardless of your background.
                                </p>
                                <div className="mt-auto space-y-4">
                                    {[
                                        "Unified Interview Simulator",
                                        "Proven Thinking Pattern Reports",
                                        "7-Day Hiring Cycle Acceleration"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                            <CheckCircle2 size={16} className="text-primary" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate('/get-started')}
                                        className="mt-8 w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/10 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Practice Now <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Company Segment */}
                        <div className="group relative p-1 rounded-[2.5rem] bg-gradient-to-b from-secondary/10 to-transparent hover:from-secondary/20 transition-all duration-700 shadow-sm">
                            <div className="bg-card rounded-[2.4rem] p-8 lg:p-12 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Briefcase size={120} />
                                </div>
                                <div className="mb-10 w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                                    <Target size={32} />
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tighter mb-6 text-foreground leading-tight text-left text-balance">AI-Driven Hiring Solution <br />with High Accuracy</h2>
                                <p className="text-muted-foreground text-left font-medium mb-10 leading-relaxed text-lg">
                                    Collapse months of hiring into 7 days. Automate filtering by seeing only the top 1% who possess the actual thinking required for the role.
                                </p>
                                <div className="mt-auto space-y-4 text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-4">
                                        <Lock size={12} />
                                        Coming Soon
                                    </div>
                                    {[
                                        "Reduce HR Workload by 90%",
                                        "100% Technical Certainty",
                                        "Zero-Bias Candidate Evaluations"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground opacity-50">
                                            <CheckCircle2 size={16} />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                    <button
                                        disabled
                                        className="mt-8 w-full py-5 rounded-2xl bg-accent border border-border text-muted-foreground font-bold uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        Company Access
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 border-y border-border py-24">
                        {coreValues.map((val, i) => (
                            <div key={i} className="text-center space-y-4 group">
                                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all shadow-sm">
                                    <val.icon className="text-primary" size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-foreground">{val.title}</h4>
                                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="relative z-10 py-20 border-t border-border bg-card/60 backdrop-blur-md">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-16">
                        <div className="md:col-span-2 space-y-8 text-left">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-extrabold tracking-tighter text-foreground">ENTERVUE</span>
                            </div>
                            <p className="text-muted-foreground font-medium leading-relaxed max-w-sm">
                                Architecting the future of human potential. Stop looking at resumes and start looking at minds.
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                    <Linkedin size={20} />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                    <Github size={20} />
                                </a>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                    <Mail size={20} />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-6 text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">Platforms</h4>
                            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                                <li className="hover:text-primary transition-colors cursor-pointer">Candidate Portal</li>
                                <li className="hover:text-secondary transition-colors cursor-pointer italic text-muted-foreground/40">EVPOM Recruiter (Soon)</li>
                                <li className="hover:text-foreground transition-colors cursor-pointer text-foreground/80">EVOM Profiles</li>
                                <li className="hover:text-foreground transition-colors cursor-pointer text-foreground/80">Neural Analytics</li>
                            </ul>
                        </div>

                        <div className="space-y-6 text-left">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">Ecosystem</h4>
                            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
                                <li className="hover:text-foreground transition-colors cursor-pointer text-foreground/80">Privacy Protocol</li>
                                <li className="hover:text-foreground transition-colors cursor-pointer text-foreground/80 italic text-orange-500/80">Incubated at IIIT Surat</li>
                                <li className="hover:text-foreground transition-colors cursor-pointer text-foreground/80">SSIP 2.0 Gujarat</li>
                                <li className="hover:text-foreground transition-colors cursor-pointer text-foreground/80">Contact Hub</li>
                                <li className="flex items-center gap-2 text-emerald-500/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Nodes Active</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40 text-center md:text-left">
                            © 2026 Entervue of Minds (EVOM) — The Neural Frontier.
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe size={14} className="text-muted-foreground/20" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 font-medium">A peek inside how you think.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPageV2;