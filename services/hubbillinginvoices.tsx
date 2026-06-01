"use client";

import { apiActions, apiMultipartActions } from "@/tools/axios";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "./general";
import { HubBillingInvoiceLine } from "./hubbillinginvoicelines";
import { MinifiedHub } from "./hubs";

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
    hub_details: MinifiedHub;
}

// STATUS_CHOICES = [
//         ("Unpaid", "Unpaid"),
//         ("Paid", "Paid"),
//         ("Overdue", "Overdue"),
//     ]

interface updateHubBillingInvoice {
    kra_receipt?: File | null;
    kra_cu_invoice_number?: string;
    status?: string;
}

export const getHubBillingInvoices = async (headers: { headers: { Authorization: string } }, params?: any): Promise<HubBillingInvoice[]> => {
    const response: AxiosResponse<PaginatedResponse<HubBillingInvoice>> = await apiActions.get(`/api/v1/hubbillinginvoices/`, { ...headers, params });
    return response.data.results || [];
};

export const getHubBillingInvoice = async (reference: string, headers: { headers: { Authorization: string } }): Promise<HubBillingInvoice> => {
    const response: AxiosResponse<HubBillingInvoice> = await apiActions.get(`/api/v1/hubbillinginvoices/${reference}/`, headers);
    return response.data;
};


export const updateHubBillingInvoice = async (reference: string, data: FormData, headers: { headers: { Authorization: string } }): Promise<HubBillingInvoice> => {
    const response: AxiosResponse<HubBillingInvoice> = await apiMultipartActions.patch(`/api/v1/hubbillinginvoices/${reference}/`, data, headers);
    return response.data;
};
