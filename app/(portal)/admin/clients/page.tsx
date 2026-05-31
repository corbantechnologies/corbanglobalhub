"use client";

import { useState } from "react";
import { useFetchClients } from "@/hooks/accounts/actions";
import { Search, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientsPage() {
  const { data: clients, isLoading } = useFetchClients();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients?.filter(client => 
    client.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Corporate Clients</h1>
          <p className="text-slate-500 mt-1">Manage B2B enterprise clients and organizations</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients by name or email..."
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
          ) : filteredClients?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-900">No clients found</p>
              <p className="text-sm">Try adjusting your search terms.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients?.map((client, idx) => (
                  <tr key={client.member_code || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {client.first_name?.[0]}{client.last_name?.[0]}
                        </div>
                        <p className="font-semibold text-slate-900">{client.first_name} {client.last_name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full border",
                        client.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"
                      )}>
                        {client.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}