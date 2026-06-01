import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, Receipt, Landmark, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

// Interfaces to type the response
interface HubBillingInvoice {
    hub: string;
    billing_month: string;
    total_amount: string;
    status: string;
    kra_receipt: string;
    kra_cu_invoice_number: string;
    code: string;
    created_at: string;
    reference: string;
    lines: {
      service_name: string;
      project_name: string;
      amount: string;
      reference: string;
    }[];
    hub_details: {
      name: string;
      billing_address: string;
      tax_pin: string;
    };
}

interface CompanyProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    tax_pin: string;
    logo_url: string;
}

interface PaymentAccount {
    name: string;
    bank_name: string;
    branch: string;
    account_number: string;
    swift_code: string;
    paybill: string;
    instructions: string;
    reference: string;
    is_active: boolean;
}

interface PrintData {
  invoice: HubBillingInvoice;
  company: CompanyProfile | null;
  payment_accounts: PaymentAccount[];
}

export default async function PrintInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { reference } = await params;
  const { token } = await searchParams;

  if (!token) {
    return <div className="p-10 font-bold text-red-500">Access Denied: Missing Token</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  
  const res = await fetch(`${baseUrl}/api/v1/hubbillinginvoices/${reference}/print_data/?token=${token}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    return (
      <div className="p-10 font-bold text-red-500">
        Failed to load invoice or invalid token.
      </div>
    );
  }

  const data: PrintData = await res.json();
  const { invoice, company, payment_accounts: paymentAccounts } = data;

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

  // Render the exact same document layout but without headers, navs, or print buttons.
  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans p-10 max-w-5xl mx-auto">
      <div className="bg-white p-2">
        {/* Invoice Header details */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-100 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h2>
            <div className="mb-6 pb-4 border-b border-slate-100">
              <p className="text-slate-500 mb-1">Code: <span className="font-mono text-slate-900">{invoice.code}</span></p>
              <p className="text-slate-500">
                Billing Cycle: <span className="font-semibold text-slate-900">
                  {new Date(invoice.billing_month).toLocaleDateString(undefined, {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </p>
            </div>

            {company ? (
              <div className="space-y-1">
                {company.logo_url && (
                  <img src={company.logo_url} alt={company.name} className="h-10 w-auto object-contain mb-3" />
                )}
                {company.name && <p className="font-semibold text-slate-900">{company.name}</p>}
                
                {[company.address, company.city, company.country].filter(Boolean).length > 0 && (
                  <p className="text-sm text-slate-600">
                    {[company.address, company.city, company.country].filter(Boolean).join(', ')}
                  </p>
                )}
                
                {[company.email && `Email: ${company.email}`, company.phone && `Phone: ${company.phone}`].filter(Boolean).length > 0 && (
                  <p className="text-sm text-slate-600">
                    {[company.email && `Email: ${company.email}`, company.phone && `Phone: ${company.phone}`].filter(Boolean).join(' | ')}
                  </p>
                )}
                
                {company.tax_pin && (
                  <p className="text-sm text-slate-600">Tax PIN: <span className="font-mono">{company.tax_pin}</span></p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">Corban Technologies Ltd</p>
              </div>
            )}
          </div>
          
          <div className="text-left md:text-right">
            <p className="text-sm font-semibold text-slate-900 mb-1">Billed To</p>
            {invoice.hub_details ? (
              <div className="space-y-1">
                <p className="text-lg text-slate-700 font-medium">
                  {invoice.hub_details.name}
                </p>
                <p className="text-sm text-slate-600 max-w-xs ml-auto">
                  {invoice.hub_details.billing_address}
                </p>
                <p className="text-sm text-slate-600">
                  Tax PIN: <span className="font-mono">{invoice.hub_details.tax_pin}</span>
                </p>
              </div>
            ) : (
              <p className="text-lg text-slate-700 font-medium">{invoice.hub}</p>
            )}
            <p className="text-sm text-slate-500 mt-3">
              Issued: {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Invoice Lines */}
        <div className="py-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Itemized Services</h3>
          
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="px-6 py-4 font-semibold">Service</th>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.lines && invoice.lines.length > 0 ? (
                  invoice.lines.map((line) => (
                    <tr key={line.reference}>
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
                  <td colSpan={2} className="px-6 py-4 text-right font-bold text-slate-900">Total Amount</td>
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

        {/* Payment Methods & Footer */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-6 border-t border-slate-100">
          <div className="space-y-4 flex-1 w-full max-w-2xl">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Payment Status</h4>
              <div className="flex items-center gap-2">
                {invoice.status.toLowerCase() === "paid" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-500" />
                )}
                <span className={cn(
                  "font-medium",
                  invoice.status.toLowerCase() === "paid" ? "text-emerald-700" : "text-amber-700"
                )}>
                  {invoice.status}
                </span>
              </div>
            </div>
            
            {invoice.status.toLowerCase() !== "paid" && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm">
                <p className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-slate-500" />
                  Payment Methods
                </p>
                
                {paymentAccounts && paymentAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {paymentAccounts.filter(acc => acc.is_active).map(acc => (
                      <div key={acc.reference} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <p className="font-semibold text-slate-800 mb-1">{acc.name}</p>
                        {acc.bank_name ? (
                          <div className="text-slate-600 text-xs space-y-1">
                            <p>Bank: <span className="font-medium text-slate-900">{acc.bank_name}</span> (Branch: {acc.branch})</p>
                             <p>Account Name: <span className="font-mono font-medium text-slate-900">{acc.name}</span></p>
                            <p>Account Number: <span className="font-mono font-medium text-slate-900">{acc.account_number}</span></p>
                            {acc.swift_code && <p>SWIFT Code: <span className="font-mono">{acc.swift_code}</span></p>}
                          </div>
                        ) : acc.paybill ? (
                          <div className="text-slate-600 text-xs space-y-1">
                            <p className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-emerald-500" /> M-PESA Paybill</p>
                            <p>Paybill Number: <span className="font-mono font-medium text-slate-900">{acc.paybill}</span></p>
                            <p>Account Number: <span className="font-mono font-medium text-slate-900">{invoice.code}</span></p>
                          </div>
                        ) : null}
                        {acc.instructions && (
                          <p className="text-xs text-slate-500 mt-2 italic">{acc.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">Please contact billing support to get payment instructions.</p>
                )}
              </div>
            )}
          </div>

          {(invoice.kra_cu_invoice_number) && (
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full md:w-80">
              <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-400" />
                KRA Compliance Details
              </h4>
              <div className="space-y-3">
                {invoice.kra_cu_invoice_number && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">CU Invoice Number</p>
                    <p className="font-mono text-sm text-slate-900 bg-white px-2 py-1 border border-slate-200 rounded">{invoice.kra_cu_invoice_number}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
