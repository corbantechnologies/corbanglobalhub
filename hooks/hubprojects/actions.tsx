"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../authentication/useAxiosAuth";
import { getHubProjects, getHubProject } from "@/services/hubprojects";

export function useFetchHubProjects() {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubprojects"],
    queryFn: () => getHubProjects(header),
    enabled: !!header.headers.Authorization && header.headers.Authorization !== "Token undefined",
  });
}

export function useFetchHubProject(reference: string) {
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["hubproject", reference],
    queryFn: () => getHubProject(reference, header),
    enabled: !!reference && !!header.headers.Authorization,
  });
}