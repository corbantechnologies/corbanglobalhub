"use client";

import { use, useState } from "react";
import { useFetchHubBillingInvoice } from "@/hooks/hubbillinginvoices/actions";
import { useFetchActiveCompanyProfile } from "@/hooks/companyprofile/actions";
import { useFetchPaymentAccounts } from "@/hooks/paymentaccounts/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { ArrowLeft, Loader2, FileText, CheckCircle2, XCircle, Download, Printer, Receipt, Landmark, Smartphone, Edit } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SlideOver } from "@/components/portal/SlideOver";
import UpdateBillingInvoiceForm from "@/forms/billings/UpdateBillingInvoice";
import toast from "react-hot-toast";

export default function AdminInvoiceDetailPage({ params }: { params: Promise<{ billing_reference: string }> }) {
  const { billing_reference } = use(params);
  const { data: invoice, isLoading: loadingInvoice } = useFetchHubBillingInvoice(billing_reference);
  const { data: company, isLoading: loadingCompany } = useFetchActiveCompanyProfile();
  const { data: paymentAccounts, isLoading: loadingAccounts } = useFetchPaymentAccounts();
  const header = useAxiosAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const isLoading = loadingInvoice || loadingCompany || loadingAccounts;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-slate-500">
        <FileText className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium text-slate-900">Invoice not found</p>
        <Link href="/admin/billings" className="text-blue-600 hover:underline mt-2">Return to Invoices</Link>
      </div>
    );
  }

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

  const handleDownloadInvoice = async () => {
    if (!invoice?.reference) return;
    
    try {
      setIsDownloading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      const response = await fetch(`${baseUrl}/api/v1/hubbillinginvoices/${invoice.reference}/download/`, {
        headers: {
          ...header.headers,
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${invoice.code}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.log(error)
      toast.error("There was an error downloading the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <Link 
            href={`/admin/hubs/${invoice.hub_details?.reference}`}
            className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors text-slate-500 hover:text-slate-900"
            title="Back to Hub"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Invoice {invoice.code}</h1>
              <span className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full border",
                getStatusBadge(invoice.status)
              )}>
                {invoice.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUpdateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Update Invoice
          </button>
          
          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Invoice Document (Printable Area) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 md:p-12 print:border-none print:shadow-none print:p-0 print:max-w-3xl print:mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          {/* Company Details (Left) */}
          <div className="space-y-4">
            {company ? (
              <>
                {company.logo_url && (
                  <img src={company.logo_url} alt={company.name} className="h-14 w-auto object-contain" />
                )}
                <div className="space-y-1">
                  {company.name && <p className="font-bold text-slate-900 text-lg">{company.name}</p>}
                  {[company.address, company.city, company.country].filter(Boolean).length > 0 && (
                    <p className="text-sm text-slate-600">
                      {[company.address, company.city, company.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {[company.email && `${company.email}`, company.phone && `${company.phone}`].filter(Boolean).length > 0 && (
                    <p className="text-sm text-slate-600">
                      {[company.email && `${company.email}`, company.phone && `${company.phone}`].filter(Boolean).join(' | ')}
                    </p>
                  )}
                  {company.tax_pin && (
                    <p className="text-sm text-slate-600">Tax PIN: <span className="font-mono">{company.tax_pin}</span></p>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-lg">Corban Technologies Ltd</p>
              </div>
            )}
          </div>
          
          {/* Invoice Details (Right) */}
          <div className="text-left md:text-right">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Invoice</h2>
            <div className="space-y-1 mt-4">
              <p className="text-sm text-slate-500">Invoice Number: <span className="font-mono font-medium text-slate-900">{invoice.code}</span></p>
              <p className="text-sm text-slate-500">Date of Issue: <span className="font-medium text-slate-900">{new Date(invoice.created_at).toLocaleDateString()}</span></p>
              <p className="text-sm text-slate-500">
                Billing Cycle: <span className="font-medium text-slate-900">
                  {new Date(invoice.billing_month).toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Billed To & Amount Due */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-8 border-b border-slate-200 mb-10">
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billed To</p>
            {invoice.hub_details ? (
              <div className="space-y-1">
                <p className="text-xl text-slate-900 font-bold">
                  {invoice.hub_details.name}
                </p>
                <p className="text-sm text-slate-600 max-w-sm">
                  {invoice.hub_details.billing_address}
                </p>
                <p className="text-sm text-slate-600">
                  Tax PIN: <span className="font-mono text-slate-900">{invoice.hub_details.tax_pin}</span>
                </p>
              </div>
            ) : (
              <p className="text-xl text-slate-900 font-bold">{invoice.hub}</p>
            )}
          </div>
          <div className="text-left md:text-right space-y-2 bg-slate-50 p-5 rounded-xl border border-slate-100 min-w-[240px] print:border-slate-200">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Due</p>
             <p className="text-3xl font-bold text-slate-900">
               KES {parseFloat(invoice.total_amount).toLocaleString('en-US', {
                 minimumFractionDigits: 2,
                 maximumFractionDigits: 2
               })}
             </p>
          </div>
        </div>

        {/* Invoice Lines */}
        <div className="mb-10">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invoice.lines && invoice.lines.length > 0 ? (
                  invoice.lines.map((line) => (
                    <tr key={line.reference} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{line.service_name}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {line.project_name}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">
                        {parseFloat(line.amount).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No line items found for this invoice.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-right font-bold text-slate-900 uppercase text-xs tracking-wider">Total Amount</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 text-lg">
                    KES {parseFloat(invoice.total_amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer: KRA Details & Payment Status */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 print:break-inside-avoid">
          {/* Payment Status & Instructions */}
          <div className="space-y-6 flex-1 w-full max-w-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Payment Status</h4>
              <div className="flex items-center gap-2">
                {invoice.status.toLowerCase() === "paid" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-amber-500" />
                )}
                <span className={cn(
                  "font-bold text-lg",
                  invoice.status.toLowerCase() === "paid" ? "text-emerald-700" : "text-amber-700"
                )}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            {invoice.status.toLowerCase() !== "paid" && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-sm print:hidden">
                <p className="font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider text-xs">
                  <Landmark className="w-4 h-4 text-slate-500" />
                  Payment Methods
                </p>
                
                {paymentAccounts && paymentAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {paymentAccounts.filter(acc => acc.is_active).map(acc => (
                      <div key={acc.reference} className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <p className="font-bold text-slate-800 mb-2">{acc.name}</p>
                        {acc.bank_name ? (
                          <div className="text-slate-600 text-sm space-y-1.5">
                            <p>Bank: <span className="font-medium text-slate-900">{acc.bank_name}</span> (Branch: {acc.branch})</p>
                            <p>Account Name: <span className="font-mono font-medium text-slate-900">{acc.name}</span></p>
                            <p>Account Number: <span className="font-mono font-medium text-slate-900">{acc.account_number}</span></p>
                            {acc.swift_code && <p>SWIFT Code: <span className="font-mono">{acc.swift_code}</span></p>}
                          </div>
                        ) : acc.paybill ? (
                          <div className="text-slate-600 text-sm space-y-1.5">
                            <p className="flex items-center gap-1.5 font-medium"><Smartphone className="w-4 h-4 text-emerald-500" /> M-PESA Paybill</p>
                            <p>Paybill Number: <span className="font-mono font-medium text-slate-900">{acc.paybill}</span></p>
                            <p>Account Number: <span className="font-mono font-medium text-slate-900">{invoice.code}</span></p>
                          </div>
                        ) : null}
                        {acc.instructions && (
                          <p className="text-xs text-slate-500 mt-3 italic bg-slate-50 p-2 rounded">{acc.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">No active payment methods configured.</p>
                )}
              </div>
            )}
          </div>

          {/* KRA Compliance */}
          {(invoice.kra_cu_invoice_number || invoice.kra_receipt) && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full md:w-80">
              <h4 className="text-xs font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-slate-400" />
                KRA Compliance Details
              </h4>
              <div className="space-y-4">
                {invoice.kra_cu_invoice_number && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1.5">CU Invoice Number</p>
                    <p className="font-mono text-sm font-medium text-slate-900 bg-white px-3 py-2 border border-slate-200 rounded-lg shadow-sm">{invoice.kra_cu_invoice_number}</p>
                  </div>
                )}
                
                {invoice.kra_receipt && (
                  <div className="pt-2 print:hidden">
                    <a 
                      href={invoice.kra_receipt} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      View KRA Receipt
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      <SlideOver
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        title="Update Invoice"
        description={`Modify status or KRA documents for ${invoice.code}`}
      >
        <UpdateBillingInvoiceForm 
          invoice={invoice} 
          onSuccess={() => setIsUpdateOpen(false)} 
          onCancel={() => setIsUpdateOpen(false)} 
        />
      </SlideOver>
    </div>
  );
}
