"use client";

import { useFetchHub } from "@/hooks/hubs/actions";
import { useFetchHubServices } from "@/hooks/hubservices/actions";
import { ArrowLeft, Loader2, Server, FolderKanban, Activity, CheckCircle2, XCircle, Building2, MapPin, Receipt, Mail, DollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { use, useState } from "react";
import { SlideOver } from "@/components/portal/SlideOver";
import CreateHubProjectForm from "@/forms/hubprojects/CreateHubProject";

export default function HubDetailPage({ params }: { params: Promise<{ hub_reference: string }> }) {
  const { hub_reference } = use(params);
  const { data: hub, isLoading: loadingHub } = useFetchHub(hub_reference);
  const { data: services, isLoading: loadingServices } = useFetchHubServices();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const isLoading = loadingHub || loadingServices;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-500">
        <Server className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-900">Hub not found</p>
        <Link href="/admin/hubs" className="text-blue-600 hover:underline mt-2">Return to Hubs</Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/hubs"
          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{hub.name}</h1>
            <span className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full border",
              hub.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
            )}>
              {hub.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-slate-500 mt-1 font-mono text-sm">Code: {hub.code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Projects and Subscriptions Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Projects & Subscriptions</h2>
            <button
              onClick={() => setIsCreateProjectOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {!hub.hubprojects || hub.hubprojects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <FolderKanban className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No Projects Found</h3>
              <p className="text-slate-500 mt-1">This hub does not have any projects configured yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {hub.hubprojects.map((project) => (
                <div key={project.code} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                        {!project.is_active && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600">Archived</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{project.description}</p>
                      <p className="text-xs text-slate-400 font-mono mt-2">Code: {project.code}</p>
                    </div>
                  </div>

                  <div className="p-0">
                    {!project.subscriptions || project.subscriptions.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 text-sm">
                        No active service subscriptions for this project.
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-3 font-medium">Service</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Pricing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {project.subscriptions.map((sub) => {
                            const fullService = services?.find(s => s.code === sub.service);
                            const hasCustomPrice = sub.custom_price && parseFloat(sub.custom_price) > 0;
                            
                            return (
                              <tr key={sub.code} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                      <Activity className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900">
                                        {fullService ? fullService.name : sub.service}
                                      </p>
                                      <p className="text-xs text-slate-400 font-mono">Ref: {sub.code}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5">
                                    <div className={cn(
                                      "w-1.5 h-1.5 rounded-full",
                                      sub.is_active ? "bg-emerald-500" : "bg-amber-500"
                                    )} />
                                    <span className="text-slate-600">{sub.is_active ? "Active" : "Suspended"}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="font-medium text-slate-900 flex items-center gap-1">
                                      {hasCustomPrice ? (
                                        <><DollarSign className="w-3.5 h-3.5 text-slate-400" /> {sub.custom_price}</>
                                      ) : (
                                        fullService ? `${fullService.currency} ${fullService.base_price}` : "Standard"
                                      )}
                                    </span>
                                    {hasCustomPrice && (
                                      <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded mt-1">Custom Rate</span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hub Information Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Hub Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Country / Region</p>
                  <p className="text-sm text-slate-600">{hub.country}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Billing Email</p>
                  <p className="text-sm text-slate-600">{hub.billing_email || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Receipt className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Tax PIN</p>
                  <p className="text-sm text-slate-600">{hub.tax_pin || "Not provided"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-900 mb-2">Billing Requirements</p>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {hub.requires_kra_invoice ? (
                    <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Requires KRA Invoice</>
                  ) : (
                    <><XCircle className="w-4 h-4 text-slate-400" /> Standard Invoicing</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideOver
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        title="Create New Project"
        description={`Create a new infrastructure project for ${hub.name}.`}
      >
        <CreateHubProjectForm 
          preselectedHubCode={hub.code}
          onSuccess={() => setIsCreateProjectOpen(false)} 
          onCancel={() => setIsCreateProjectOpen(false)} 
        />
      </SlideOver>
    </div>
  );
}