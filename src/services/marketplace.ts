/**
 * Marketplace API Service
 * Connects frontend to backend marketplace endpoints
 */

import { API_ENDPOINTS } from "@/lib/constants";
import type {
  MarketplaceSearchParams,
  MarketplaceSearchResponse,
  MarketplaceAction,
  UpdateMarketplaceProfileRequest
} from "@/types/marketplace";

const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'https://confirmit-ai-service-65303852229.us-central1.run.app';

/**
 * Search for businesses in the marketplace
 */
export async function searchMarketplace(params: MarketplaceSearchParams): Promise<MarketplaceSearchResponse> {
  const queryParams = new URLSearchParams();

  queryParams.append('q', params.query);

  if (params.lat) queryParams.append('lat', params.lat.toString());
  if (params.lng) queryParams.append('lng', params.lng.toString());
  if (params.city) queryParams.append('city', params.city);
  if (params.radius) queryParams.append('radius', params.radius.toString());
  if (params.minTrustScore) queryParams.append('minTrustScore', params.minTrustScore.toString());

  queryParams.append('page', (params.page || 1).toString());
  queryParams.append('limit', (params.limit || 5).toString());

  const response = await fetch(`${AI_SERVICE_URL}/api/marketplace/search?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Search failed' }));
    throw new Error(error.message || 'Failed to search marketplace');
  }

  return response.json();
}

/**
 * Track user action on business profile
 */
export async function trackBusinessAction(
  businessId: string,
  action: MarketplaceAction,
  metadata?: { searchQuery?: string; userLocation?: { lat: number; lng: number } }
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${AI_SERVICE_URL}/api/marketplace/business/${businessId}/action`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, metadata }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Action tracking failed' }));
    throw new Error(error.message || 'Failed to track action');
  }

  return response.json();
}

/**
 * Get marketplace business profile
 */
export async function getMarketplaceBusiness(businessId: string): Promise<any> {
  const response = await fetch(`${AI_SERVICE_URL}/api/marketplace/business/${businessId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Business not found' }));
    throw new Error(error.message || 'Failed to fetch business');
  }

  const result = await response.json();
  return result.data;
}

/**
 * Update marketplace profile
 */
export async function updateMarketplaceProfile(
  businessId: string,
  updates: UpdateMarketplaceProfileRequest
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${AI_SERVICE_URL}/api/marketplace/business/${businessId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Update failed' }));
    throw new Error(error.message || 'Failed to update profile');
  }

  return response.json();
}

/**
 * Get marketplace statistics
 */
export async function getMarketplaceStats(): Promise<{
  totalBusinesses: number;
  averageRating: number;
  totalSearches: number;
  verificationRate: number;
}> {
  const response = await fetch(`${AI_SERVICE_URL}/api/marketplace/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch marketplace stats');
  }

  return response.json();
}
