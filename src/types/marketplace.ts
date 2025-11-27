// Marketplace Discovery Types for ConfirmIT

export interface MarketplaceProfile {
  // Core Info
  tagline: string; // One-liner, e.g., "Apple Products Specialist"
  description: string; // Long-form, max 500 chars

  // Offerings
  products: string[]; // ["iPhone", "MacBook", "iPad"]
  services: string[]; // ["Repair", "Trade-in", "Warranty"]

  // Visual Assets
  photos: {
    primary: string; // Main thumbnail (Cloudinary URL)
    gallery: string[]; // Additional 4-9 images
  };

  // Operating Hours
  hours: BusinessHours;

  // Contact Methods
  contact: {
    phone: string;
    email: string;
    website: string;
    whatsapp?: string | null;
    instagram?: string | null;
  };

  // Location (with coordinates for geo-search)
  location: {
    address: string;
    area: string; // e.g., "Ikeja"
    city: string; // e.g., "Lagos"
    state: string; // e.g., "Lagos"
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface BusinessHours {
  monday: TimeSlot | null;
  tuesday: TimeSlot | null;
  wednesday: TimeSlot | null;
  thursday: TimeSlot | null;
  friday: TimeSlot | null;
  saturday: TimeSlot | null;
  sunday: TimeSlot | null;
}

export interface TimeSlot {
  open: string; // "09:00"
  close: string; // "18:00"
}

export interface MarketplaceStatus {
  status: 'active' | 'expired' | 'pending_profile' | 'inactive';
  registeredAt: Date;
  expiryDate: Date;
  lastRenewedAt?: Date;
}

export interface MarketplaceAnalytics {
  views: number; // Profile page views
  websiteClicks: number; // "Visit Website" clicks
  directionRequests: number; // "Get Directions" clicks
  phoneClicks: number; // "Call Now" clicks
  reviewsCount: number; // Total reviews
  lastViewedAt: Date | null;

  // Search Performance (optional, for advanced analytics)
  searchImpressions?: number; // How many times shown in search
  searchKeywords?: Array<{ keyword: string; count: number }>; // Top keywords
}

// Search Result Item (lightweight, for listing pages)
export interface MarketplaceSearchResult {
  businessId: string;
  name: string;
  tagline: string;
  trustScore: number;
  products: string[];
  services: string[];
  distance: number; // km from user
  rating: number; // 0-5 stars
  reviewCount: number;
  thumbnail: string; // Primary photo URL
  location: {
    area: string;
    city: string;
  };
  isOpen: boolean; // Calculated based on current time + business hours
  verified: boolean;
  tier: number;
}

// Full Business with Marketplace Data
export interface BusinessWithMarketplace {
  // Core business fields (from existing Business type)
  businessId: string;
  name: string;
  category: string;
  trustScore: number;
  verification: {
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    tier: 1 | 2 | 3;
    verified: boolean;
  };

  // Marketplace extension
  marketplace: {
    status: MarketplaceStatus;
    profile: MarketplaceProfile;
    analytics: MarketplaceAnalytics;
  };
}

// Search Query Parameters
export interface MarketplaceSearchParams {
  query: string; // "iPhone 13" or "Laptop" or "Wedding Photographer"

  // User Location (for proximity ranking)
  lat?: number;
  lng?: number;
  city?: string; // Fallback if geolocation denied

  // Filters (optional)
  radius?: number; // km, default 10
  minTrustScore?: number; // e.g., 70
  category?: string; // e.g., "Electronics"

  // Pagination
  page?: number;
  limit?: number; // default 5
}

// Search Response
export interface MarketplaceSearchResponse {
  results: MarketplaceSearchResult[];
  total: number;
  page: number;
  hasMore: boolean;
  userLocation?: {
    lat: number;
    lng: number;
    city: string;
  };
}

// Action Tracking (for analytics)
export type MarketplaceAction = 'view' | 'website_click' | 'directions' | 'phone_call' | 'whatsapp' | 'instagram';

export interface TrackActionRequest {
  businessId: string;
  action: MarketplaceAction;
  metadata?: {
    searchQuery?: string;
    userLocation?: { lat: number; lng: number };
  };
}

// Renewal Payment
export interface RenewalRequest {
  businessId: string;
  paymentMethod: 'paystack' | 'crypto';
  duration: 'annual'; // Future: 'monthly', 'quarterly'
}

// Profile Update Request
export interface UpdateMarketplaceProfileRequest {
  tagline?: string;
  description?: string;
  products?: string[];
  services?: string[];
  photos?: {
    primary?: string;
    gallery?: string[];
  };
  hours?: Partial<BusinessHours>;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    whatsapp?: string | null;
    instagram?: string | null;
  };
  location?: {
    address?: string;
    area?: string;
    city?: string;
    state?: string;
    coordinates?: { lat: number; lng: number };
  };
}
