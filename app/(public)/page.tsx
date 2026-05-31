"use client";

import { ArrowRight, ShieldCheck, Server, Activity, Lock, Cpu, BarChart3, Database } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-600/20 selection:text-blue-900">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-400/20 blur-[120px] mix-blend-multiply" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-400/20 blur-[100px] mix-blend-multiply" />
        

      </div>

      <main className="relative z-10 flex-grow">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              <div className={`max-w-2xl transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <div className="inline-flex items-center rounded-full bg-blue-50/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-blue-700 border border-blue-200/50 mb-8 shadow-sm">
                  <span className="relative flex h-2 w-2 mr-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                  </span>
                  Enterprise Client Portal
                </div>

                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
                  Corban <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500">
                    Global Hub
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl font-light">
                  The secure command center for premium B2B corporate clients. Track, view, and manage your outsourced enterprise cloud assets and managed infrastructure in real-time.
                </p>

                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    href="/auth/login"
                    className="group relative inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative flex items-center">
                      Client Access <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="#features"
                    className="inline-flex items-center justify-center bg-white/50 backdrop-blur-md text-slate-700 px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:bg-white hover:shadow-md ring-1 ring-slate-200"
                  >
                    Explore Features
                  </Link>
                </div>
              </div>

              {/* Decorative 3D/Glassmorphism Element */}
              <div className={`hidden lg:block relative transition-all duration-1000 delay-300 transform ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Floating Glass Cards */}
                  <div className="absolute top-[10%] right-[10%] w-64 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl animate-[float_6s_ease-in-out_infinite]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Server className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-slate-700 text-sm font-medium">Cloud Nodes</span>
                      </div>
                      <span className="text-emerald-700 text-xs bg-emerald-100 px-2 py-1 rounded-full">99.99%</span>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                      </div>
                      <div className="h-2 w-[70%] bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-blue-400/50 rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-[20%] left-[5%] w-72 p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl animate-[float_7s_ease-in-out_infinite_reverse]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-slate-900 font-medium">Network Traffic</div>
                        <div className="text-slate-500 text-xs">Live monitoring active</div>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-16 mt-4">
                      {[40, 65, 45, 80, 55, 90, 75, 60, 85, 50].map((h, i) => (
                        <div key={i} className="flex-1 bg-blue-100 rounded-t-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: '30%' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="absolute top-[45%] left-[25%] w-48 p-5 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl animate-[float_5s_ease-in-out_infinite]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <ShieldCheck className="h-8 w-8 text-emerald-500" />
                        <div className="absolute inset-0 bg-emerald-400/20 blur-md rounded-full" />
                      </div>
                      <div>
                        <div className="text-slate-900 text-sm font-medium">Secured</div>
                        <div className="text-slate-500 text-xs">Zero breaches</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative border-t border-slate-200/50 bg-slate-50/50">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Command Your Infrastructure
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg font-light">
                A single pane of glass for complete visibility and control over your outsourced enterprise assets.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Activity className="w-6 h-6 text-blue-600" />,
                  title: "Real-time Monitoring",
                  desc: "Track the health, performance, and uptime of your entire infrastructure stack with millisecond precision.",
                  bg: "bg-blue-50",
                  border: "border-blue-100",
                  hoverBorder: "hover:border-blue-300",
                  shadow: "hover:shadow-blue-900/5"
                },
                {
                  icon: <Database className="w-6 h-6 text-purple-600" />,
                  title: "Asset Management",
                  desc: "Comprehensive visibility into your allocated cloud resources, databases, and storage instances.",
                  bg: "bg-purple-50",
                  border: "border-purple-100",
                  hoverBorder: "hover:border-purple-300",
                  shadow: "hover:shadow-purple-900/5"
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                  title: "Security Posture",
                  desc: "Review compliance reports, audit logs, and proactive threat mitigation applied to your environments.",
                  bg: "bg-emerald-50",
                  border: "border-emerald-100",
                  hoverBorder: "hover:border-emerald-300",
                  shadow: "hover:shadow-emerald-900/5"
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
                  title: "Usage Analytics",
                  desc: "Detailed insights into resource utilization, cost allocation, and capacity planning metrics.",
                  bg: "bg-orange-50",
                  border: "border-orange-100",
                  hoverBorder: "hover:border-orange-300",
                  shadow: "hover:shadow-orange-900/5"
                },
                {
                  icon: <Cpu className="w-6 h-6 text-rose-600" />,
                  title: "Compute Control",
                  desc: "Request scaling operations, view computational loads, and manage instance life-cycles securely.",
                  bg: "bg-rose-50",
                  border: "border-rose-100",
                  hoverBorder: "hover:border-rose-300",
                  shadow: "hover:shadow-rose-900/5"
                },
                {
                  icon: <Lock className="w-6 h-6 text-cyan-600" />,
                  title: "Identity Access",
                  desc: "Granular RBAC controls allowing you to manage which of your team members can access what data.",
                  bg: "bg-cyan-50",
                  border: "border-cyan-100",
                  hoverBorder: "hover:border-cyan-300",
                  shadow: "hover:shadow-cyan-900/5"
                }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className={`group relative p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200 ${feature.hoverBorder} transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-xl ${feature.shadow}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50" />
          <div className="container mx-auto px-6 relative z-10 max-w-5xl">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 md:p-16 border border-slate-200 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-100/50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
              
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
                Exclusive Corporate Access
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-10 font-light">
                Corban Global Hub is strictly available to existing enterprise clients of Corban Technologies LTD. If you require access, please contact your dedicated account manager.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  Proceed to Login
                </Link>
                <Link
                  href="mailto:business@corbantechnologies.org"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent text-slate-700 px-8 py-4 rounded-lg font-medium transition-colors ring-1 ring-slate-300 hover:bg-slate-50"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
}
