export default function BillingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-4">
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Billing & Invoices</h1>
      <p className="text-lg text-slate-500 max-w-md">
        This feature is coming soon. You will be able to view your invoices, manage payment methods, and handle billing details here.
      </p>
    </div>
  );
}