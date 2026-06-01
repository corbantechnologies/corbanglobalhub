"use client";

import { apiActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { HubBillingInvoiceLine } from "./hubbillinginvoicelines";

export interface HubBillingInvoice {
    id: number;
    hub: string;
    billing_month: string;
    total_amount: string;
    status: string;
    kra_receipt: string;
    kra_cu_invoice_number: string;
    code: string;
    created_at: string;
    updated_at: string;
    reference: string;
    lines: HubBillingInvoiceLine[];
}


interface updateHubBillingInvoice {
    kra_receipt?: File | null;
    kra_cu_invoice_number?: string;
}

export const getHubBillingInvoices = async (headers: { headers: { Authorization: string } }): Promise<HubBillingInvoice[]> => {
    const response: AxiosResponse<PaginatedResponse<HubBillingInvoice>> = await apiActions.get(`/api/v1/hubbillinginvoices/`, headers);
    return response.data.results || [];
};

export const getHubBillingInvoice = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubBillingInvoice> => {
    const response: AxiosResponse<HubBillingInvoice> = await apiActions.get(`/api/v1/hubbillinginvoices/${reference}/`, headers);
    return response.data;
};


export const updateHubBillingInvoice = async (reference: string, data: updateHubBillingInvoice, headers: { headers: { Authorization: string } }): Promise<HubBillingInvoice> => {
    const response: AxiosResponse<HubBillingInvoice> = await apiActions.patch(`/api/v1/hubbillinginvoices/${reference}/`, data, headers);
    return response.data;
};
