"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface Hub {
    name: string;
    id: number;
    code: string;
    country: string;
    owner: string; 
    is_active: boolean;
    tax_pin: string;
    billing_address: string;
    billing_email: string;
    requires_kra_invoice: boolean;
    created_at: string;
    updated_at: string;
    reference: string;
}

interface createHub {
    name: string;
    country: string;
    is_active: boolean;
    tax_pin: string;
    billing_address: string;
    billing_email: string;
    requires_kra_invoice: boolean;
}

interface updateHub {
    name?: string;
    is_active?: boolean;
    tax_pin?: string;
    billing_address?: string;
    billing_email?: string;
    requires_kra_invoice?: boolean;
}

export const getHubs = async (headers: { headers: { Authorization: string } }): Promise<Hub[]> => {
    const response: AxiosResponse<PaginatedResponse<Hub>> = await apiActions.get(`/api/v1/hubs/`, headers);
    return response.data.results || [];
};

export const getHub = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Hub> => {
    const response: AxiosResponse<Hub> = await apiActions.get(`/api/v1/hubs/${reference}/`, headers);
    return response.data;
};

export const createHub = async (data: createHub, headers: { headers: { Authorization: string } }): Promise<Hub> => {
    const response: AxiosResponse<Hub> = await apiActions.post(`/api/v1/hubs/`, data, headers);
    return response.data;
};

export const updateHub = async (reference: string, data: updateHub, headers: { headers: { Authorization: string } }): Promise<Hub> => {
    const response: AxiosResponse<Hub> = await apiActions.patch(`/api/v1/hubs/${reference}/`, data, headers);
    return response.data;
};

export const deleteHub = async (reference: string, headers: { headers: { Authorization: string } }): Promise<Hub> => {
    const response: AxiosResponse<Hub> = await apiActions.delete(`/api/v1/hubs/${reference}/`, headers);
    return response.data;
};