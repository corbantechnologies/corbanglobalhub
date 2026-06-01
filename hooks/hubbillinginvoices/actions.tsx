"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubBillingInvoices, getHubBillingInvoice, updateHubBillingInvoice } from "@/services/hubbillinginvoices";

export function useFetchHubBillingInvoices(params?: any) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubbillinginvoices", params],
    queryFn: () => getHubBillingInvoices(header, params),
    enabled: !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useFetchHubBillingInvoice(reference: string) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubbillinginvoice", reference],
    queryFn: () => getHubBillingInvoice(reference, header),
    enabled: !!reference && !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useUpdateHubBillingInvoice() {
  const queryClient = useQueryClient();
  const header = useAxiosAuth();

  return useMutation({
    mutationFn: ({ reference, data }: { reference: string; data: any }) =>
      updateHubBillingInvoice(reference, data, header),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["hubbillinginvoices"] });
      queryClient.invalidateQueries({ queryKey: ["hubbillinginvoice", variables.reference] });
    },
  });
}