"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";

export interface HubBillingInvoiceLine {
    id: number;
    hub_billing_invoice: string;
    project_name: string;
    service_name: string;
    amount: string;
    code: string;
    created_at: string;
    updated_at: string;
    reference: string;
}


export const getHubBillingInvoiceLines = async (headers: { headers: { Authorization: string } }): Promise<HubBillingInvoiceLine[]> => {
    const response: AxiosResponse<PaginatedResponse<HubBillingInvoiceLine>> = await apiActions.get(`/api/v1/hubbillinginvoicelines/`, headers);
    return response.data.results || [];
};

export const getHubBillingInvoiceLine = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubBillingInvoiceLine> => {
    const response: AxiosResponse<HubBillingInvoiceLine> = await apiActions.get(`/api/v1/hubbillinginvoicelines/${reference}/`, headers);
    return response.data;
};
