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

  // Simple parser for milestones (##) and points (-)
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
      // Fallback for lines that don't start with - but are part of the milestone
      currentMilestone.points.push(line.trim());
    }
  });
  if (currentMilestone) milestones.push(currentMilestone);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 py-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
      {milestones.map((m, idx) => (
        <div key={idx} className="relative pl-12 group/step">
          {/* Timeline Connector */}
          {idx !== milestones.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-[-32px] w-[2px] bg-gradient-to-b from-purple-500/20 via-purple-500/10 to-transparent" />
          )}

          {/* Step Indicator */}
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#050505] border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.15)] group-hover/step:border-purple-500 group-hover/step:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all duration-500">
            <span className="text-[10px] font-bold text-purple-400">{idx + 1}</span>
          </div>

          <h4 className="text-white font-bold text-lg mb-4 tracking-tight group-hover/step:text-purple-300 transition-colors">
            {m.title}
          </h4>

          <ul className="space-y-3">
            {m.points.map((p, pIdx) => (
              <li key={pIdx} className="flex items-start gap-3 text-sm text-gray-400/90 leading-relaxed group/point">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/30 mt-2 shrink-0 group-hover/point:bg-purple-500 transition-colors" />
                <span className="group-hover/point:text-gray-200 transition-colors">{p}</span>
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
      <div className="relative group p-[1px] rounded-[3rem] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-1000">
        <div className="bg-[#050505] rounded-[3rem] p-8 lg:p-14 backdrop-blur-3xl relative overflow-hidden shadow-2xl">
          {/* Dynamic Accents */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" />

          <div className="flex flex-col lg:flex-row gap-16 items-start relative z-10">
            <div className="flex-1 lg:sticky lg:top-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300">Neural Engine v2</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold tracking-tighter mb-6 text-white leading-[1.1]">
                Mastery begins with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Blueprint.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
                Describe your target skill. Our AI will synthesize a structured career roadmap tailored for elite engineering roles.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1 group/input">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within/input:text-purple-400 transition-colors" />
                  <Input
                    placeholder="Skill or Tech Stack..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-white/5 border-white/10 rounded-2xl h-16 pl-14 text-white text-lg placeholder:text-white/20 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all font-medium"
                  />
                </div>
                <Button
                  onClick={generateRoadmap}
                  disabled={loading || !topic.trim()}
                  className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-extrabold text-base transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            <div className="w-full lg:w-[500px] flex flex-col">
              <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden min-h-[450px] shadow-inner">
                {!roadmap && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
                      <Sparkles className="w-10 h-10 text-white/40" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 leading-loose">Waiting for<br />Architecture Input</p>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center space-y-6 py-24">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
                      <Loader2 className="w-12 h-12 text-purple-400 animate-spin relative" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-white animate-pulse mb-2">Synthesizing Hub</p>
                      <p className="text-[10px] text-gray-500 font-mono italic">Parsing industry standards...</p>
                    </div>
                  </div>
                )}

                {roadmap && !loading && (
                  <div className="animate-in fade-in duration-1000">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Blueprint Status: Active</span>
                      </div>
                      <Badge variant="outline" className="border-purple-500/30 text-[9px] uppercase tracking-tighter text-purple-400 bg-purple-500/5">Elite Standard</Badge>
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

      <div className="relative bg-white/[0.01] border border-white/5 backdrop-blur-3xl rounded-3xl p-7 h-full flex flex-col transition-all duration-300 hover:border-white/10 shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${resource.color} p-[1px]`}>
            <div className="w-full h-full rounded-2xl bg-[#030303] flex items-center justify-center text-white/90 group-hover:scale-90 transition-transform duration-300">
              {resource.icon}
            </div>
          </div>
          <Badge variant="outline" className="border-white/5 bg-white/5 text-[9px] uppercase font-bold tracking-widest text-white/30 group-hover:text-white/50 transition-colors px-2 py-0.5">
            {resource.badge}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-white/90 mb-3 group-hover:text-white transition-colors tracking-tight">
          {resource.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1 font-medium">
          {resource.description}
        </p>

        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all group/link"
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
    <div className="min-h-screen bg-[#030303] text-white selection:bg-purple-500/30 font-sans tracking-tight">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-purple-600/[0.03] blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-blue-600/[0.03] blur-[160px] rounded-full animate-pulse duration-[10s]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="max-w-4xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-300">Entervue Resources Hub</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent leading-[0.9]">
            Architect Your <br className="hidden lg:block" /> Future.
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed font-medium max-w-2xl">
            Go beyond suggestions. Utilize our neural engine to synthesize tailored learning paths and access elite industry blueprints.
          </p>
        </div>

        <AIRoadmapGenerator />

        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 ml-1">Suggested Blueprints</h3>
            <div className="flex flex-wrap gap-2.5">
              {RESOURCE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeCategory === cat.id
                      ? "bg-white text-black shadow-2xl shadow-white/20"
                      : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 border border-white/5"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full lg:w-96 group/search self-end">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within/search:text-white transition-colors" />
            <Input
              placeholder="Search blueprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10 rounded-2xl h-14 pl-14 focus:border-white/20 focus:ring-purple-500/20 placeholder:text-gray-600 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}

          {filteredResources.length === 0 && (
            <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-700" />
              </div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No blueprints found matching your search.</p>
            </div>
          )}
        </div>

        {/* Brand Vision Footer */}
        <div className="mt-40 pt-20 border-t border-white/5 relative overflow-hidden animate-in fade-in duration-1000">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 relative z-10">
            <div className="max-w-2xl">
              <h4 className="text-3xl font-bold text-white mb-6 tracking-tight">The Entervue (EVPOM) Standard</h4>
              <p className="text-xl text-gray-500 leading-relaxed italic border-l-4 border-purple-500/30 pl-8 font-medium">
                "Real intelligence isn't just suggesting links; it's architecting your future. Our mission is to ensure every engineer has the high-class toolkit required for the world's most elite tech teams."
              </p>
            </div>

            <div className="flex flex-col gap-8 text-center lg:text-right w-full lg:w-auto">
              <div className="flex gap-4 justify-center lg:justify-end">
                <div className="px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-purple-400">Elite Standards</span>
                </div>
                <div className="px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400">FAANG Target</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">EVPOM Neural Ecosystem</p>
                <div className="flex items-center justify-center lg:justify-end gap-2 text-white/40">
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