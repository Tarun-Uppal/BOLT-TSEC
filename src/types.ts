export type ClaimStatus = 'pending' | 'under-review' | 'approved' | 'rejected' | 'resolved';

export type WarrantyStatus = 'active' | 'expiring' | 'expired' | 'extended';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  purchaseDate: string;
  warrantyExpiry: string;
  originalWarrantyMonths: number;
  extendedMonths: number;
  serialNumber: string;
  retailer: string;
  receiptUploaded: boolean;
  icon: string;
}

export interface Claim {
  id: string;
  productId: string;
  productName: string;
  productIcon: string;
  issue: string;
  description: string;
  status: ClaimStatus;
  filedDate: string;
  updatedDate: string;
  referenceNumber: string;
  timeline: ClaimEvent[];
}

export interface ClaimEvent {
  date: string;
  status: ClaimStatus;
  note: string;
}

export interface ExtensionPlan {
  id: string;
  months: number;
  label: string;
  features: string[];
  popular?: boolean;
}

export type TabId = 'dashboard' | 'claims' | 'products' | 'receipts';
