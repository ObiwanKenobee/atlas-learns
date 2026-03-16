import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type ModelVersion = Tables<"model_versions">;

export function useModelVersions() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("model-versions-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "model_versions" }, () => {
        queryClient.invalidateQueries({ queryKey: ["model_versions"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["model_versions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("model_versions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateModelVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TablesInsert<"model_versions">) => {
      const { error } = await supabase.from("model_versions").insert(data);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["model_versions"] }),
  });
}

export function useUpdateModelVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: TablesUpdate<"model_versions"> & { id: string }) => {
      const { error } = await supabase.from("model_versions").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["model_versions"] }),
  });
}

export function useDeleteModelVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("model_versions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["model_versions"] }),
  });
}
