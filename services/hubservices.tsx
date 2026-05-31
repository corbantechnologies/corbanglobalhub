"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface HubService {
    name: string;
    id: number;
    code: string;
    description: string;
    base_price: number;
    currency: string;
    created_by: string;
    updated_by: string;
    is_active: boolean;
    image: string;
    created_at: string;
    updated_at: string;
    reference: string;
}


interface createHubService {
    name: string;
    description: string;
    base_price: number;
    currency: string;
    is_active: boolean;
    image: File | null;
}

interface updateHubService {
    name?: string;
    description?: string;
    base_price?: number;
    currency?: string;
    is_active?: boolean;
    image?: File | null;
}

export const getHubServices = async (headers: { headers: { Authorization: string } }): Promise<HubService[]> => {
    const response: AxiosResponse<PaginatedResponse<HubService>> = await apiActions.get(`/api/v1/hubservices/`, headers);
    return response.data.results || [];
};

export const getHubService = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubService> => {
    const response: AxiosResponse<HubService> = await apiActions.get(`/api/v1/hubservices/${reference}/`, headers);
    return response.data;
};

export const createHubService = async (data: createHubService, headers: { headers: { Authorization: string } }): Promise<HubService> => {
    const response: AxiosResponse<HubService> = await apiActions.post(`/api/v1/hubservices/`, data, headers);
    return response.data;
};

export const updateHubService = async (reference: string, data: updateHubService, headers: { headers: { Authorization: string } }): Promise<HubService> => {
    const response: AxiosResponse<HubService> = await apiActions.patch(`/api/v1/hubservices/${reference}/`, data, headers);
    return response.data;
};

export const deleteHubService = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubService> => {
    const response: AxiosResponse<HubService> = await apiActions.delete(`/api/v1/hubservices/${reference}/`, headers);
    return response.data;
};