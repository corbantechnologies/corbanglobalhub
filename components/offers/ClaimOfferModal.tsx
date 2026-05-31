"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

interface ClaimOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offerTitle: string;
  offerSlug: string;
}

export function ClaimOfferModal({
  isOpen,
  onClose,
  offerTitle,
  offerSlug,
}: ClaimOfferModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    whatsapp: "",
    email: "",
    website_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, offerTitle, offerSlug }),
      });

      if (response.ok) {
        setSuccess(true);
      }
    } catch (error) {
      toast.error("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
        <div className="relative w-full sm:max-w-md rounded border-none p-12 text-center space-y-8 animate-in zoom-in-95 duration-300 bg-white" onClick={(e) => e.stopPropagation()}>
          <div className="w-24 h-24 bg-corporate-primary/10 rounded flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-corporate-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Claim Received!</h2>
            <p className="font-semibold opacity-60 leading-relaxed">
              Thank you,{" "}
              <span className="text-corporate-primary">
                {formData.userName}
              </span>
              . Our team will contact you shortly via{" "}
              {formData.whatsapp || formData.phone} to finalize your request.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-corporate-primary hover:bg-orange-600 text-white rounded py-8 font-semibold uppercase tracking-widest text-[10px]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="relative w-full overflow-y-auto max-h-[90vh] sm:max-w-lg rounded border-none p-0 shadow-2xl animate-in fade-in zoom-in-95 duration-300 bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          {/* Header Backdrop */}
          <div className="bg-black p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-corporate-primary/20 rounded blur-[60px] translate-x-1/2 -translate-y-1/2" />
            <Sparkles className="w-12 h-12 text-corporate-primary mb-6 animate-pulse" />
            <h2 className="text-xl font-semibold leading-tight mb-2 tracking-tighter">
              Claim Your Exclusive <br />
              <span className="text-corporate-primary italic">
                Opportunity.
              </span>
            </h2>
            <p className="text-white/40 font-semibold uppercase tracking-widest text-[10px]">
              {offerTitle}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-12 space-y-8 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 flex flex-col items-start">
                <label
                  htmlFor="userName"
                  className="font-semibold uppercase tracking-widest text-[10px] opacity-40 ml-1"
                >
                  Your Full Name
                </label>
                <input
                  id="userName"
                  required
                  placeholder="e.g. John Doe"
                  className="w-full rounded border-black/5 bg-corporate-secondary py-6 px-6 font-semibold focus:ring-corporate-primary/30 focus:outline-none focus:ring-1"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3 flex flex-col items-start">
                <label
                  htmlFor="phone"
                  className="font-semibold uppercase tracking-widest text-[10px] opacity-40 ml-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  required
                  placeholder="+254..."
                  className="w-full rounded border-black/5 bg-corporate-secondary py-6 px-6 font-semibold focus:ring-corporate-primary/30 focus:outline-none focus:ring-1"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 flex flex-col items-start">
                <label
                  htmlFor="whatsapp"
                  className="font-semibold uppercase tracking-widest text-[10px] opacity-40 ml-1"
                >
                  WhatsApp (Optional)
                </label>
                <input
                  id="whatsapp"
                  placeholder="If different from phone"
                  className="w-full rounded border-black/5 bg-corporate-secondary py-6 px-6 font-semibold focus:outline-none focus:ring-1"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3 flex flex-col items-start">
                <label
                  htmlFor="email"
                  className="font-semibold uppercase tracking-widest text-[10px] opacity-40 ml-1"
                >
                  Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="For email confirmation"
                  className="w-full rounded border-black/5 bg-corporate-secondary py-6 px-6 font-semibold focus:outline-none focus:ring-1"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-corporate-primary hover:bg-orange-600 text-white rounded py-6 text-xl font-semibold shadow-2xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Claim This Offer"
                )}
              </button>
            </div>
            <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] opacity-30 italic">
              Our team will contact you within 24 hours.
            </p>
            {/* Honeypot field */}
            <input
              type="text"
              name="website_url"
              className="hidden absolute opacity-0 w-0 h-0 p-0 m-0 -z-50"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website_url}
              onChange={(e) =>
                setFormData({ ...formData, website_url: e.target.value })
              }
            />
          </form>
        </div>
      </div>
    </div>
  );
}
