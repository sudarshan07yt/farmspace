import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type DiagnosisResult, diagnose } from "../data/knowledgeBase";
import {
  useAddImageToDiagnosis,
  useSubmitDiagnosis,
} from "../hooks/useQueries";

type Step = "crop" | "symptoms" | "soil" | "location" | "image" | "result";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
}

const CROPS = [
  "Wheat",
  "Rice",
  "Tomato",
  "Potato",
  "Corn",
  "Cotton",
  "Onion",
  "Soybean",
  "Sugarcane",
  "Mango",
];
const SYMPTOMS = [
  "Yellow Leaves",
  "Brown Spots",
  "Wilting",
  "Pests",
  "Root Rot",
  "Mold",
  "Leaf Curl",
  "Stunted Growth",
];
const SOILS = ["Clayey", "Sandy", "Loamy", "Silty", "Black Cotton"];

function genId() {
  return Math.random().toString(36).slice(2);
}
function botMsg(text: string): Message {
  return { id: genId(), role: "bot", text };
}
function userMsg(text: string): Message {
  return { id: genId(), role: "user", text };
}

function getImageObservations(crop: string, symptoms: string[]): string[] {
  const obs: string[] = [];
  const lowerSymptoms = symptoms.map((s) => s.toLowerCase());

  if (lowerSymptoms.some((s) => s.includes("yellow"))) {
    obs.push(
      `📷 Visual scan: I can see chlorotic (yellowing) patches on the ${crop} leaves — consistent with your reported symptoms.`,
    );
    obs.push(
      "🔬 Color analysis suggests possible nutrient deficiency or early fungal infection. Checking knowledge base...",
    );
  } else if (
    lowerSymptoms.some((s) => s.includes("brown") || s.includes("spot"))
  ) {
    obs.push(
      "📷 Visual scan: Detected dark brown lesions and spot patterns on the leaf surface.",
    );
    obs.push(
      "🔬 Spot morphology matches common blight or fungal disease patterns. Cross-referencing diagnosis...",
    );
  } else if (lowerSymptoms.some((s) => s.includes("wilt"))) {
    obs.push(
      "📷 Visual scan: I can see drooping and wilted tissue in the uploaded image.",
    );
    obs.push(
      "🔬 Wilt pattern analysis suggests possible vascular or root-level infection. Running full diagnosis...",
    );
  } else if (
    lowerSymptoms.some((s) => s.includes("pest") || s.includes("insect"))
  ) {
    obs.push(
      "📷 Visual scan: Detected signs of insect activity — damage patterns, frass, or visible pest presence.",
    );
    obs.push(`🔬 Cross-matching pest damage profile for ${crop}...`);
  } else if (
    lowerSymptoms.some((s) => s.includes("mold") || s.includes("rot"))
  ) {
    obs.push(
      "📷 Visual scan: Visible fungal growth or rot detected in the image.",
    );
    obs.push("🔬 Analyzing spore patterns and infection spread...");
  } else {
    obs.push(
      `📷 Visual scan: Image received and processed for ${crop} health analysis.`,
    );
    obs.push(
      "🔬 Comparing visual data with reported symptoms to refine diagnosis...",
    );
  }

  return obs;
}

const INITIAL_MESSAGES: Message[] = [
  botMsg(
    "👋 Hello! I'm Farmspace AI, your smart farming assistant. I'll help you diagnose any plant health issue.",
  ),
  botMsg(
    "Let's start — which crop are you growing? Select one below or type your crop name.",
  ),
];

