export interface OrderFileType {
  id: string;
  fileStorageName: string;
  url: string;
  name: string;
  description: string;
}

export interface CurrencyType {
  symbol: string;
  rate: number;
}

export interface OrderPackageType {
  title: string;
  price: string;
  orderRevision: number;
  currency: CurrencyType;
  description: string;
  features: string[];
}

export interface OrderTemplateType {
  name: string;
  url: string;
  description: string;
}

export interface OrderObjectType {
  [x: string]: any;
  id: string;
  orderId: string;
  package: OrderPackageType;
  note: string;
  requireCoverLetter: boolean;
  requireLinkedInOptimization: boolean;
  type: string;
  status: string;
  template: OrderTemplateType;
  resume: OrderFileType;
  completedFiles: OrderFileType[];
  coverLetterDetails: string;
  linkedInUrl: string;
  date: Date;
  deliveryDate: string;
}


