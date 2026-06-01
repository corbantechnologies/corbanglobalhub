"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubBillingInvoices, getHubBillingInvoice } from "@/services/hubbillinginvoices";

export function useFetchHubBillingInvoices() {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubbillinginvoices"],
    queryFn: () => getHubBillingInvoices(header),
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