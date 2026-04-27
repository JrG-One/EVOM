import React, { useEffect, useState } from "react";
import {
  Code2,
  BookOpen,
  Layout,
  Terminal,
  Globe,
  Cpu,
  Sparkles,
  Search,
  BookMarked,
  ArrowRight,
  Wand2,
  Loader2,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";

const RESOURCE_CATEGORIES = [
  { id: "all", label: "All Hub" },
  { id: "dsa", label: "DSA Blueprints" },
  { id: "system-design", label: "Architecture" },
  { id: "interview-prep", label: "Mock Intel" },
  { id: "tech-stacks", label: "Tech Stacks" },
];

const staticResources = [
  {
    id: "striver-sheet",
    category: "dsa",
    title: "Striver's SDE Sheet",
    description: "The gold standard for SDE preparation. 180+ curated DSA problems covers all top companies.",
    icon: <Code2 className="w-5 h-5" />,
    link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
    badge: "Suggested Blueprint",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: "system-design-primer",
    category: "system-design",
    title: "System Design Guide",
    description: "Learn how to build large-scale systems. The ultimate guide for architectural interviews.",
    icon: <Layout className="w-5 h-5" />,
    link: "https://github.com/donnemartin/system-design-primer",
    badge: "Suggested Blueprint",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "google-questions",
    category: "interview-prep",
    title: "FAANG Question Vault",
    description: "Real questions asked at top tech giants. Curated by top engineers.",
    icon: <Terminal className="w-5 h-5" />,
    link: "https://www.interviewbit.com/google-interview-questions/",
    badge: "External Resource",
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "roadmap-computer-science",
    category: "tech-stacks",
    title: "CS Fundamentals Hub",
    description: "A comprehensive journey through OS, DBMS, and Networking. Master the basics.",
    icon: <Globe className="w-5 h-5" />,
    link: "https://roadmap.sh/computer-science",
    badge: "Suggested Blueprint",
    color: "from-emerald-400 to-teal-500"
  },
  {
    id: "leetcode-experiences",
    category: "interview-prep",
    title: "Community Experiences",
    description: "Actual interview experiences shared by thousands. Know the ground reality.",
    icon: <BookMarked className="w-5 h-5" />,
    link: "https://leetcode.com/discuss/interview-experience",
    badge: "External Resource",
    color: "from-cyan-400 to-blue-500"
  }
];

const RoadmapRenderer = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const milestones = [];
  let currentMilestone = null;

  lines.forEach(line => {
    if (line.startsWith('##')) {
      if (currentMilestone) milestones.push(currentMilestone);
      currentMilestone = {
        title: line.replace('##', '').replace(/^\d+\.\s*/, '').trim(),
        points: []
      };
    } else if (line.startsWith('-') && currentMilestone) {
      currentMilestone.points.push(line.replace('-', '').trim());
    } else if (line.trim() && !line.startsWith('#') && currentMilestone) {
      currentMilestone.points.push(line.trim());
    }
  });
  if (currentMilestone) milestones.push(currentMilestone);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 py-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
      {milestones.map((m, idx) => (
        <div key={idx} className="relative pl-12 group/step">
          {idx !== milestones.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-[-32px] w-[2px] bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
          )}

          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-card border border-primary/40 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.15)] group-hover/step:border-primary group-hover/step:shadow-[0_0_25px_rgba(var(--primary),0.3)] transition-all duration-500">
            <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
          </div>

          <h4 className="text-foreground font-bold text-lg mb-4 tracking-tight group-hover/step:text-primary transition-colors">
            {m.title}
          </h4>

          <ul className="space-y-3">
            {m.points.map((p, pIdx) => (
              <li key={pIdx} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed group/point">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/30 mt-2 shrink-0 group-hover/point:bg-primary transition-colors" />
                <span className="group-hover/point:text-foreground transition-colors">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const AIRoadmapGenerator = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post("/chat", {
        messages: [
          { role: "system", content: "You are a professional career coach. Generate a high-level, step-by-step roadmap for the given topic. Use '##' for milestones and '-' for bullet points. Keep it concise with 4-5 major milestones. Do not include extra text/greeting." },
          { role: "user", content: `Generate a career roadmap for mastering: ${topic}` }
        ]
      });
      setRoadmap(response.data.reply);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-span-full mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="relative group p-[1px] rounded-[3rem] bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-secondary/20 dark:to-primary/20 hover:from-primary/30 hover:to-secondary/30 transition-all duration-1000 shadow-2xl">
        <div className="bg-card rounded-[3rem] p-8 lg:p-14 backdrop-blur-3xl relative overflow-hidden">
          {/* Dynamic Accents */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />

          <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
            <div className="flex-1 lg:sticky lg:top-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <Wand2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Neural Engine v2</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-6 text-foreground leading-[1.1]">
                Mastery begins with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Blueprint.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl leading-relaxed font-medium">
                Describe your target skill. Our AI will synthesize a structured career roadmap tailored for elite engineering roles.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1 group/input">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                  <Input
                    placeholder="Skill or Tech Stack..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-accent/50 border-border rounded-2xl h-16 pl-14 text-foreground text-lg placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
                <Button
                  onClick={generateRoadmap}
                  disabled={loading || !topic.trim()}
                  className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 font-extrabold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/10"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-[500px] flex flex-col">
              <div className="flex-1 bg-accent/20 border border-border rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden min-h-[450px] shadow-inner">
                {!roadmap && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 rounded-3xl bg-card flex items-center justify-center mb-6 border border-border shadow-sm">
                      <Sparkles className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/40 leading-loose">Waiting for<br />Architecture Input</p>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 py-24">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                      <Loader2 className="w-12 h-12 text-primary animate-spin relative" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-foreground animate-pulse mb-2">Synthesizing Hub</p>
                      <p className="text-[10px] text-muted-foreground font-mono italic">Parsing industry standards...</p>
                    </div>
                  </div>
                )}

                {roadmap && !loading && (
                  <div className="animate-in fade-in duration-1000">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Blueprint Status: Active</span>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-[9px] uppercase tracking-tighter text-primary bg-primary/5 font-bold">Elite Standard</Badge>
                    </div>

                    <RoadmapRenderer content={roadmap} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource }) => {
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${resource.color} rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500`} />

      <div className="relative bg-card border border-border backdrop-blur-3xl rounded-3xl p-7 h-full flex flex-col transition-all duration-300 hover:border-primary/50 shadow-sm hover:shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resource.color} p-[1px]`}>
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center text-foreground group-hover:scale-95 transition-transform duration-300">
              {resource.icon}
            </div>
          </div>
          <Badge variant="outline" className="border-border bg-accent/50 text-[9px] uppercase font-bold tracking-widest text-muted-foreground group-hover:text-foreground transition-colors px-2 py-0.5">
            {resource.badge}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors tracking-tight">
          {resource.title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 font-medium opacity-80 group-hover:opacity-100">
          {resource.description}
        </p>

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group/link"
        >
          View Source
          <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/link:translate-x-2 transition-transform" />
        </a>
      </div>
    </div>
  );
};

const ResourcePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = staticResources.filter(res => {
    const matchesCategory = activeCategory === "all" || res.category === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans tracking-tight relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary/[0.03] dark:bg-primary/[0.05] blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-indigo-500/[0.03] dark:bg-indigo-500/[0.05] blur-[160px] rounded-full animate-pulse duration-[10s]" />
        
        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-4xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Entervue Resources Hub</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tighter mb-8 text-foreground leading-[0.9]">
            Architect Your <br className="hidden lg:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Future.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl opacity-80">
            Go beyond suggestions. Utilize our neural engine to synthesize tailored learning paths and access elite industry blueprints.
          </p>
        </div>

        <AIRoadmapGenerator />

        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">Suggested Blueprints</h3>
            <div className="flex flex-wrap gap-2.5">
              {RESOURCE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat.id
                      ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20"
                      : "bg-card text-muted-foreground hover:text-foreground hover:bg-accent border border-border shadow-sm"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-96 group/search self-end">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
            <Input
              placeholder="Search blueprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border rounded-2xl h-14 pl-14 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-32 text-center border border-dashed border-border rounded-[3rem] bg-accent/10">
              <div className="w-16 h-16 rounded-3xl bg-card flex items-center justify-center mx-auto mb-6 border border-border shadow-sm">
                <Search className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No blueprints found matching your search.</p>
            </div>
          )}
        </div>

        {/* Brand Vision Footer */}
        <div className="mt-40 pt-20 border-t border-border relative overflow-hidden animate-in fade-in duration-1000">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 relative z-10">
            <div className="max-w-2xl">
              <h4 className="text-3xl font-extrabold text-foreground mb-6 tracking-tight">The Entervue (EVPOM) Standard</h4>
              <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary/30 pl-8 font-medium">
                "Real intelligence isn't just suggesting links; it's architecting your future. Our mission is to ensure every engineer has the high-class toolkit required for the world's most elite tech teams."
              </p>
            </div>

            <div className="flex flex-col gap-8 text-center lg:text-right w-full lg:w-auto">
              <div className="flex gap-4 justify-center lg:justify-end">
                <div className="px-6 py-3 rounded-2xl bg-card border border-border backdrop-blur-xl shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Elite Standards</span>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-card border border-border backdrop-blur-xl shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-indigo-500 font-extrabold">FAANG Target</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 dark:text-muted-foreground/30 font-bold">EVPOM Neural Ecosystem</p>
                <div className="flex items-center justify-center lg:justify-end gap-2 text-foreground/40">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">Global Ops Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePage;