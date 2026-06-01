"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubBillingInvoiceLines, getHubBillingInvoiceLine } from "@/services/hubbillinginvoicelines";

export function useFetchHubBillingInvoiceLines() {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubbillinginvoicelines"],
    queryFn: () => getHubBillingInvoiceLines(header),
    enabled: !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useFetchHubBillingInvoiceLine(reference: string) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubbillinginvoiceline", reference],
    queryFn: () => getHubBillingInvoiceLine(reference, header),
    enabled: !!reference && !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}