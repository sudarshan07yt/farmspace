import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronDown, ChevronUp, LogIn, Sprout } from "lucide-react";
import { useState } from "react";
import type { DiagnosisSession } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserDiagnosisSessions } from "../hooks/useQueries";

export default function DashboardSection() {
  const { identity, login } = useInternetIdentity();
  const { data: sessions, isLoading } = useUserDiagnosisSessions();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (!identity) {
    return (
      <section
        className="py-20 px-4"
        style={{ backgroundColor: "oklch(0.97 0.015 155)" }}
        id="dashboard"
      >
        <div
          className="max-w-3xl mx-auto text-center"
          data-ocid="dashboard.empty_state"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "oklch(0.90 0.04 155)" }}
          >
            <Sprout
              className="w-10 h-10"
              style={{ color: "oklch(0.47 0.11 158)" }}
            />
          </div>
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "oklch(0.35 0.09 160)" }}
          >
            Your Diagnosis History
          </h2>
          <p
            className="text-base mb-8"
            style={{ color: "oklch(0.50 0.03 155)" }}
          >
            Please log in to view your past diagnoses and track your crop health
            over time.
          </p>
          <Button
            data-ocid="dashboard.primary_button"
            size="lg"
            onClick={login}
            className="text-white font-semibold"
            style={{ backgroundColor: "oklch(0.35 0.09 160)" }}
          >
            <LogIn className="w-4 h-4 mr-2" /> Login to View History
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: "oklch(0.97 0.015 155)" }}
      id="dashboard"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2
              className="text-3xl font-bold"
              style={{ color: "oklch(0.35 0.09 160)" }}
            >
              Your Diagnosis History
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.50 0.03 155)" }}
            >
              {sessions?.length ?? 0} past session
              {sessions?.length !== 1 ? "s" : ""} recorded
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="space-y-4" data-ocid="dashboard.loading_state">
            {["a", "b", "c"].map((k) => (
              <Skeleton key={k} className="h-24 rounded-xl" />
            ))}
          </div>
        )}

        {!isLoading && (!sessions || sessions.length === 0) && (
          <div className="text-center py-20" data-ocid="dashboard.empty_state">
            <Sprout
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "oklch(0.47 0.11 158)" }}
            />
            <p
              className="font-medium"
              style={{ color: "oklch(0.35 0.09 160)" }}
            >
              No diagnoses yet
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.50 0.03 155)" }}
            >
              Run your first diagnosis in the Diagnose tab.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {sessions?.map((session: DiagnosisSession, i: number) => {
            const id = session.id.toString();
            const isOpen = expanded === id;
            const date = new Date(
              Number(session.timestamp / BigInt(1_000_000)),
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <Card
                key={id}
                className="border-0 shadow-md"
                data-ocid={`dashboard.item.${i + 1}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: "oklch(0.90 0.04 155)" }}
                      >
                        <Sprout
                          className="w-5 h-5"
                          style={{ color: "oklch(0.47 0.11 158)" }}
                        />
                      </div>
                      <div>
                        <CardTitle
                          className="text-base font-semibold"
                          style={{ color: "oklch(0.35 0.09 160)" }}
                        >
                          {session.crop}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar
                            className="w-3 h-3"
                            style={{ color: "oklch(0.50 0.03 155)" }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: "oklch(0.50 0.03 155)" }}
                          >
                            {date}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {session.soilType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      data-ocid={`dashboard.toggle.${i + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(id)}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {isOpen ? "Hide" : "View Solution"}
                    </Button>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <InfoRow label="Symptoms" value={session.symptoms} />
                      <InfoRow label="Causes" value={session.solution.causes} />
                      <InfoRow
                        label="Treatment"
                        value={session.solution.treatmentSteps}
                      />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div
                          className="rounded-lg p-3 text-xs"
                          style={{ backgroundColor: "oklch(0.90 0.04 155)" }}
                        >
                          <Badge
                            className="mb-1 text-white"
                            style={{ backgroundColor: "oklch(0.47 0.11 158)" }}
                          >
                            Organic
                          </Badge>
                          <p style={{ color: "oklch(0.35 0.06 160)" }}>
                            {session.solution.organicSolutions}
                          </p>
                        </div>
                        <div
                          className="rounded-lg p-3 text-xs"
                          style={{ backgroundColor: "oklch(0.93 0.02 240)" }}
                        >
                          <Badge
                            className="mb-1 text-white"
                            style={{ backgroundColor: "oklch(0.45 0.10 240)" }}
                          >
                            Chemical
                          </Badge>
                          <p style={{ color: "oklch(0.30 0.05 240)" }}>
                            {session.solution.chemicalSolutions}
                          </p>
                        </div>
                      </div>
                      <InfoRow
                        label="Prevention"
                        value={session.solution.preventiveMeasures}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-lg p-3"
      style={{ backgroundColor: "oklch(0.93 0.025 155)" }}
    >
      <p
        className="text-xs font-semibold mb-1"
        style={{ color: "oklch(0.35 0.09 160)" }}
      >
        {label}
      </p>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "oklch(0.40 0.04 160)" }}
      >
        {value}
      </p>
    </div>
  );
}
