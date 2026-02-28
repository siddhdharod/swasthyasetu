import { Link } from "@tanstack/react-router";
import { Activity, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer className="relative mt-20 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Activity
                className="w-6 h-6"
                style={{ stroke: "url(#footerGradient)" }}
              />
              <svg width="0" height="0" className="absolute" aria-hidden="true">
                <defs>
                  <linearGradient
                    id="footerGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="var(--primary-start)" />
                    <stop offset="100%" stopColor="var(--primary-end)" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="font-display font-bold text-lg gradient-text">
                SwasthyaSetu
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Revolutionizing healthcare through AI-powered problem solving,
              idea generation, and global collaboration.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", to: "/dashboard" },
                { label: "Problems", to: "/dashboard/problems" },
                { label: "Ideas", to: "/dashboard/ideas" },
                { label: "Collaborate", to: "/dashboard/collaboration" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/#about" },
                { label: "Blog", href: "/#features" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} SwasthyaSetu. All rights reserved.
          </p>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" />{" "}
            using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
