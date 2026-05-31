"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createHubProjectSubscription } from "@/services/hubprojectsubscriptions";
import { useFetchHubProjects } from "@/hooks/hubprojects/actions";
import { useFetchHubServices } from "@/hooks/hubservices/actions";
import { HubProjectSubscriptionSchema } from "@/validation";

interface CreateHubProjectSubscriptionProps {
  onSuccess: () => void;
  onCancel: () => void;
  preselectedProjectCode?: string;
}

export default function CreateHubProjectSubscriptionForm({ onSuccess, onCancel, preselectedProjectCode }: CreateHubProjectSubscriptionProps) {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  
  const { data: projects, isLoading: loadingProjects } = useFetchHubProjects();
  const { data: services, isLoading: loadingServices } = useFetchHubServices();

  const mutation = useMutation({
    mutationFn: (data: any) => createHubProjectSubscription(data, header),
    onSuccess: () => {
      toast.success("Subscription created successfully");
      queryClient.invalidateQueries({ queryKey: ["hubprojectsubscriptions"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        "Failed to create subscription"
      );
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      project: preselectedProjectCode || "",
      service: "",
      is_active: true,
      custom_price: 0,
    },
    validationSchema: HubProjectSubscriptionSchema,
    onSubmit: (values) => {
      setLoading(true);
      mutation.mutate({
        ...values,
        custom_price: values.custom_price.toString()
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Target Project</label>
        <select
          name="project"
          value={formik.values.project}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loadingProjects || !!preselectedProjectCode}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 disabled:bg-slate-50",
            formik.touched.project && formik.errors.project && "border-red-500 bg-red-50"
          )}
        >
          <option value="" disabled>Select a project...</option>
          {projects?.map(project => (
            <option key={project.reference} value={project.code}>
              {project.name} ({project.code})
            </option>
          ))}
        </select>
        {formik.touched.project && formik.errors.project && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.project}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Service</label>
        <select
          name="service"
          value={formik.values.service}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loadingServices}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:opacity-50 disabled:bg-slate-50",
            formik.touched.service && formik.errors.service && "border-red-500 bg-red-50"
          )}
        >
          <option value="" disabled>Select a service...</option>
          {services?.map(svc => (
            <option key={svc.reference} value={svc.code}>
              {svc.name} - {svc.currency} {svc.base_price}
            </option>
          ))}
        </select>
        {formik.touched.service && formik.errors.service && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.service}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Custom Price (Optional)</label>
        <p className="text-xs text-slate-500 mb-1">Leave as 0 to use the service's default base price</p>
        <input
          name="custom_price"
          type="number"
          min="0"
          step="0.01"
          value={formik.values.custom_price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
            formik.touched.custom_price && formik.errors.custom_price && "border-red-500 bg-red-50"
          )}
        />
        {formik.touched.custom_price && formik.errors.custom_price && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.custom_price as string}</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
        <div>
          <label className="text-sm font-semibold text-slate-900 block">Active Subscription</label>
          <p className="text-xs text-slate-500">Enable to activate this service immediately</p>
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
          Subscribe
        </button>
      </div>
    </form>
  );
}