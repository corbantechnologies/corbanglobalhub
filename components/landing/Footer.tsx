import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Github, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-corporate-primary to-transparent opacity-30"></div>

      <div className="mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Company Info */}
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Corban Technologies Logo"
              width={160}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            Designing and deploying world-class digital infrastructure that
            powers the future of finance and enterprise in East Africa.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/corbantechltd"
              className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600 hover:bg-corporate-primary hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <a
              href="https://github.com/corbantechnologies"
              className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-600 hover:bg-corporate-primary hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-5">
            Company
          </h4>
          <ul className="space-y-3">
            {["Divisions", "About", "Contact"].map(
              (item) => (
                <li key={item}>
                  <Link
                    href={item === "Divisions" ? "/divisions" : `/${item.toLowerCase()}`}
                    className="text-slate-500 hover:text-corporate-primary text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="text-slate-900 font-semibold mb-5">
            Solutions
          </h4>
          <ul className="space-y-3">
            {[
              { name: "Financial Systems", href: "/divisions" },
              { name: "Cloud Infrastructure", href: "/divisions" },
              { name: "Cybersecurity", href: "/divisions" },
              { name: "Enterprise Software", href: "/divisions" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-slate-500 hover:text-corporate-primary text-sm transition-colors"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-5">
          <h4 className="text-slate-900 font-semibold mb-5">
            Office
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-slate-500 group">
              <MapPin className="w-5 h-5 text-corporate-primary shrink-0 group-hover:scale-110 transition-transform" />
              <div className="text-sm">
                <p className="font-medium text-slate-900">
                  Corban Innovation Hub
                </p>
                <p>Mombasa, Kenya</p>
                <p className="text-xs text-slate-400 mt-1">
                  P.O. Box 10541-80101
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-500 group">
              <Mail className="w-5 h-5 text-corporate-primary shrink-0 group-hover:scale-110 transition-transform" />
              <p className="text-sm">info@corbantechnologies.org</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
        <p className="text-sm">
          © {currentYear} Corban Technologies LTD. All rights reserved.
        </p>
      </div>
    </footer >
  );
}
