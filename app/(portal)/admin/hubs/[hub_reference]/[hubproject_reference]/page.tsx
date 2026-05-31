"use client";

import { useFetchHubProject } from "@/hooks/hubprojects/actions";
import { useFetchHubServices } from "@/hooks/hubservices/actions";
import { ArrowLeft, Loader2, FolderKanban, Activity, Link as LinkIcon, DollarSign, Plus, Search, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { use, useState } from "react";
import { SlideOver } from "@/components/portal/SlideOver";
import CreateHubProjectSubscriptionForm from "@/forms/hubprojectsubscriptions/CreateHubProjectSubscription";

export default function HubProjectDetailPage({ params }: { params: Promise<{ hub_reference: string, hubproject_reference: string }> }) {
  const { hub_reference, hubproject_reference } = use(params);
  
  const { data: project, isLoading: loadingProject } = useFetchHubProject(hubproject_reference);
  const { data: services, isLoading: loadingServices } = useFetchHubServices();

  const [isCreateSubscriptionOpen, setIsCreateSubscriptionOpen] = useState(false);
  const [searchSubscription, setSearchSubscription] = useState("");

  const isLoading = loadingProject || loadingServices;

  const filteredSubscriptions = project?.subscriptions?.filter(sub => 
    sub.code.toLowerCase().includes(searchSubscription.toLowerCase()) ||
    sub.service.toLowerCase().includes(searchSubscription.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-500">
        <FolderKanban className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-900">Project not found</p>
        <Link href={`/admin/hubs/${hub_reference}`} className="text-blue-600 hover:underline mt-2">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href={`/admin/hubs/${hub_reference}`}
          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{project.name}</h1>
            <span className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full border",
              project.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
            )}>
              {project.is_active ? "Active" : "Archived"}
            </span>
          </div>
          <p className="text-slate-500 mt-1 font-mono text-sm">Code: {project.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subscriptions Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Service Subscriptions</h2>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchSubscription}
                  onChange={(e) => setSearchSubscription(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
              <button
                onClick={() => setIsCreateSubscriptionOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>
          </div>

          {!filteredSubscriptions || filteredSubscriptions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <LinkIcon className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No Subscriptions Found</h3>
              <p className="text-slate-500 mt-1">This project doesn't have any service subscriptions yet.</p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Pricing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscriptions.map((sub) => {
                    const fullService = services?.find(s => s.code === sub.service);
                    const hasCustomPrice = sub.custom_price && parseFloat(sub.custom_price) > 0;
                    
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                              <Activity className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">
                                {fullService ? fullService.name : sub.service}
                              </p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">Ref: {sub.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {sub.is_active ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-amber-500" />
                            )}
                            <span className={cn(
                              "font-medium",
                              sub.is_active ? "text-emerald-700" : "text-amber-700"
                            )}>
                              {sub.is_active ? "Active" : "Suspended"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-semibold text-slate-900 flex items-center gap-1 text-base">
                              {hasCustomPrice ? (
                                <><DollarSign className="w-4 h-4 text-slate-400" /> {sub.custom_price}</>
                              ) : (
                                fullService ? `${fullService.currency} ${fullService.base_price}` : "Standard"
                              )}
                            </span>
                            {hasCustomPrice && (
                              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded mt-1 font-medium border border-blue-100">Custom Rate</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Project Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              Project Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Description</p>
                <p className="text-sm text-slate-600">{project.description || "No description provided."}</p>
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-900 mb-1">Target Hub</p>
                <p className="text-sm text-slate-600 font-mono">{project.hub}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-900 mb-1">Created At</p>
                <p className="text-sm text-slate-600">
                  {new Date(project.created_at).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideOver
        isOpen={isCreateSubscriptionOpen}
        onClose={() => setIsCreateSubscriptionOpen(false)}
        title="Add Service Subscription"
        description={`Attach a new service to ${project.name}.`}
      >
        <CreateHubProjectSubscriptionForm 
          preselectedProjectCode={project.code}
          onSuccess={() => setIsCreateSubscriptionOpen(false)} 
          onCancel={() => setIsCreateSubscriptionOpen(false)} 
        />
      </SlideOver>
    </div>
  );
}