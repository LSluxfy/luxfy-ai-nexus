
// Types for CRM API integration

export interface CRMRow {
  id: number;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  notes: string;
  price: number;
  responsibleId: number;
  chatId: number;
  status: string;
  interests: string[];
  logs: CRMLog[];
  activities: CRMActivity[];
  createdBy: 'agent' | 'attendant' | 'user';
  delivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface CRMLog {
  title: string;
  description: string;
  createdAt: string;
}

export interface CRMActivity {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface CRMTables {
  [key: string]: string;
}

export interface CRMData {
  id: number;
  tables: string; // JSON string
  rows: string; // JSON string
  Agent?: ApiAgent;
  createAt: string;
  updatedAt: string;
}

export interface CRMApiResponse {
  message: string;
  crm: CRMData;
}

export interface CRMUpdateRequest {
  tables?: string;
  rows?: string;
}

// Parsed data interfaces for easier usage
export interface ParsedCRMData {
  id: number;
  tables: CRMTables;
  rows: CRMRow[];
  Agent?: ApiAgent;
  createAt: string;
  updatedAt: string;
}

// Lead status type for better type safety
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed' | 'lost';

// Import ApiAgent type
import type { ApiAgent } from './agent-api';
