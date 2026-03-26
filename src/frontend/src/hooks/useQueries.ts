import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DiagnosisSession, FarmingTip, Solution } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── Farming Tips ────────────────────────────────────────────────────────────

export function useAllFarmingTips() {
  const { actor, isFetching } = useActor();
  return useQuery<FarmingTip[]>({
    queryKey: ["farmingTips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFarmingTips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFarmingTipsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<FarmingTip[]>({
    queryKey: ["farmingTips", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "all") return actor.getAllFarmingTips();
      return actor.getFarmingTipsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitFarmingTip() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      category,
      title,
      content,
    }: {
      category: string;
      title: string;
      content: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitFarmingTip(category, title, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["farmingTips"] }),
  });
}

// ─── Diagnosis ───────────────────────────────────────────────────────────────

export function useSubmitDiagnosis() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      crop: string;
      symptoms: string;
      soilType: string;
      locationId: string;
      suggestion: Solution;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitDiagnosis(params);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["diagnosisSessions"] }),
  });
}

export function useAddImageToDiagnosis() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      diagnosisId,
      imageBytes,
    }: {
      diagnosisId: bigint;
      imageBytes: Uint8Array<ArrayBuffer>;
    }) => {
      if (!actor) throw new Error("No actor");
      const blob = ExternalBlob.fromBytes(imageBytes);
      return actor.addImageToDiagnosis(diagnosisId, blob);
    },
  });
}

export function useUserDiagnosisSessions() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<DiagnosisSession[]>({
    queryKey: ["diagnosisSessions", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getDiagnosisSessionsByUser(identity.getPrincipal());
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}
