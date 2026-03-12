import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Intervention = Tables<"interventions"> & {
  outcomes: Tables<"outcomes">[];
};

export function useInterventions() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("interventions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "interventions" }, () => {
        queryClient.invalidateQueries({ queryKey: ["interventions"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "outcomes" }, () => {
        queryClient.invalidateQueries({ queryKey: ["interventions"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["interventions"],
    queryFn: async () => {
      const { data: interventions, error: iErr } = await supabase
        .from("interventions")
        .select("*")
        .order("date_recommended", { ascending: false });
      if (iErr) throw iErr;

      const { data: outcomes, error: oErr } = await supabase
        .from("outcomes")
        .select("*");
      if (oErr) throw oErr;

      return (interventions ?? []).map((i) => ({
        ...i,
        outcomes: (outcomes ?? []).filter((o) => o.intervention_id === i.id),
      }));
    },
  });
}

export function useCreateIntervention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TablesInsert<"interventions">) => {
      const { data: result, error } = await supabase.from("interventions").insert(data).select().single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interventions"] }),
  });
}

export function useUpdateIntervention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<"interventions"> & { id: string }) => {
      const { error } = await supabase.from("interventions").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interventions"] }),
  });
}

export function useDeleteIntervention() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("interventions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interventions"] }),
  });
}

export function useCreateOutcome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TablesInsert<"outcomes">) => {
      const { error } = await supabase.from("outcomes").insert(data);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["interventions"] }),
  });
}
