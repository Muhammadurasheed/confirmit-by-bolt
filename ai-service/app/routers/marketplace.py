"""
ConfirmIT Marketplace API
Handles business search, discovery, and marketplace management
"""
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging
import math
from app.core.firebase import db

router = APIRouter()
logger = logging.getLogger(__name__)


# ============================================================
# 📦 Pydantic Models
# ============================================================

class BusinessHours(BaseModel):
    monday: Optional[Dict[str, str]] = None
    tuesday: Optional[Dict[str, str]] = None
    wednesday: Optional[Dict[str, str]] = None
    thursday: Optional[Dict[str, str]] = None
    friday: Optional[Dict[str, str]] = None
    saturday: Optional[Dict[str, str]] = None
    sunday: Optional[Dict[str, str]] = None


class Coordinates(BaseModel):
    lat: float
    lng: float


class MarketplaceProfile(BaseModel):
    tagline: str
    description: str
    products: List[str] = []
    services: List[str] = []
    photos: Dict[str, Any] = {"primary": "", "gallery": []}
    hours: BusinessHours
    contact: Dict[str, Optional[str]]
    location: Dict[str, Any]


class MarketplaceSearchResult(BaseModel):
    businessId: str
    name: str
    tagline: str
    trustScore: int
    products: List[str]
    services: List[str]
    distance: float
    rating: float
    reviewCount: int
    thumbnail: str
    location: Dict[str, str]
    isOpen: bool
    verified: bool
    tier: int


class TrackActionRequest(BaseModel):
    action: str = Field(..., description="view | website_click | directions | phone_call | whatsapp | instagram")
    metadata: Optional[Dict[str, Any]] = None


class UpdateMarketplaceProfileRequest(BaseModel):
    tagline: Optional[str] = None
    description: Optional[str] = None
    products: Optional[List[str]] = None
    services: Optional[List[str]] = None
    photos: Optional[Dict[str, Any]] = None
    hours: Optional[BusinessHours] = None
    contact: Optional[Dict[str, Optional[str]]] = None
    location: Optional[Dict[str, Any]] = None


