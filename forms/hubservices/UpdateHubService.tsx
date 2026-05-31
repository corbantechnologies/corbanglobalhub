"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateHubService, HubService } from "@/services/hubservices";
import { HubServiceSchema } from "@/validation";

interface UpdateHubServiceProps {
  service: HubService;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateHubServiceForm({ service, onSuccess, onCancel }: UpdateHubServiceProps) {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("base_price", data.base_price.toString());
      formData.append("currency", data.currency);
      formData.append("is_active", data.is_active ? "true" : "false");
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }
      return updateHubService(service.reference, formData as any, header);
    },
    onSuccess: () => {
      toast.success("Service updated successfully");
      queryClient.invalidateQueries({ queryKey: ["hubservices"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        "Failed to update service"
      );
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: service.name,
      description: service.description,
      base_price: service.base_price,
      currency: service.currency,
      is_active: service.is_active,
      image: null as File | null,
    },
    validationSchema: HubServiceSchema,
    onSubmit: (values) => {
      setLoading(true);
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Service Name</label>
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
        <label className="text-sm font-semibold text-slate-900 block">Description</label>
        <textarea
          name="description"
          rows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            "w-full p-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none",
            formik.touched.description && formik.errors.description && "border-red-500 bg-red-50"
          )}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.description as string}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">Base Price</label>
          <input
            name="base_price"
            type="number"
            min="0"
            step="0.01"
            value={formik.values.base_price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
              formik.touched.base_price && formik.errors.base_price && "border-red-500 bg-red-50"
            )}
          />
          {formik.touched.base_price && formik.errors.base_price && (
            <p className="text-xs font-semibold text-red-500">{formik.errors.base_price as string}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">Currency</label>
          <select
            name="currency"
            value={formik.values.currency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
              formik.touched.currency && formik.errors.currency && "border-red-500 bg-red-50"
            )}
          >
            <option value="KES">KES</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Update Image (Optional)</label>
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 relative group hover:bg-slate-100 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                formik.setFieldValue("image", file);
              }
            }}
          />
          <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mb-2 transition-colors" />
          <p className="text-sm text-slate-600 font-medium">
            {formik.values.image ? formik.values.image.name : "Click or drag new image to replace"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
        <div>
          <label className="text-sm font-semibold text-slate-900 block">Publish Service</label>
          <p className="text-xs text-slate-500">Make this service available to clients</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            className="sr-only peer"
            checked={formik.values.is_active}
            onChange={formik.handleChange}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
          Update Service
        </button>
      </div>
    </form>
  );
}