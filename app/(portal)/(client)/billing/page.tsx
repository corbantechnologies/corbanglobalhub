"use client";

import { useState } from "react";
import { useFetchHubBillingInvoices } from "@/hooks/hubbillinginvoices/actions";
import { Search, Loader2, FileText, Eye, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ClientBillingPage() {
  const { data: invoices, isLoading } = useFetchHubBillingInvoices();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = 
      invoice.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.billing_month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.kra_cu_invoice_number && invoice.kra_cu_invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      case "unpaid":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-slate-500 mt-1">Manage your hub invoices and payments</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center gap-4 bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices by code, hub, or KRA PIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : filteredInvoices?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-slate-900">No invoices found</p>
              <p className="text-sm">We couldn't find any invoices matching your search.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Invoice Details</th>
                  <th className="px-6 py-4">Hub</th>
                  <th className="px-6 py-4">Billing Month</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount (KES)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices?.map((invoice) => (
                  <tr key={invoice.reference} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{invoice.code}</span>
                        {invoice.kra_cu_invoice_number && (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">KRA: {invoice.kra_cu_invoice_number}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {invoice.hub}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                      {new Date(invoice.billing_month).toLocaleDateString(undefined, {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full border",
                        getStatusBadge(invoice.status)
                      )}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      {parseFloat(invoice.total_amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <Link
                          href={`/billing/${invoice.reference}`}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Invoice Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
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