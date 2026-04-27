import React from 'react';
import { SearchCode, Lock, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

export default function ResumeAnalysisPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-10 font-sans selection:bg-primary/30 flex items-center justify-center relative overflow-hidden">
      {/* Premium Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
        
        {/* Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-primary/10 to-primary/20 ring-1 ring-primary/20 shadow-2xl mb-4 backdrop-blur-md relative group">
          <SearchCode className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-primary text-primary-foreground font-bold p-1 rounded-full border-2 border-background shadow-lg">
              <Lock className="w-4 h-4" />
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary/30 text-primary font-bold tracking-widest text-[10px] uppercase bg-primary/5 mb-4 animate-pulse">
            Premium Module In Development
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-primary animate-gradient">Intelligence</span>
          </h1>
          
          <p className="text-muted-foreground text-xl max-w-md mx-auto leading-relaxed font-medium">
            Our elite ATS scoring and optimization engine is currently being calibrated for maximum accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-lg mx-auto">
          {[
            { icon: ShieldCheck, text: "AI-Powered ATS Matching" },
            { icon: Clock, text: "Real-time Keyword Optimization" }
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-sm group hover:border-primary/30 transition-colors duration-300">
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-primary/20"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>

        <div className="pt-12 text-muted-foreground/60 dark:text-muted-foreground/30 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <div className="h-px w-8 bg-border" />
          Version 2.0 Deployment Pending
          <div className="h-px w-8 bg-border" />
        </div>
      </div>
    </div>
  );
}