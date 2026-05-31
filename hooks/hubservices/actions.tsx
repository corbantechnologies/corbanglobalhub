"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubServices, getHubService } from "@/services/hubservices";

export function useFetchHubServices() {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubservices"],
    queryFn: () => getHubServices(header),
    enabled: !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useFetchHubService(reference: string) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubservice", reference],
    queryFn: () => getHubService(reference, header),
    enabled: !!reference && !!header.headers.Authorization,
  });
}