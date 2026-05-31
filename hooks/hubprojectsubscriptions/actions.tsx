"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubProjectSubscriptions, getHubProjectSubscription } from "@/services/hubprojectsubscriptions";

export function useFetchHubProjectSubscriptions() {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubprojectsubscriptions"],
    queryFn: () => getHubProjectSubscriptions(header),
    enabled: !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useFetchHubProjectSubscription(reference: string) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubprojectsubscription", reference],
    queryFn: () => getHubProjectSubscription(reference, header),
    enabled: !!reference && !!header.headers.Authorization,
  });
}