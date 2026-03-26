import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Bug, Droplets, Sprout, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { FarmingTip } from "../backend";
import {
  useAllFarmingTips,
  useFarmingTipsByCategory,
  useSubmitFarmingTip,
} from "../hooks/useQueries";

const SEED_TIPS = [
  {
    category: "irrigation",
    title: "Drip Irrigation Basics",
    content:
      "Water your crops at the root level to minimize evaporation and fungal disease. Drip lines can save up to 50% water compared to flood irrigation. Install emitters every 30–45cm for row crops.",
  },
  {
    category: "fertilizer",
    title: "NPK Fertilizer Guide",
    content:
      "Nitrogen (N) promotes leaf growth, Phosphorus (P) supports roots and flowering, Potassium (K) strengthens cell walls. Use a 20:10:10 ratio for vegetative growth and 10:30:20 for fruiting stage.",
  },
  {
    category: "pest_control",
    title: "Natural Pest Deterrents",
    content:
      "Use neem oil spray (5ml/L water) every 2 weeks to repel common pests including aphids, whitefly, and mites. Add 2–3 drops of dish soap as an emulsifier. Spray in early morning or evening.",
  },
  {
    category: "seasonal",
    title: "Monsoon Season Preparation",
    content:
      "Before monsoon arrives, ensure proper drainage channels are clear. Apply fungicide preventively on susceptible crops. Stake tall plants and apply mulch to prevent soil erosion during heavy rains.",
  },
  {
    category: "irrigation",
    title: "Water Stress Signs",
    content:
      "Yellow tips on leaves often indicate underwatering, while yellowing of entire lower leaves may signal overwatering. Check soil moisture at 5–10cm depth before each irrigation cycle.",
  },
  {
    category: "fertilizer",
    title: "Organic Composting",
    content:
      "Kitchen waste (vegetable peels, eggshells, tea leaves) and dry garden leaves make excellent compost. Layer 3:1 dry:wet material, keep moist but not wet, turn weekly. Ready in 6–8 weeks.",
  },
  {
    category: "pest_control",
    title: "Integrated Pest Management",
    content:
      "Combine biological (beneficial insects, Bt sprays), cultural (crop rotation, proper spacing), and chemical methods. This reduces pesticide resistance and protects soil ecology long-term.",
  },
  {
    category: "seasonal",
    title: "Winter Crop Care",
    content:
      "Cover sensitive crops with plastic mulch or agro-net during cold nights when temperature drops below 10°C. Apply potassium-rich fertilizer in October to strengthen crops against frost stress.",
  },
];

const categoryIcons: Record<string, typeof Droplets> = {
  all: BookOpen,
  irrigation: Droplets,
  fertilizer: Sprout,
  pest_control: Bug,
  seasonal: Sun,
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "irrigation", label: "Irrigation" },
  { id: "fertilizer", label: "Fertilizer" },
  { id: "pest_control", label: "Pest Control" },
  { id: "seasonal", label: "Seasonal" },
];

export default function FarmingTipsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: allTips } = useAllFarmingTips();
  const { data: tips, isLoading } = useFarmingTipsByCategory(activeCategory);
  const submitTip = useSubmitFarmingTip();
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded || !allTips || submitTip.isPending) return;
    if (allTips.length === 0) {
      setSeeded(true);
      void Promise.all(
        SEED_TIPS.map((t) =>
          submitTip.mutateAsync({
            category: t.category,
            title: t.title,
            content: t.content,
          }),
        ),
      );
    }
  }, [allTips, seeded, submitTip.isPending, submitTip.mutateAsync]);

  const displayTips: FarmingTip[] =
    tips && tips.length > 0
      ? tips
      : SEED_TIPS.filter(
          (t) => activeCategory === "all" || t.category === activeCategory,
        ).map((t) => ({ ...t, timestamp: BigInt(0) }));

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: "oklch(0.93 0.025 155)" }}
      id="tips"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "oklch(0.35 0.09 160)" }}
          >
            Smart Farming Tips
          </h2>
          <p className="text-base" style={{ color: "oklch(0.50 0.03 155)" }}>
            Expert advice for every stage of your farming journey.
          </p>
        </div>

        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="mb-8"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0 justify-center">
            {CATEGORIES.map((cat) => {
              const Icon = categoryIcons[cat.id];
              return (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  data-ocid="tips.tab"
                  className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:text-white data-[state=active]:shadow-sm"
                  style={
                    activeCategory === cat.id
                      ? { backgroundColor: "oklch(0.35 0.09 160)" }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {cat.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <Skeleton
                key={k}
                className="h-40 rounded-xl"
                data-ocid="tips.loading_state"
              />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTips.map((tip, i) => {
              const Icon = categoryIcons[tip.category] ?? BookOpen;
              return (
                <Card
                  key={tip.title}
                  className="border-0 shadow-md hover:shadow-xl transition-shadow"
                  data-ocid={`tips.item.${i + 1}`}
                >
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: "oklch(0.90 0.04 155)" }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: "oklch(0.47 0.11 158)" }}
                      />
                    </div>
                    <h3
                      className="font-semibold text-base mb-2"
                      style={{ color: "oklch(0.35 0.09 160)" }}
                    >
                      {tip.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed line-clamp-4"
                      style={{ color: "oklch(0.50 0.03 155)" }}
                    >
                      {tip.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {displayTips.length === 0 && !isLoading && (
          <div className="text-center py-16" data-ocid="tips.empty_state">
            <p className="text-muted-foreground">
              No tips available in this category yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
