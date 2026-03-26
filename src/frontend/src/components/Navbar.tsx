import { Button } from "@/components/ui/button";
import { Leaf, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Section = "home" | "diagnose" | "tips" | "dashboard";

interface NavbarProps {
  activeSection: Section;
  onNavigate: (s: Section) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const links: { id: Section; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "diagnose", label: "Diagnose" },
    { id: "tips", label: "Tips" },
    { id: "dashboard", label: "Dashboard" },
  ];

  const navigate = (s: Section) => {
    onNavigate(s);
    setMobileOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "oklch(0.35 0.09 160)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => navigate("home")}
            className="flex items-center gap-2 text-white font-bold text-xl"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            Farmspace
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                type="button"
                key={l.id}
                data-ocid="nav.link"
                onClick={() => navigate(l.id)}
                className={`text-sm font-medium transition-colors ${activeSection === l.id ? "text-white underline underline-offset-4" : "text-white/70 hover:text-white"}`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                data-ocid="nav.button"
                variant="outline"
                size="sm"
                onClick={clear}
                className="border-white/50 text-white hover:bg-white/10 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-1" /> Logout
              </Button>
            ) : (
              <Button
                data-ocid="nav.button"
                size="sm"
                disabled={isLoggingIn}
                onClick={login}
                className="text-white font-semibold"
                style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
              >
                <LogIn className="w-4 h-4 mr-1" />
                {isLoggingIn ? "Logging in…" : "Login"}
              </Button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden border-t border-white/10"
          style={{ backgroundColor: "oklch(0.28 0.08 160)" }}
        >
          <div className="px-4 py-3 flex flex-col gap-2">
            {links.map((l) => (
              <button
                type="button"
                key={l.id}
                onClick={() => navigate(l.id)}
                className={`text-left py-2 text-sm font-medium ${activeSection === l.id ? "text-white" : "text-white/70"}`}
              >
                {l.label}
              </button>
            ))}
            <div className="pt-2 border-t border-white/10">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="w-full border-white/50 text-white bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  className="w-full text-white"
                  style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
                >
                  <LogIn className="w-4 h-4 mr-1" /> Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
