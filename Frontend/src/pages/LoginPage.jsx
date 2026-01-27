import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "../store/useAuthStore";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Brain, Mail, Lock, User, ArrowRight, Loader, Award, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen relative flex bg-[#030305] text-white overflow-x-hidden font-sans selection:bg-purple-500/30">
      {/* Background Mesh Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-purple-600/20 rounded-full blur-[140px] animate-pulse duration-[12s]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-blue-600/20 rounded-full blur-[140px] animate-pulse duration-[18s] delay-1000" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse duration-[15s] delay-500" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Section: Immersive Branding (Desktop Only) */}
        <div className="hidden lg:flex w-[45%] xl:w-[50%] flex-col items-center justify-center p-12 relative overflow-hidden border-r border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

          <div className="relative z-10 max-w-lg text-center">
            <div className="flex flex-col items-center mb-10 animate-in fade-in zoom-in duration-1000">

              {/* Institutional Credit Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Award className="w-4 h-4 text-orange-400" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/60 font-black">Incubated at IIIT Surat</span>
              </div>

              <div className="relative group perspective-1000 mb-10">
                <div className="p-8 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-[2.5rem] shadow-[0_0_80px_-15px_rgba(139,92,246,0.8)] transform group-hover:rotate-y-12 group-hover:scale-110 transition-all duration-1000 ease-out cursor-default">
                  <Brain className="w-20 h-20 text-white drop-shadow-2xl" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000"></div>
              </div>

              <h1 className="text-5xl xl:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20 drop-shadow-2xl">
                Entervue
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-8" />
              <p className="text-base xl:text-lg text-gray-400 leading-relaxed font-medium max-w-md mx-auto">
                The next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-black">AI-powered</span> career acceleration.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Authenticaton Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-y-auto">
          {/* Logo/Branding (Mobile View Only) */}
          <div className="flex lg:hidden flex-col items-center mb-12 text-center">
            <div className="p-4 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl shadow-xl shadow-purple-900/50 mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Entervue</h1>
          </div>

          <div className="w-full max-w-[480px]">
            <div className="mb-10 lg:mb-14 text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-4">Begin Mastery</h2>
              <p className="text-base text-gray-400 font-medium">Elevate your potential with our elite coaching system.</p>
            </div>

            <Tabs defaultValue="login" className="w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 group/tabs">
              <TabsList className="grid h-full w-full grid-cols-2 bg-[#0A0A0F]/80 border border-white/10 p-1.5 mb-10 rounded-2xl backdrop-blur-2xl shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 pointer-events-none" />
                <TabsTrigger
                  value="login"
                  className="rounded-xl text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 py-3.5 font-bold text-sm z-10"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-xl text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-500 py-3.5 font-bold text-sm z-10"
                >
                  Join EVOM
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <Card className="relative bg-[#0A0A0F]/40 border-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/20 group/card">
                  {/* Border Beam Effect */}
                  <div className="absolute inset-0 p-[2px] rounded-[2.5rem] pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,#8b5cf6_240deg,#3b82f6_270deg,transparent_310deg)] animate-[spin_4s_linear_infinite]" />
                  </div>
                  <div className="absolute inset-[1.5px] bg-[#0A0A0F] rounded-[2.45rem] z-0" />

                  <div className="relative z-10">
                    <CardHeader className="pt-10 pb-8 px-10 space-y-1">
                      <CardTitle className="text-2xl font-bold text-white tracking-tight">Welcome back</CardTitle>
                      <CardDescription className="text-gray-400/90 font-medium text-base">Enter your credentials to continue.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-12">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(login)} className="space-y-7">
                          <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-2.5">
                                <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-500" />
                                    <Input
                                      placeholder="name@email.com"
                                      {...field}
                                      className="pl-12 h-16 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-[6px] focus:ring-purple-500/10 rounded-2xl transition-all duration-500 placeholder:text-white/40 text-base text-white"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[11px] text-red-400/90 font-bold ml-1" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="space-y-2.5">
                                <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Password</FormLabel>
                                <FormControl>
                                  <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-purple-400 group-focus-within/input:scale-110 transition-all duration-500" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      {...field}
                                      className="pl-12 pr-12 h-16 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-[6px] focus:ring-purple-500/10 rounded-2xl transition-all duration-500 placeholder:text-white/40 text-base text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[11px] text-red-400/90 font-bold ml-1" />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            disabled={isLoggingIn}
                            className="w-full h-16 mt-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] border-none rounded-2xl text-white font-black text-lg transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(139,92,246,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden"
                          >
                            <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
                            {isLoggingIn ? <Loader className="w-6 h-6 animate-spin" /> : <>Start Session <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" /></>}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="signup" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                <Card className="relative bg-[#0A0A0F]/40 border-white/10 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/20 group/card">
                  {/* Border Beam Effect (Blue) */}
                  <div className="absolute inset-0 p-[2px] rounded-[2.5rem] pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,#3b82f6_240deg,#6366f1_270deg,transparent_310deg)] animate-[spin_4s_linear_infinite]" />
                  </div>
                  <div className="absolute inset-[1.5px] bg-[#0A0A0F] rounded-[2.45rem] z-0" />

                  <div className="relative z-10">
                    <CardHeader className="pt-10 pb-8 px-10 space-y-1">
                      <CardTitle className="text-2xl font-bold text-white tracking-tight">Create Identity</CardTitle>
                      <CardDescription className="text-gray-400/90 font-medium text-base">Begin your transformation today.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-12">
                      <Form {...signupForm}>
                        <form onSubmit={signupForm.handleSubmit(signup)} className="space-y-6">
                          <FormField
                            control={signupForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem className="space-y-2.5">
                                <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Display Name</FormLabel>
                                <FormControl>
                                  <div className="relative group/input">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-blue-400 group-focus-within/input:scale-110 transition-all duration-500" />
                                    <Input
                                      placeholder="johndoe_evom"
                                      {...field}
                                      className="pl-12 h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-[6px] focus:ring-blue-500/10 rounded-2xl transition-all duration-500 placeholder:text-white/40 text-base text-white"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[11px] text-red-400/90 font-bold ml-1" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="space-y-2.5">
                                <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative group/input">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-blue-400 group-focus-within/input:scale-110 transition-all duration-500" />
                                    <Input
                                      placeholder="name@email.com"
                                      {...field}
                                      className="pl-12 h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-[6px] focus:ring-blue-500/10 rounded-2xl transition-all duration-500 placeholder:text-white/40 text-base text-white"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[11px] text-red-400/90 font-bold ml-1" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem className="space-y-2.5">
                                <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-black ml-1">Password</FormLabel>
                                <FormControl>
                                  <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within/input:text-blue-400 group-focus-within/input:scale-110 transition-all duration-500" />
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      placeholder="••••••••"
                                      {...field}
                                      className="pl-12 pr-12 h-16 bg-white/[0.03] border-white/10 focus:border-blue-500/50 focus:ring-[6px] focus:ring-blue-500/10 rounded-2xl transition-all duration-500 placeholder:text-white/40 text-base text-white"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[11px] text-red-400/90 font-bold ml-1" />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full h-16 mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] border-none rounded-2xl text-white font-black text-lg transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,white_50%,transparent_70%)] animate-[shimmer_3s_infinite] -translate-x-full" />
                            {isSigningUp ? <Loader className="w-6 h-6 animate-spin" /> : <>Join EVOM <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" /></>}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <p className="mt-16 text-center text-xs text-gray-500/80 leading-loose tracking-wide font-medium">
              By authentication, you accept the <br />
              <span className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300 underline underline-offset-[6px] decoration-white/10 hover:decoration-white/30">Terms of Governance</span> & <span className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300 underline underline-offset-[6px] decoration-white/10 hover:decoration-white/30">Privacy Shield</span>.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(10deg); }
          100% { transform: translateX(200%) rotate(10deg); }
        }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(12deg); }
      `}} />
    </div>
  );
};

export default LoginPage;
