"use client";

import { useQuery } from "@tanstack/react-query";

import { getAccount, getClients } from "@/services/accounts";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserMemberCode from "../authentication/useUserMemberCode";

export function useFetchAccount() {
  const member_code = useUserMemberCode();
  const header = useAxiosAuth();

  return useQuery({
    queryKey: ["account", member_code],
    queryFn: () => getAccount(member_code!, header),
    enabled: !!member_code,
  });
}


export function useFetchClients() {
    const header = useAxiosAuth();
    
    return useQuery({
        queryKey: ["clients"],
        queryFn: () => getClients(header),
    });
}