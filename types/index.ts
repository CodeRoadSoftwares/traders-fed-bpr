export interface User {
  _id: string;
  name: string;
  fatherName: string;
  aadharNumber: string;
  email: string;
  phone: number;
  address: {
    line?: string;
    district?: string;
    pincode?: number;
  };
  role: "SHOP" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  _id: string;
  userId: string;
  shopName: string;
  registrationNumber: string;
  licenseNumber: string;
  category: string;
  photos?: string[];
  primaryPhoto?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  certificateNumber: string;
  certificateIssuedAt?: string;
  certificateExpiryDate?: string;
  certificateStatus: "PENDING" | "ACTIVE" | "REJECTED" | "EXPIRED";
  actionBy?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
    phone: number;
    address: {
      line?: string;
      district?: string;
      pincode?: number;
    };
  };
}

export interface NoticeAttachment {
  url: string;
  name: string;
  type: "image" | "pdf";
}

export interface Notice {
  _id: string;
  createdBy: string | { _id: string; name: string };
  title: string;
  message: string;
  visibility: "PUBLIC" | "SHOPS";
  urgent: boolean;
  attachments?: NoticeAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Fund {
  _id: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string | { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DashboardStats {
  shops: {
    total: number;
    pending: number;
    active: number;
    rejected: number;
  };
  users: number;
  notices: number;
  funds: {
    income: number;
    expense: number;
    balance: number;
  };
}

export interface CarouselSlide {
  imageUrl: string;
  title: string;
  subtitle?: string;
}
