import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import ChatbotSection from "./components/ChatbotSection";
import DashboardSection from "./components/DashboardSection";
import FarmingTipsSection from "./components/FarmingTipsSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";

type Section = "home" | "diagnose" | "tips" | "dashboard";

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>("home");

  const navigate = (s: Section) => setActiveSection(s);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeSection={activeSection} onNavigate={navigate} />

      <main className="flex-1">
        {activeSection === "home" && (
          <HeroSection
            onStartDiagnosis={() => navigate("diagnose")}
            onLearnMore={() => navigate("tips")}
          />
        )}
        {activeSection === "diagnose" && <ChatbotSection />}
        {activeSection === "tips" && <FarmingTipsSection />}
        {activeSection === "dashboard" && <DashboardSection />}
      </main>

      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
