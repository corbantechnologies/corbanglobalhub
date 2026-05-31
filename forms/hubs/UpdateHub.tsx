"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateHub, Hub } from "@/services/hubs";
import { UpdateHubSchema } from "@/validation";

interface UpdateHubProps {
  hub: Hub;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateHubForm({ hub, onSuccess, onCancel }: UpdateHubProps) {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: any) => updateHub(hub.reference, data, header),
    onSuccess: () => {
      toast.success("Hub updated successfully");
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        "Failed to update hub"
      );
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: hub.name,
      is_active: hub.is_active,
      tax_pin: hub.tax_pin || "",
      billing_address: hub.billing_address || "",
      billing_email: hub.billing_email || "",
      requires_kra_invoice: hub.requires_kra_invoice,
    },
    validationSchema: UpdateHubSchema,
    onSubmit: (values) => {
      setLoading(true);
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Hub Name</label>
        <input
          name="name"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
            formik.touched.name && formik.errors.name && "border-red-500 bg-red-50"
          )}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Tax PIN</label>
        <input
          name="tax_pin"
          type="text"
          value={formik.values.tax_pin}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
            formik.touched.tax_pin && formik.errors.tax_pin && "border-red-500 bg-red-50"
          )}
        />
        {formik.touched.tax_pin && formik.errors.tax_pin && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.tax_pin}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Billing Address</label>
        <input
          name="billing_address"
          type="text"
          value={formik.values.billing_address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
            formik.touched.billing_address && formik.errors.billing_address && "border-red-500 bg-red-50"
          )}
        />
        {formik.touched.billing_address && formik.errors.billing_address && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.billing_address}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Billing Email</label>
        <input
          name="billing_email"
          type="email"
          value={formik.values.billing_email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
            formik.touched.billing_email && formik.errors.billing_email && "border-red-500 bg-red-50"
          )}
        />
        {formik.touched.billing_email && formik.errors.billing_email && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.billing_email}</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
        <div>
          <label className="text-sm font-semibold text-slate-900 block">Requires KRA Invoice</label>
          <p className="text-xs text-slate-500">Enable if the client requires official tax invoices</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="requires_kra_invoice"
            className="sr-only peer"
            checked={formik.values.requires_kra_invoice}
            onChange={formik.handleChange}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
        <div>
          <label className="text-sm font-semibold text-slate-900 block">Active Status</label>
          <p className="text-xs text-slate-500">Is this hub currently active?</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            className="sr-only peer"
            checked={formik.values.is_active}
            onChange={formik.handleChange}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
