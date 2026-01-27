import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Sparkles, ArrowRight, Target, Brain, MessageSquare } from "lucide-react";

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-white p-6 lg:p-10 font-sans selection:bg-purple-500/30 flex flex-col items-center justify-center relative overflow-hidden gap-12">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[15s]" />
      </div>

      {/* Main Content Card */}
      <Card className="relative z-10 max-w-2xl w-full bg-white/[0.02] border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700">
        <div className="p-8 md:p-12 text-center space-y-8">

          {/* Header Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-blue-500/20 text-purple-400 mb-4 ring-1 ring-white/10 shadow-lg shadow-purple-900/20">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50">
              Ready for your next <br className="hidden md:block" /> practice session?
            </h1>
            <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
              Our AI-powered mock interviews adapt to your skill level and provide
              instant feedback. Choose from technical, behavioral, or System Design interview based on your needs.
            </p>
          </div>

          <div className="pt-4">
            <Button
              className="bg-white text-black hover:bg-gray-200 px-8 py-6 text-lg rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-white/10 group"
              onClick={() => navigate("/start-interview")}
            >
              Start Interview
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </Card>

      {/* How it works Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-white/80 uppercase tracking-widest">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Target,
              title: "Choose Topic",
              desc: "Select from Technical, Behavioral, or System Design interview types."
            },
            {
              icon: Brain,
              title: "AI Practice",
              desc: "Answer dynamic questions tailored to your experience level."
            },
            {
              icon: MessageSquare,
              title: "Get Feedback",
              desc: "Receive instant, detailed feedback to improve your answers."
            }
          ].map((step, idx) => (
            <Card key={idx} className="bg-white/[0.01] border-white/5 backdrop-blur-md p-6 rounded-2xl hover:bg-white/[0.03] transition-colors duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-white/5 text-purple-400">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
