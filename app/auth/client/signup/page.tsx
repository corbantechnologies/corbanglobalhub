"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import { ClientSignupSchema } from "@/validation";
import { createClient } from "@/services/accounts";

export default function Signup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      country: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: ClientSignupSchema,
    onSubmit: async (values) => {
      setLoading(true);

      try {
        await createClient({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          country: values.country,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });

        toast.success("Account created successfully. Please log in.");
        router.push("/auth/login");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || 
          error?.response?.data?.message || 
          error?.response?.data?.detail ||
          "Failed to create account. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Create Account</h2>
        <p className="text-sm text-slate-500">Sign up to access the Corban Global Hub.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 block">
              First Name
            </label>
            <input
              name="first_name"
              type="text"
              required
              placeholder="John"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "w-full h-11 px-4 bg-blue-50/40 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
                formik.touched.first_name && formik.errors.first_name && "border-red-500 bg-red-50"
              )}
            />
            {formik.touched.first_name && formik.errors.first_name && (
              <p className="text-xs font-semibold text-red-500">
                {formik.errors.first_name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-900 block">
              Last Name
            </label>
            <input
              name="last_name"
              type="text"
              required
              placeholder="Doe"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "w-full h-11 px-4 bg-blue-50/40 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
                formik.touched.last_name && formik.errors.last_name && "border-red-500 bg-red-50"
              )}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <p className="text-xs font-semibold text-red-500">
                {formik.errors.last_name}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="johndoe@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              "w-full h-11 px-4 bg-blue-50/40 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
              formik.touched.email && formik.errors.email && "border-red-500 bg-red-50"
            )}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs font-semibold text-red-500">
              {formik.errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">
            Country
          </label>
          <input
            name="country"
            type="text"
            required
            placeholder="Kenya"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              "w-full h-11 px-4 bg-blue-50/40 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
              formik.touched.country && formik.errors.country && "border-red-500 bg-red-50"
            )}
          />
          {formik.touched.country && formik.errors.country && (
            <p className="text-xs font-semibold text-red-500">
              {formik.errors.country}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "w-full h-11 pl-4 pr-11 bg-blue-50/40 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
                formik.touched.password && formik.errors.password && "border-red-500 bg-red-50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs font-semibold text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 block">
            Confirm Password
          </label>
          <div className="relative">
            <input
              name="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "w-full h-11 pl-4 pr-11 bg-blue-50/40 border border-slate-200 rounded text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
                formik.touched.password_confirmation && formik.errors.password_confirmation && "border-red-500 bg-red-50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formik.touched.password_confirmation && formik.errors.password_confirmation && (
            <p className="text-xs font-semibold text-red-500">
              {formik.errors.password_confirmation}
            </p>
          )}
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full h-11 mt-6 bg-[#2170ed] hover:bg-blue-600 text-white rounded font-semibold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 text-center text-sm font-medium text-slate-500 border-t border-slate-100">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-blue-500 hover:text-blue-600 font-semibold"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}