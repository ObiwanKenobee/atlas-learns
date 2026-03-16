import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type PolicyPattern = Tables<"policy_patterns">;

export function usePolicyPatterns() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("policy-patterns-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "policy_patterns" }, () => {
        queryClient.invalidateQueries({ queryKey: ["policy_patterns"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["policy_patterns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("policy_patterns")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreatePolicyPattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TablesInsert<"policy_patterns">) => {
      const { error } = await supabase.from("policy_patterns").insert(data);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["policy_patterns"] }),
  });
}

export function useUpdatePolicyPattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<"policy_patterns"> & { id: string }) => {
      const { error } = await supabase.from("policy_patterns").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["policy_patterns"] }),
  });
}

export function useDeletePolicyPattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("policy_patterns").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["policy_patterns"] }),
  });
}