# ============================================================
# 🧮 Helper Functions
# ============================================================

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculate distance between two coordinates using Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth's radius in km

    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)

    a = (math.sin(dlat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(dlng / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def is_business_open_now(hours: Dict) -> bool:
    """
    Check if business is currently open based on hours
    """
    if not hours:
        return False

    now = datetime.now()
    day_name = now.strftime("%A").lower()  # "monday", "tuesday", etc.

    day_hours = hours.get(day_name)
    if not day_hours or day_hours is None:
        return False

    try:
        open_time = datetime.strptime(day_hours["open"], "%H:%M").time()
        close_time = datetime.strptime(day_hours["close"], "%H:%M").time()
        current_time = now.time()

        return open_time <= current_time <= close_time
    except (KeyError, ValueError):
        return False


def calculate_relevance_score(business: Dict, user_lat: Optional[float], user_lng: Optional[float], radius: float) -> float:
    """
    Calculate relevance score for ranking
    60% trust score + 40% proximity
    """
    trust_score = business.get("trustScore", 50) / 100  # Normalize to 0-1

    if user_lat and user_lng:
        coords = business.get("marketplace", {}).get("profile", {}).get("location", {}).get("coordinates", {})
        if coords and "lat" in coords and "lng" in coords:
            distance = calculate_distance(user_lat, user_lng, coords["lat"], coords["lng"])
            # Normalize distance score (closer = higher score)
            distance_score = max(0, 1 - (distance / radius))
            return (trust_score * 0.6) + (distance_score * 0.4)

    # If no location provided, rank by trust score only
    return trust_score


def search_text_matches(query: str, business: Dict) -> bool:
    """
    Check if search query matches business data
    """
    query_lower = query.lower()
    marketplace = business.get("marketplace", {})
    profile = marketplace.get("profile", {})

    searchable_fields = [
        business.get("name", ""),
        profile.get("tagline", ""),
        profile.get("description", ""),
        business.get("category", ""),
        *profile.get("products", []),
        *profile.get("services", [])
    ]

    searchable_text = " ".join(str(field) for field in searchable_fields).lower()

    return query_lower in searchable_text


# ============================================================
# 🔍 API ENDPOINTS
# ============================================================

@router.get("/marketplace/search")
async def search_businesses(
    q: str = Query(..., description="Search query (e.g., 'iPhone', 'Laptop')"),
    lat: Optional[float] = Query(None, description="User latitude"),
    lng: Optional[float] = Query(None, description="User longitude"),
    city: Optional[str] = Query(None, description="City filter (fallback if no geolocation)"),
    radius: float = Query(10, description="Search radius in kilometers"),
    minTrustScore: Optional[int] = Query(None, description="Minimum trust score filter"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(5, ge=1, le=20, description="Results per page")
) -> Dict[str, Any]:
    """
    Search for verified businesses in the marketplace

    Returns businesses ranked by:
    - Trust score (60%)
    - Proximity to user (40%)
    """
    try:
        logger.info(f"Marketplace search: q={q}, city={city}, lat={lat}, lng={lng}")

        # Step 1: Query active businesses from Firestore
        businesses_ref = db.collection("businesses")
        query = businesses_ref.where("marketplace.status.status", "==", "active")

        # Apply city filter if provided (and no geolocation)
        if city and not (lat and lng):
            query = query.where("marketplace.profile.location.city", "==", city)

        # Execute query
        businesses_snapshot = query.stream()
        businesses = []

        for doc in businesses_snapshot:
            business_data = doc.to_dict()
            business_data["businessId"] = doc.id
            businesses.append(business_data)

        logger.info(f"Found {len(businesses)} active businesses in database")

        # Step 2: Filter by search query
        if q:
            businesses = [b for b in businesses if search_text_matches(q, b)]

        logger.info(f"After text search: {len(businesses)} businesses")

        # Step 3: Calculate distances (if user location provided)
        if lat and lng:
            for business in businesses:
                coords = business.get("marketplace", {}).get("profile", {}).get("location", {}).get("coordinates", {})
                if coords and "lat" in coords and "lng" in coords:
                    business["distance"] = calculate_distance(lat, lng, coords["lat"], coords["lng"])
                else:
                    business["distance"] = 999  # Far away if no coords

            # Filter by radius
            businesses = [b for b in businesses if b.get("distance", 999) <= radius]
            logger.info(f"After radius filter ({radius}km): {len(businesses)} businesses")
        else:
            # No user location, set distance to 0 for all
            for business in businesses:
                business["distance"] = 0

        # Step 4: Filter by minimum trust score
        if minTrustScore:
            businesses = [b for b in businesses if b.get("trustScore", 0) >= minTrustScore]

        # Step 5: Calculate relevance scores and rank
        for business in businesses:
            business["relevanceScore"] = calculate_relevance_score(business, lat, lng, radius)

        businesses.sort(key=lambda x: x.get("relevanceScore", 0), reverse=True)

        # Step 6: Format results
        formatted_results = []
        for business in businesses:
            marketplace = business.get("marketplace", {})
            profile = marketplace.get("profile", {})
            location = profile.get("location", {})
            photos = profile.get("photos", {})

            formatted_results.append({
                "businessId": business["businessId"],
                "name": business.get("name", "Unknown Business"),
                "tagline": profile.get("tagline", ""),
                "trustScore": business.get("trustScore", 50),
                "products": profile.get("products", []),
                "services": profile.get("services", []),
                "distance": round(business.get("distance", 0), 1),
                "rating": business.get("rating", 0),
                "reviewCount": business.get("reviewCount", 0),
                "thumbnail": photos.get("primary", ""),
                "location": {
                    "area": location.get("area", ""),
                    "city": location.get("city", "")
                },
                "isOpen": is_business_open_now(profile.get("hours", {})),
                "verified": business.get("verification", {}).get("verified", False),
                "tier": business.get("verification", {}).get("tier", 1)
            })

        # Step 7: Pagination
        total = len(formatted_results)
        start = (page - 1) * limit
        end = start + limit
        paginated_results = formatted_results[start:end]

        logger.info(f"Returning {len(paginated_results)} results (page {page})")

        return {
            "results": paginated_results,
            "total": total,
            "page": page,
            "hasMore": end < total,
            "userLocation": {"lat": lat, "lng": lng, "city": city} if lat and lng else None
        }

    except Exception as e:
        logger.error(f"Marketplace search error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.post("/marketplace/business/{business_id}/action")
async def track_business_action(business_id: str, request: TrackActionRequest) -> Dict[str, Any]:
    """
    Track user actions on business profiles
    Increments analytics counters for views, clicks, etc.
    """
    try:
        logger.info(f"Tracking action: {request.action} for business {business_id}")

        business_ref = db.collection("businesses").document(business_id)
        business_doc = business_ref.get()

        if not business_doc.exists:
            raise HTTPException(status_code=404, detail="Business not found")

        # Map action types to analytics fields
        action_field_map = {
            "view": "marketplace.analytics.views",
            "website_click": "marketplace.analytics.websiteClicks",
            "directions": "marketplace.analytics.directionRequests",
            "phone_call": "marketplace.analytics.phoneClicks",
            "whatsapp": "marketplace.analytics.whatsappClicks",
            "instagram": "marketplace.analytics.instagramClicks"
        }

        field = action_field_map.get(request.action)
        if not field:
            raise HTTPException(status_code=400, detail=f"Invalid action: {request.action}")

        # Increment counter using Firestore increment
        from google.cloud.firestore import Increment

        update_data = {
            field: Increment(1),
            "marketplace.analytics.lastViewedAt": datetime.now()
        }

        business_ref.update(update_data)

        logger.info(f"Successfully tracked {request.action} for {business_id}")

        return {
            "success": True,
            "message": f"Action '{request.action}' tracked successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Action tracking error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to track action: {str(e)}")


@router.get("/marketplace/business/{business_id}")
async def get_marketplace_business(business_id: str) -> Dict[str, Any]:
    """
    Get full business profile with marketplace data
    Auto-increments view counter
    """
    try:
        logger.info(f"Fetching marketplace business: {business_id}")

        business_ref = db.collection("businesses").document(business_id)
        business_doc = business_ref.get()

        if not business_doc.exists:
            raise HTTPException(status_code=404, detail="Business not found")

        business_data = business_doc.to_dict()
        business_data["businessId"] = business_id

        # Auto-increment view counter (fire-and-forget)
        try:
            from google.cloud.firestore import Increment
            business_ref.update({
                "marketplace.analytics.views": Increment(1),
                "marketplace.analytics.lastViewedAt": datetime.now()
            })
        except Exception as e:
            logger.warning(f"Failed to increment views: {str(e)}")

        return {
            "success": True,
            "data": business_data
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get business error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch business: {str(e)}")


@router.patch("/marketplace/business/{business_id}")
async def update_marketplace_profile(business_id: str, request: UpdateMarketplaceProfileRequest) -> Dict[str, Any]:
    """
    Update business marketplace profile
    (In production, verify JWT token to ensure user owns the business)
    """
    try:
        logger.info(f"Updating marketplace profile for business: {business_id}")

        business_ref = db.collection("businesses").document(business_id)
        business_doc = business_ref.get()

        if not business_doc.exists:
            raise HTTPException(status_code=404, detail="Business not found")

        # Build update data
        update_data = {}

        if request.tagline is not None:
            update_data["marketplace.profile.tagline"] = request.tagline
        if request.description is not None:
            update_data["marketplace.profile.description"] = request.description
        if request.products is not None:
            update_data["marketplace.profile.products"] = request.products
        if request.services is not None:
            update_data["marketplace.profile.services"] = request.services
        if request.photos is not None:
            update_data["marketplace.profile.photos"] = request.photos
        if request.hours is not None:
            update_data["marketplace.profile.hours"] = request.hours.dict()
        if request.contact is not None:
            update_data["marketplace.profile.contact"] = request.contact
        if request.location is not None:
            update_data["marketplace.profile.location"] = request.location

        # Update timestamp
        update_data["marketplace.profile.updatedAt"] = datetime.now()

        business_ref.update(update_data)

        logger.info(f"Successfully updated marketplace profile for {business_id}")

        return {
            "success": True,
            "message": "Marketplace profile updated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Profile update error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")


@router.get("/marketplace/stats")
async def get_marketplace_stats() -> Dict[str, Any]:
    """
    Get marketplace statistics for homepage
    """
    try:
        logger.info("Fetching marketplace stats")

        # Count active businesses
        active_businesses = db.collection("businesses")\
            .where("marketplace.status.status", "==", "active")\
            .stream()

        active_count = sum(1 for _ in active_businesses)

        # In production, calculate these from actual data
        # For now, return sample stats
        return {
            "totalBusinesses": active_count,
            "averageRating": 4.8,
            "totalSearches": 10000,  # Would track this in separate collection
            "verificationRate": 100
        }

    except Exception as e:
        logger.error(f"Stats fetch error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {str(e)}")
