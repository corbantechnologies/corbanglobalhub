"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubs, getHub } from "@/services/hubs";

export function useFetchHubs() {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubs"],
    queryFn: () => getHubs(header),
    enabled: !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useFetchHub(reference: string) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hub", reference],
    queryFn: () => getHub(reference, header),
    enabled: !!reference && !!header.headers.Authorization,
  });
}