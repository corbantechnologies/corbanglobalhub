"use client";

import { useState } from "react";
import { useFetchHubProjectSubscriptions } from "@/hooks/hubprojectsubscriptions/actions";
import { SlideOver } from "@/components/portal/SlideOver";
import CreateHubProjectSubscriptionForm from "@/forms/hubprojectsubscriptions/CreateHubProjectSubscription";
import UpdateHubProjectSubscriptionForm from "@/forms/hubprojectsubscriptions/UpdateHubProjectSubscription";
import { HubProjectSubscription } from "@/services/hubprojectsubscriptions";
import { Plus, Search, Edit2, Loader2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HubProjectSubscriptionsPage() {
  const { data: subscriptions, isLoading } = useFetchHubProjectSubscriptions();
  const [searchTerm, setSearchTerm] = useState("");
  
  // SlideOver state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<HubProjectSubscription | null>(null);

  const filteredSubscriptions = subscriptions?.filter(sub => 
    sub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Project Subscriptions</h1>
          <p className="text-slate-500 mt-1">Manage service subscriptions for client projects</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Subscription
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredSubscriptions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
              <LinkIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-900">No subscriptions found</p>
              <p className="text-sm">Link a service to a project to create a subscription.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Custom Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubscriptions?.map((sub) => (
                  <tr key={sub.reference} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {sub.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-900">
                      {sub.project}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                      {sub.service}
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">
                      {sub.custom_price && parseFloat(sub.custom_price) > 0 
                        ? sub.custom_price 
                        : <span className="text-slate-400 font-normal italic">Default</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border",
                        sub.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        {sub.is_active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditingSubscription(sub)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <SlideOver
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="New Subscription"
        description="Link an available service to a client project."
      >
        <CreateHubProjectSubscriptionForm 
          onSuccess={() => setIsCreateOpen(false)} 
          onCancel={() => setIsCreateOpen(false)} 
        />
      </SlideOver>

      <SlideOver
        isOpen={!!editingSubscription}
        onClose={() => setEditingSubscription(null)}
        title="Update Subscription"
        description="Modify subscription details and custom pricing."
      >
        {editingSubscription && (
          <UpdateHubProjectSubscriptionForm 
            subscription={editingSubscription} 
            onSuccess={() => setEditingSubscription(null)} 
            onCancel={() => setEditingSubscription(null)} 
          />
        )}
      </SlideOver>
    </div>
  );
}
