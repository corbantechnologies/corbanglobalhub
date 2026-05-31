"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { HubProject } from "./hubprojects";

export interface HubProjectSubscription {
    id: number;
    project: string;
    service: string;
    is_active: boolean;
    custom_price: string;
    created_at: string;
    updated_at: string;
    reference: string;
}


interface createHubProjectSubscription {
    project: string; // project code
    service: string; // service code
    is_active: boolean;
    custom_price: string;
}

interface updateHubProjectSubscription {
    project?: string; // project code
    service?: string; // service code
    is_active?: boolean;
    custom_price?: string;
}

export const getHubProjectSubscriptions = async (headers: { headers: { Authorization: string } }): Promise<HubProjectSubscription[]> => {
    const response: AxiosResponse<PaginatedResponse<HubProjectSubscription>> = await apiActions.get(`/api/v1/hubprojectsubscriptions/`, headers);
    return response.data.results || [];
};

export const getHubProjectSubscription = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubProjectSubscription> => {
    const response: AxiosResponse<HubProjectSubscription> = await apiActions.get(`/api/v1/hubprojectsubscriptions/${reference}/`, headers);
    return response.data;
};

export const createHubProjectSubscription = async (data: createHubProjectSubscription, headers: { headers: { Authorization: string } }): Promise<HubProjectSubscription> => {
    const response: AxiosResponse<HubProjectSubscription> = await apiActions.post(`/api/v1/hubprojectsubscriptions/`, data, headers);
    return response.data;
};

export const updateHubProjectSubscription = async (reference: string, data: updateHubProjectSubscription, headers: { headers: { Authorization: string } }): Promise<HubProjectSubscription> => {
    const response: AxiosResponse<HubProjectSubscription> = await apiActions.patch(`/api/v1/hubprojectsubscriptions/${reference}/`, data, headers);
    return response.data;
};

export const deleteHubProjectSubscription = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubProjectSubscription> => {
    const response: AxiosResponse<HubProjectSubscription> = await apiActions.delete(`/api/v1/hubprojectsubscriptions/${reference}/`, headers);
    return response.data;
};