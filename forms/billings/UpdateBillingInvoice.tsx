"use client";

import { useFormik } from "formik";
import { useUpdateHubBillingInvoice } from "@/hooks/hubbillinginvoices/actions";
import { HubBillingInvoice } from "@/services/hubbillinginvoices";
import { Loader2, Upload, FileText } from "lucide-react";
import { toast } from "react-hot-toast";

interface UpdateBillingInvoiceProps {
  invoice: HubBillingInvoice;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UpdateInvoiceFormValues {
  status: string;
  kra_cu_invoice_number: string;
  kra_receipt: File | null;
}

export default function UpdateBillingInvoiceForm({ invoice, onSuccess, onCancel }: UpdateBillingInvoiceProps) {
  const { mutateAsync: updateInvoice } = useUpdateHubBillingInvoice();

  const formik = useFormik<UpdateInvoiceFormValues>({
    initialValues: {
      status: invoice.status,
      kra_cu_invoice_number: invoice.kra_cu_invoice_number || "",
      kra_receipt: null,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        if (values.status !== invoice.status) {
          formData.append("status", values.status);
        }
        if (values.kra_cu_invoice_number !== invoice.kra_cu_invoice_number) {
          formData.append("kra_cu_invoice_number", values.kra_cu_invoice_number);
        }
        if (values.kra_receipt) {
          formData.append("kra_receipt", values.kra_receipt);
        }

        // Only send request if something changed
        let hasChanges = false;
        for (const [key] of formData.entries()) {
          hasChanges = true;
          break;
        }

        if (hasChanges) {
          await updateInvoice({ reference: invoice.reference, data: formData });
          toast.success("Invoice updated successfully");
        }
        
        onSuccess?.();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update invoice");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Payment Status
          </label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            KRA CU Invoice Number
          </label>
          <input
            type="text"
            name="kra_cu_invoice_number"
            value={formik.values.kra_cu_invoice_number}
            onChange={formik.handleChange}
            placeholder="e.g. 123456789"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            KRA Receipt Upload
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  formik.setFieldValue("kra_receipt", e.target.files[0]);
                }
              }}
            />
            <div className="space-y-1 text-center">
              {formik.values.kra_receipt ? (
                <div className="flex flex-col items-center">
                  <FileText className="mx-auto h-12 w-12 text-blue-500" />
                  <p className="mt-2 text-sm text-slate-600 font-medium">
                    {formik.values.kra_receipt.name}
                  </p>
                  <p className="text-xs text-slate-500">Click to change</p>
                </div>
              ) : invoice.kra_receipt ? (
                <div className="flex flex-col items-center">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-2 text-sm text-slate-600 font-medium">
                    Receipt currently uploaded
                  </p>
                  <p className="text-xs text-blue-600 group-hover:text-blue-500">
                    Upload new to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-slate-500 transition-colors" />
                  <div className="flex text-sm text-slate-600 mt-2">
                    <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={formik.isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {formik.isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {formik.isSubmitting ? "Updating..." : "Update Invoice"}
        </button>
      </div>
    </form>
  );
}