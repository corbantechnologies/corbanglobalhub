"use client";

import { useState } from "react";
import { useFetchHubBillingInvoices } from "@/hooks/hubbillinginvoices/actions";
import { Loader2, FileText, Search, Download, Filter } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminBillingsPage() {
  const { data: invoices, isLoading } = useFetchHubBillingInvoices();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const filteredInvoices = invoices?.filter((invoice) => {
    const matchesSearch = 
      invoice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.hub_details?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || invoice.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing Invoices</h1>
          <p className="text-slate-500 mt-1">Manage and track all hub invoices across the system.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice code or hub name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {!filteredInvoices || filteredInvoices.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Invoices Found</h3>
            <p className="text-slate-500 mt-1">No invoices match your current search and filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Hub</th>
                  <th className="px-6 py-4">Billing Month</th>
                  <th className="px-6 py-4 text-right">Amount (KES)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.reference} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/billings/${invoice.reference}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors block">
                        {invoice.code}
                      </Link>
                      <span className="text-xs text-slate-500 mt-1">Issued: {new Date(invoice.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/hubs/${invoice.hub_details?.reference}`} className="font-medium text-slate-700 hover:text-blue-600 transition-colors">
                        {invoice.hub_details?.name || invoice.hub}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(invoice.billing_month).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">
                      {parseFloat(invoice.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "text-[11px] font-semibold px-2.5 py-1 rounded-full border inline-block min-w-[70px]",
                        invoice.status.toLowerCase() === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        invoice.status.toLowerCase() === "overdue" ? "bg-red-50 text-red-700 border-red-200" :
                        "bg-amber-50 text-amber-700 border-amber-200"
                      )}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}