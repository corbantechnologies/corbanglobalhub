"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { updateHubProject, HubProject } from "@/services/hubprojects";
import { useFetchHubs } from "@/hooks/hubs/actions";
import { HubProjectSchema } from "@/validation";

interface UpdateHubProjectProps {
  project: HubProject;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpdateHubProjectForm({ project, onSuccess, onCancel }: UpdateHubProjectProps) {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  
  const { data: hubs, isLoading: loadingHubs } = useFetchHubs();

  const mutation = useMutation({
    mutationFn: (data: any) => updateHubProject(project.reference, data, header),
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["hubprojects"] });
      queryClient.invalidateQueries({ queryKey: ["hubproject"] });
      queryClient.invalidateQueries({ queryKey: ["hub"] });
      queryClient.invalidateQueries({ queryKey: ["hubs"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.error || 
        error?.response?.data?.message || 
        "Failed to update project"
      );
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const formik = useFormik({
    initialValues: {
      name: project.name,
      description: project.description,
      is_active: project.is_active,
      hub: project.hub,
    },
    validationSchema: HubProjectSchema,
    onSubmit: (values) => {
      setLoading(true);
      mutation.mutate(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Project Name</label>
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

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 block">Target Hub</label>
        <select
          name="hub"
          value={formik.values.hub}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={loadingHubs}
          className={cn(
            "w-full h-10 px-3 bg-white border border-slate-200 rounded text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
            formik.touched.hub && formik.errors.hub && "border-red-500 bg-red-50"
          )}
        >
          <option value="" disabled>Select a hub...</option>
          {hubs?.map(hub => (
            <option key={hub.reference} value={hub.code}>
              {hub.name} ({hub.code})
            </option>
          ))}
        </select>
        {formik.touched.hub && formik.errors.hub && (
          <p className="text-xs font-semibold text-red-500">{formik.errors.hub}</p>
        )}
      </div>

      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
        <div>
          <label className="text-sm font-semibold text-slate-900 block">Active Project</label>
          <p className="text-xs text-slate-500">Is this project currently active?</p>
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
          Update Project
        </button>
      </div>
    </form>
  );
}