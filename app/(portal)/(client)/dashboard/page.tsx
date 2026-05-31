"use client";

import { useFetchHubs } from "@/hooks/hubs/actions";
import { useFetchHubProjects } from "@/hooks/hubprojects/actions";
import { useFetchHubProjectSubscriptions } from "@/hooks/hubprojectsubscriptions/actions";
import { Server, FolderKanban, Link as LinkIcon, ArrowRight, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ClientDashboard() {
  const { data: hubs, isLoading: loadingHubs } = useFetchHubs();
  const { data: projects, isLoading: loadingProjects } = useFetchHubProjects();
  const { data: subscriptions, isLoading: loadingSubscriptions } = useFetchHubProjectSubscriptions();

  const isLoading = loadingHubs || loadingProjects || loadingSubscriptions;

  const totalHubs = hubs?.length || 0;
  const totalProjects = projects?.length || 0;
  const totalSubscriptions = subscriptions?.length || 0;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your infrastructure and projects</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hubs Stat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Server className="w-24 h-24 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <Server className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Infrastructure Hubs</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{isLoading ? "-" : totalHubs}</h3>
            </div>
          </div>
        </div>

        {/* Projects Stat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <FolderKanban className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
              <FolderKanban className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Projects</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{isLoading ? "-" : totalProjects}</h3>
            </div>
          </div>
        </div>

        {/* Subscriptions Stat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <LinkIcon className="w-24 h-24 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 border border-purple-100">
              <LinkIcon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Service Subscriptions</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{isLoading ? "-" : totalSubscriptions}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Hubs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Your Hubs</h2>
            <div className="flex items-center gap-4">
              <Link href="/hubs" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-0 overflow-y-auto flex-grow bg-slate-50/50">
            {loadingHubs ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : hubs?.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-slate-500">
                <Server className="w-12 h-12 mb-2 opacity-20" />
                <p>No hubs assigned</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {hubs?.slice(0, 5).map((hub) => (
                  <div key={hub.reference} className="p-4 hover:bg-white transition-colors flex items-center justify-between">
                    <div>
                      <Link href={`/hubs/${hub.reference}`} className="font-medium text-slate-900 flex items-center gap-2 hover:text-blue-600 transition-colors">
                        {hub.name}
                        {hub.is_active ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" title="Inactive"></span>
                        )}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1">{hub.code} • {hub.country}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full border",
                      hub.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                      {hub.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Your Projects</h2>
          </div>
          <div className="p-0 overflow-y-auto flex-grow bg-slate-50/50">
            {loadingProjects ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : projects?.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-slate-500">
                <FolderKanban className="w-12 h-12 mb-2 opacity-20" />
                <p>No projects configured</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {projects?.slice(0, 5).map((project) => (
                  <div key={project.reference} className="p-4 hover:bg-white transition-colors flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 flex items-center gap-2">
                        {project.name}
                        {project.is_active ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-300" title="Inactive"></span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">{project.code} • Hub: {project.hub}</p>
                    </div>
                    <span className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded-full border",
                      project.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                      {project.is_active ? "Active" : "Archived"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}