"use client";

import { useState } from "react";
import { useFetchHubs } from "@/hooks/hubs/actions";
import { SlideOver } from "@/components/portal/SlideOver";
import UpdateHubForm from "@/forms/hubs/UpdateHub";
import { Hub } from "@/services/hubs";
import { Search, Edit2, Loader2, Server } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HubsPage() {
  const { data: hubs, isLoading } = useFetchHubs();
  const [searchTerm, setSearchTerm] = useState("");
  
  // SlideOver state
  const [editingHub, setEditingHub] = useState<Hub | null>(null);

  const filteredHubs = hubs?.filter(hub => 
    hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hub.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hub.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Infrastructure Hubs</h1>
          <p className="text-slate-500 mt-1">Manage client infrastructure deployments</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hubs by name, code, or country..."
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
          ) : filteredHubs?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
              <Server className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-900">No hubs found</p>
              <p className="text-sm">Try adjusting your search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Hub Name</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHubs?.map((hub) => (
                  <tr key={hub.reference} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{hub.name}</p>
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">{hub.billing_email || "No billing email"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {hub.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {hub.country}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border",
                        hub.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        {hub.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditingHub(hub)}
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
        isOpen={!!editingHub}
        onClose={() => setEditingHub(null)}
        title="Update Hub Details"
        description="Modify infrastructure hub configurations and billing information."
      >
        {editingHub && (
          <UpdateHubForm 
            hub={editingHub} 
            onSuccess={() => setEditingHub(null)} 
            onCancel={() => setEditingHub(null)} 
          />
        )}
      </SlideOver>
    </div>
  );
}