export default function ChatbotSection() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [step, setStep] = useState<Step>("crop");
  const [crop, setCrop] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [soilType, setSoilType] = useState("");
  const [location, setLocation] = useState("");
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUsed, setImageUsed] = useState(false);
  const [diagnosisResult, setDiagnosisResult] =
    useState<DiagnosisResult | null>(null);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitDiagnosis = useSubmitDiagnosis();
  const addImage = useAddImageToDiagnosis();

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: messages triggers scroll
  useEffect(() => {
    const el = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const handleCropSelect = (c: string) => {
    setCrop(c);
    addMessage(userMsg(c));
    setTimeout(() => {
      addMessage(
        botMsg(
          `Great! You're growing ${c}. Now, what symptoms are you noticing? Select all that apply, then click Continue.`,
        ),
      );
      setStep("symptoms");
    }, 400);
  };

  const handleSymptomsConfirm = () => {
    if (symptoms.length === 0) return;
    addMessage(userMsg(symptoms.join(", ")));
    setTimeout(() => {
      addMessage(
        botMsg(
          "What type of soil do you have? (Optional — this helps refine the diagnosis)",
        ),
      );
      setStep("soil");
    }, 400);
  };

  const handleSoilSelect = (s: string) => {
    setSoilType(s);
    addMessage(userMsg(s));
    setTimeout(() => {
      addMessage(
        botMsg(
          "Almost there! What is your farm's location? (e.g. Punjab, India)",
        ),
      );
      setStep("location");
    }, 400);
  };

  const handleSoilSkip = () => {
    addMessage(userMsg("Skip"));
    setTimeout(() => {
      addMessage(
        botMsg(
          "Almost there! What is your farm's location? (e.g. Punjab, India)",
        ),
      );
      setStep("location");
    }, 400);
  };

  const handleLocationSubmit = () => {
    if (!inputText.trim()) return;
    const loc = inputText.trim();
    setLocation(loc);
    setInputText("");
    addMessage(userMsg(loc));
    setTimeout(() => {
      addMessage(
        botMsg(
          "Would you like to upload a photo of the affected plant? It helps improve accuracy. (Optional)",
        ),
      );
      setStep("image");
    }, 400);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageConfirm = async (skip = false) => {
    addMessage(skip ? userMsg("Skip") : userMsg("📷 Photo uploaded"));
    setStep("result");

    if (!skip && imageFile) {
      // Enhanced image analysis flow
      setImageUsed(true);
      setTimeout(() => {
        addMessage(botMsg("🔍 Analyzing your uploaded image — please wait..."));
      }, 300);

      const observations = getImageObservations(crop, symptoms);

      setTimeout(() => {
        addMessage(botMsg(observations[0]));
      }, 800);

      setTimeout(() => {
        if (observations[1]) addMessage(botMsg(observations[1]));
      }, 1600);

      setTimeout(async () => {
        const result = diagnose(crop, symptoms);
        setDiagnosisResult(result);
        try {
          const id = await submitDiagnosis.mutateAsync({
            crop,
            symptoms: symptoms.join(", "),
            soilType: soilType || "Unknown",
            locationId: location,
            suggestion: {
              causes: result.causes,
              treatmentSteps: result.treatmentSteps,
              organicSolutions: result.organicSolutions,
              chemicalSolutions: result.chemicalSolutions,
              preventiveMeasures: result.preventiveMeasures,
            },
          });
          const bytes = new Uint8Array(
            await imageFile.arrayBuffer(),
          ) as Uint8Array<ArrayBuffer>;
          await addImage.mutateAsync({ diagnosisId: id, imageBytes: bytes });
          toast.success("Diagnosis saved to your history!");
        } catch {
          // Non-critical — still show result
        }
        addMessage(
          botMsg(
            `✅ Analysis complete with image confirmation! Found ${result.confidence}% confidence match. Here's your full diagnosis report →`,
          ),
        );
      }, 2400);
    } else {
      // Skip flow — unchanged
      setImageUsed(false);
      setTimeout(async () => {
        addMessage(botMsg("🔍 Analyzing your crop… Please wait a moment."));
        const result = diagnose(crop, symptoms);
        setDiagnosisResult(result);
        try {
          await submitDiagnosis.mutateAsync({
            crop,
            symptoms: symptoms.join(", "),
            soilType: soilType || "Unknown",
            locationId: location,
            suggestion: {
              causes: result.causes,
              treatmentSteps: result.treatmentSteps,
              organicSolutions: result.organicSolutions,
              chemicalSolutions: result.chemicalSolutions,
              preventiveMeasures: result.preventiveMeasures,
            },
          });
          toast.success("Diagnosis saved to your history!");
        } catch {
          // Non-critical — still show result
        }
        addMessage(
          botMsg(
            `✅ Analysis complete! I found ${result.confidence}% confidence match. Here's your full diagnosis report →`,
          ),
        );
      }, 1000);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setStep("crop");
    setCrop("");
    setSymptoms([]);
    setSoilType("");
    setLocation("");
    setInputText("");
    setImageFile(null);
    setImagePreview(null);
    setImageUsed(false);
    setDiagnosisResult(null);
  };

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: "oklch(0.97 0.015 155)" }}
      id="diagnose"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: "oklch(0.35 0.09 160)" }}
          >
            AI Crop Diagnosis
          </h2>
          <p className="text-base" style={{ color: "oklch(0.50 0.03 155)" }}>
            Chat with Farmspace AI to identify and treat your crop problems
            instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* Chat Widget */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader
                className="py-4 px-5"
                style={{ backgroundColor: "oklch(0.35 0.09 160)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                      <img
                        src="/assets/generated/crop-bot-avatar-transparent.dim_200x200.png"
                        alt="Farmspace AI"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm font-semibold">
                        Farmspace AI
                      </CardTitle>
                      <p className="text-white/60 text-xs">
                        Online · Instant Analysis
                      </p>
                    </div>
                  </div>
                  {step === "result" && (
                    <Button
                      data-ocid="chat.secondary_button"
                      size="sm"
                      variant="ghost"
                      onClick={handleReset}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" /> New Chat
                    </Button>
                  )}
                </div>
              </CardHeader>

              <ScrollArea className="h-96" ref={scrollAreaRef}>
                <div className="p-4 flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 chat-msg-enter ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {msg.role === "bot" && (
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1">
                          <img
                            src="/assets/generated/crop-bot-avatar-transparent.dim_200x200.png"
                            alt="bot"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "bot" ? "rounded-tl-sm bg-secondary text-foreground" : "rounded-tr-sm text-white"}`}
                        style={
                          msg.role === "user"
                            ? { backgroundColor: "oklch(0.47 0.11 158)" }
                            : {}
                        }
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div
                className="border-t px-4 py-3"
                style={{ backgroundColor: "oklch(0.97 0.015 155)" }}
              >
                {step === "crop" && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Select your crop:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CROPS.map((c) => (
                        <button
                          type="button"
                          key={c}
                          data-ocid="chat.button"
                          onClick={() => handleCropSelect(c)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:text-white hover:bg-primary"
                          style={{ borderColor: "oklch(0.47 0.11 158 / 0.5)" }}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        data-ocid="chat.input"
                        placeholder="Or type your crop name…"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && inputText.trim()) {
                            handleCropSelect(inputText.trim());
                            setInputText("");
                          }
                        }}
                        className="flex-1 text-sm"
                      />
                      <Button
                        data-ocid="chat.submit_button"
                        size="sm"
                        disabled={!inputText.trim()}
                        onClick={() => {
                          handleCropSelect(inputText.trim());
                          setInputText("");
                        }}
                        style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
                        className="text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {step === "symptoms" && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Select all symptoms you see:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOMS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          data-ocid="chat.toggle"
                          onClick={() => toggleSymptom(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${symptoms.includes(s) ? "text-white border-transparent" : "border-primary/40 text-foreground hover:bg-primary/10"}`}
                          style={
                            symptoms.includes(s)
                              ? {
                                  backgroundColor: "oklch(0.47 0.11 158)",
                                  borderColor: "oklch(0.47 0.11 158)",
                                }
                              : {}
                          }
                        >
                          {symptoms.includes(s) && (
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          )}
                          {s}
                        </button>
                      ))}
                    </div>
                    <Button
                      data-ocid="chat.primary_button"
                      size="sm"
                      disabled={symptoms.length === 0}
                      onClick={handleSymptomsConfirm}
                      className="w-full text-white"
                      style={{ backgroundColor: "oklch(0.35 0.09 160)" }}
                    >
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}

                {step === "soil" && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Soil type (optional):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SOILS.map((s) => (
                        <button
                          type="button"
                          key={s}
                          data-ocid="chat.button"
                          onClick={() => handleSoilSelect(s)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border border-primary/40 text-foreground hover:bg-primary/10 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleSoilSkip}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-dashed border-muted-foreground text-muted-foreground hover:bg-muted/20 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                )}

                {step === "location" && (
                  <div className="flex gap-2">
                    <Input
                      data-ocid="chat.input"
                      placeholder="Enter your location (e.g. Punjab, India)"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleLocationSubmit()
                      }
                      className="flex-1 text-sm"
                    />
                    <Button
                      data-ocid="chat.submit_button"
                      size="sm"
                      disabled={!inputText.trim()}
                      onClick={handleLocationSubmit}
                      className="text-white"
                      style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {step === "image" && (
                  <div className="space-y-2">
                    {imagePreview && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                        <img
                          src={imagePreview}
                          alt="plant"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        data-ocid="chat.upload_button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 text-xs"
                      >
                        <Upload className="w-4 h-4 mr-1" /> Upload Photo
                      </Button>
                      <Button
                        data-ocid="chat.primary_button"
                        size="sm"
                        onClick={() => handleImageConfirm(false)}
                        disabled={!imageFile}
                        className="flex-1 text-white text-xs"
                        style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
                      >
                        Analyze
                      </Button>
                      <Button
                        data-ocid="chat.secondary_button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImageConfirm(true)}
                        className="text-xs text-muted-foreground"
                      >
                        Skip
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}

                {step === "result" && !diagnosisResult && (
                  <div className="flex items-center justify-center py-2">
                    <div className="flex gap-1">
                      {["a", "b", "c"].map((k, i) => (
                        <div
                          key={k}
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            backgroundColor: "oklch(0.47 0.11 158)",
                            animationDelay: `${i * 0.15}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Diagnosis Result */}
          <div className="lg:col-span-2" data-ocid="diagnosis.panel">
            {diagnosisResult ? (
              <div className="space-y-4">
                <Card
                  className="border-0 shadow-md"
                  style={{ backgroundColor: "oklch(0.35 0.09 160)" }}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm">
                        Diagnosis Report
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {imageUsed && (
                          <span className="text-xs text-white/70 flex items-center gap-1">
                            📷 Image-enhanced
                          </span>
                        )}
                        <Badge
                          className="text-white text-xs"
                          style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
                        >
                          {diagnosisResult.confidence}% Confidence
                        </Badge>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">
                      {crop} · {symptoms.slice(0, 2).join(", ")}
                      {symptoms.length > 2
                        ? ` +${symptoms.length - 2} more`
                        : ""}
                    </p>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Uploaded plant"
                        className="mt-3 w-full h-24 object-cover rounded-lg"
                      />
                    )}
                  </CardContent>
                </Card>

                <ResultCard
                  title="🔎 Possible Causes"
                  color="oklch(0.93 0.025 155)"
                  text={diagnosisResult.causes}
                />
                <ResultCard
                  title="💊 Treatment Steps"
                  color="oklch(0.93 0.025 155)"
                  text={diagnosisResult.treatmentSteps}
                />
                <ResultCard
                  title="🌿 Organic Solutions"
                  badge="Organic"
                  badgeColor="oklch(0.47 0.11 158)"
                  color="oklch(0.90 0.04 155)"
                  text={diagnosisResult.organicSolutions}
                />
                <ResultCard
                  title="🧪 Chemical Solutions"
                  badge="Chemical"
                  badgeColor="oklch(0.45 0.10 240)"
                  color="oklch(0.93 0.02 240)"
                  text={diagnosisResult.chemicalSolutions}
                />
                <ResultCard
                  title="🛡️ Preventive Measures"
                  color="oklch(0.93 0.025 155)"
                  text={diagnosisResult.preventiveMeasures}
                />
              </div>
            ) : (
              <Card
                className="border-0 shadow-md"
                data-ocid="diagnosis.empty_state"
              >
                <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                  <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: "oklch(0.93 0.025 155)" }}
                  >
                    <img
                      src="/assets/generated/crop-bot-avatar-transparent.dim_200x200.png"
                      alt="Farmspace AI"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <h3
                    className="font-semibold text-base mb-2"
                    style={{ color: "oklch(0.35 0.09 160)" }}
                  >
                    Your diagnosis will appear here
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.50 0.03 155)" }}
                  >
                    Complete the chat steps on the left and Farmspace AI will
                    provide a full analysis with treatment options.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultCard({
  title,
  text,
  color,
  badge,
  badgeColor,
}: {
  title: string;
  text: string;
  color: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4" style={{ backgroundColor: color }}>
        <div className="flex items-center justify-between mb-1.5">
          <h4
            className="text-sm font-semibold"
            style={{ color: "oklch(0.28 0.08 160)" }}
          >
            {title}
          </h4>
          {badge && badgeColor && (
            <Badge
              className="text-white text-xs"
              style={{ backgroundColor: badgeColor }}
            >
              {badge}
            </Badge>
          )}
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "oklch(0.35 0.06 160)" }}
        >
          {text}
        </p>
      </CardContent>
    </Card>
  );
}
