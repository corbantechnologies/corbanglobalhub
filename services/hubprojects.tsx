"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface HubProject {
    name: string;
    id: number;
    hub: string;
    code: string;
    description: string;
    created_by: string;
    updated_by: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    reference: string;
}

interface createHubProject {
    name: string;
    description: string;
    is_active: boolean;
    hub: string; // hub code
}

interface updateHubProject {
    name?: string;
    description?: string;
    is_active?: boolean;
}

export const getHubProjects = async (headers: { headers: { Authorization: string } }): Promise<HubProject[]> => {
    const response: AxiosResponse<PaginatedResponse<HubProject>> = await apiActions.get(`/api/v1/hubprojects/`, headers);
    return response.data.results || [];
};

export const getHubProject = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubProject> => {
    const response: AxiosResponse<HubProject> = await apiActions.get(`/api/v1/hubprojects/${reference}/`, headers);
    return response.data;
};

export const createHubProject = async (data: createHubProject, headers: { headers: { Authorization: string } }): Promise<HubProject> => {
    const response: AxiosResponse<HubProject> = await apiActions.post(`/api/v1/hubprojects/`, data, headers);
    return response.data;
};

export const updateHubProject = async (reference: string, data: updateHubProject, headers: { headers: { Authorization: string } }): Promise<HubProject> => {
    const response: AxiosResponse<HubProject> = await apiActions.patch(`/api/v1/hubprojects/${reference}/`, data, headers);
    return response.data;
};

export const deleteHubProject = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubProject> => {
    const response: AxiosResponse<HubProject> = await apiActions.delete(`/api/v1/hubprojects/${reference}/`, headers);
    return response.data;
};