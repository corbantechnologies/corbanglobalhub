"use client";

import { useState } from "react";
import { useFetchClients } from "@/hooks/accounts/actions";
import { useFetchHubs } from "@/hooks/hubs/actions";
import { useFetchHubServices } from "@/hooks/hubservices/actions";
import { Users, Server, Activity, ArrowRight, Loader2, Database, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SlideOver } from "@/components/portal/SlideOver";
import CreateHubServiceForm from "@/forms/hubservices/CreateHubService";
import CreateHubProjectForm from "@/forms/hubprojects/CreateHubProject";

export default function AdminDashboard() {
  const { data: clients, isLoading: loadingClients } = useFetchClients();
  const { data: hubs, isLoading: loadingHubs } = useFetchHubs();
  const { data: services, isLoading: loadingServices } = useFetchHubServices();

  const [isServiceSliderOpen, setIsServiceSliderOpen] = useState(false);
  const [isProjectSliderOpen, setIsProjectSliderOpen] = useState(false);

  const totalClients = clients?.length || 0;
  const totalHubs = hubs?.length || 0;
  const totalServices = services?.length || 0;

  const activeHubs = hubs?.filter(h => h.is_active).length || 0;

  const isLoading = loadingClients || loadingHubs || loadingServices;

  return (
    <div className="p-6 md:p-10 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of your Global Hub operations</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Clients Stat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="w-24 h-24 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Clients</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{isLoading ? "-" : totalClients}</h3>
            </div>
          </div>
        </div>

        {/* Hubs Stat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Server className="w-24 h-24 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
              <Server className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Active Hubs</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{isLoading ? "-" : activeHubs}</h3>
              <span className="text-sm text-slate-500">/ {totalHubs} total</span>
            </div>
          </div>
        </div>

        {/* Services Stat */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
            <Database className="w-24 h-24 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 border border-purple-100">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500 mb-1">Available Services</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold text-slate-900">{isLoading ? "-" : totalServices}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clients */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Recent Clients</h2>
            <div className="flex items-center gap-4">
              <Link href="/admin/clients" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-0 overflow-y-auto flex-grow bg-slate-50/50">
            {loadingClients ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : clients?.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-slate-500">
                <Users className="w-12 h-12 mb-2 opacity-20" />
                <p>No clients found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {clients?.slice(0, 5).map((client, i) => (
                  <div key={i} className="p-4 hover:bg-white transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {client.first_name?.[0]}{client.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{client.first_name} {client.last_name}</p>
                        <p className="text-sm text-slate-500">{client.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
                      Client
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hubs Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Infrastructure Hubs</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsProjectSliderOpen(true)} className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> New Project
              </button>
              <Link href="/admin/hubs" className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
                Manage Hubs <ArrowRight className="w-4 h-4" />
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
                <p>No hubs configured</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {hubs?.slice(0, 5).map((hub, i) => (
                  <div key={i} className="p-4 hover:bg-white transition-colors flex items-center justify-between">
                    <div>
                      <Link href={`/admin/hubs/${hub.reference}`} className="font-medium text-slate-900 flex items-center gap-2 hover:text-blue-600 transition-colors">
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

        {/* Hub Services Overview */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px] lg:col-span-2">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-semibold text-slate-900">Available Services</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsServiceSliderOpen(true)} className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> New Service
              </button>
              <Link href="/admin/hubservices" className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-grow bg-slate-50/50">
            {loadingServices ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : services?.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-full text-slate-500">
                <Database className="w-12 h-12 mb-2 opacity-20" />
                <p>No services found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services?.map((service, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-1 rounded text-sm">
                        {service.currency} {service.base_price}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        service.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      ) }>
                        {service.is_active ? "Active" : "Draft"}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{service.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SlideOver
        isOpen={isServiceSliderOpen}
        onClose={() => setIsServiceSliderOpen(false)}
        title="Create New Service"
        description="Add a new service offering to the Global Hub."
      >
        <CreateHubServiceForm 
          onSuccess={() => setIsServiceSliderOpen(false)} 
          onCancel={() => setIsServiceSliderOpen(false)} 
        />
      </SlideOver>

      <SlideOver
        isOpen={isProjectSliderOpen}
        onClose={() => setIsProjectSliderOpen(false)}
        title="Create New Project"
        description="Initialize a new client infrastructure project."
      >
        <CreateHubProjectForm 
          onSuccess={() => setIsProjectSliderOpen(false)} 
          onCancel={() => setIsProjectSliderOpen(false)} 
        />
      </SlideOver>
    </div>
  );
}