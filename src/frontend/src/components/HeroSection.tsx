import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ChevronRight, Leaf, Zap } from "lucide-react";

interface HeroSectionProps {
  onStartDiagnosis: () => void;
  onLearnMore: () => void;
}

const benefits = [
  {
    icon: Zap,
    title: "Fast AI Diagnosis",
    desc: "Get accurate crop health analysis in seconds, powered by our agriculture knowledge base.",
    key: "fast",
  },
  {
    icon: Leaf,
    title: "Organic Solutions",
    desc: "Receive eco-friendly treatment options that are safe for your soil, family, and environment.",
    key: "organic",
  },
  {
    icon: BookOpen,
    title: "Expert Farming Tips",
    desc: "Access seasonal farming advice, irrigation guidance, and pest management strategies.",
    key: "tips",
  },
];

export default function HeroSection({
  onStartDiagnosis,
  onLearnMore,
}: HeroSectionProps) {
  return (
    <>
      <section
        className="relative min-h-[85vh] flex items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            "url('/assets/generated/farm-hero.dim_1600x900.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white/90 border border-white/30 mb-6"
            style={{ backgroundColor: "oklch(0.47 0.11 158 / 0.4)" }}
          >
            🌱 AI-Powered Agriculture Platform
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Diagnose &amp; Heal Your
            <span className="block" style={{ color: "oklch(0.82 0.15 155)" }}>
              Crops with AI
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl mx-auto">
            Describe your crop problem and get instant, expert-level diagnosis
            with organic and chemical treatment solutions — all in one simple
            conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="hero.primary_button"
              size="lg"
              onClick={onStartDiagnosis}
              className="text-white font-semibold text-base px-8 py-3 rounded-xl shadow-lg"
              style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
            >
              Start Diagnosis <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
            <Button
              data-ocid="hero.secondary_button"
              size="lg"
              variant="outline"
              onClick={onLearnMore}
              className="border-white/60 text-white hover:bg-white/10 bg-transparent font-semibold text-base px-8 py-3 rounded-xl"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section
        className="py-20 px-4"
        style={{ backgroundColor: "oklch(0.93 0.025 155)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ color: "oklch(0.35 0.09 160)" }}
            >
              Why Farmers Choose Farmspace
            </h2>
            <p className="text-base" style={{ color: "oklch(0.50 0.03 155)" }}>
              Simple, reliable, and built for real farming challenges.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <Card
                key={b.key}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
                data-ocid={`benefits.item.${i + 1}`}
              >
                <CardContent className="p-8 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "oklch(0.93 0.025 155)" }}
                  >
                    <b.icon
                      className="w-7 h-7"
                      style={{ color: "oklch(0.47 0.11 158)" }}
                    />
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "oklch(0.35 0.09 160)" }}
                  >
                    {b.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.50 0.03 155)" }}
                  >
                    {b.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
