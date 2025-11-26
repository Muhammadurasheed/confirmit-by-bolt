# ConfirmIT Trust Directory - Product Vision (Simplified & Focused)

**Problem**: In Nigeria, buyers don't know which businesses are legitimate. Fraud is rampant.

**Solution**: ConfirmIT is the trust verification layer - like Google's "Verified Business" checkmark but for the entire Nigerian e-commerce ecosystem.

---

## 🎯 What We ARE Building

### User Experience
```
User Journey:
1. Search: "Where can I buy iPhone 13 in Lagos?"
2. Results: List of 5 VERIFIED businesses within 10km
3. Profile: Click business → See trust score, reviews, location, contact
4. Action:
   - Click "Visit Website" → Opens business website
   - Click "Get Directions" → Opens Google Maps
   - Click "Call" → Dial phone number
```

### Core Features (MVP)

#### 1. **Search & Discovery**
- Simple search bar: "iPhone 13 Lagos" or "Laptop Abuja"
- Filters: Category, Location, Trust Score, Distance
- Results sorted by: Trust Score (60%) + Distance (40%)

#### 2. **Business Profiles**
Each verified business has:
- ✓ Verification Badge (Tier 1/2/3)
- Trust Score (0-100)
- Reviews & Ratings (5-star system)
- Contact Info (Phone, Email, Website)
- Location (Address + Google Maps pin)
- Photos (Logo, storefront, products)
- Categories/Products they sell
- Business Hours
- Social Media links

#### 3. **Verification System**
- Business applies for verification
- Submits: CAC documents, bank statements, physical address proof
- Admin reviews and approves
- Business gets NFT Trust Badge on Hedera blockchain
- 3 Tiers based on verification depth

#### 4. **Review System**
- Users can rate businesses (1-5 stars)
- Leave text reviews
- Reviews are verified (must prove transaction)
- Businesses can respond to reviews

#### 5. **Business Dashboard**
- View analytics (profile views, clicks to website, calls)
- Update business info
- Respond to reviews
- See verification status

---

## 🚫 What We ARE NOT Building

- ❌ Shopping cart / checkout
- ❌ Payment processing
- ❌ Inventory management
- ❌ Order fulfillment
- ❌ Shipping logistics
- ❌ In-app messaging (users contact business directly)

**Why?** Because ConfirmIT is **infrastructure**, not a marketplace.

---

## 🏗️ Technical Architecture (Simplified)

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase (Postgres)
- **Auth**: Supabase Auth
- **Maps**: Google Maps Platform API
- **Search**: Supabase Full-Text Search + PostGIS (geo-queries)
- **Blockchain**: Hedera Hashgraph (Trust ID NFTs)
- **Hosting**: Vercel
- **File Storage**: Supabase Storage (or Cloudinary)

### Database Schema

```sql
-- Businesses (Verified Sellers)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategories TEXT[],

  -- Contact
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,

  -- Location (PostGIS for geo-queries)
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  coordinates GEOGRAPHY(POINT, 4326),

  -- Verification
  verified BOOLEAN DEFAULT false,
  verification_tier INTEGER CHECK (verification_tier IN (1, 2, 3)),
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  nft_token_id TEXT,

  -- Media
  logo_url TEXT,
  cover_image_url TEXT,
  photos TEXT[],

  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Verification (did they really transact?)
  verified BOOLEAN DEFAULT false,
  transaction_proof TEXT, -- Receipt image, etc.

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Categories (for filtering)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT, -- Lucide icon name
  parent_id UUID REFERENCES categories(id)
);

-- Verification Requests (businesses apply here)
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id),

  -- Documents
  cac_document_url TEXT,
  bank_statement_url TEXT,
  address_proof_url TEXT,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Search Index
CREATE INDEX idx_businesses_location ON businesses USING GIST(coordinates);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_trust_score ON businesses(trust_score DESC);
CREATE INDEX idx_businesses_search ON businesses USING GIN(to_tsvector('english', name || ' ' || description));
```

---

## 🔄 User Flows

### Flow 1: User Searches for Business

```
1. User lands on homepage
2. Types: "iPhone 13 Lagos"
3. System:
   - Extracts: product="iPhone 13", location="Lagos"
   - Queries businesses:
     WHERE category LIKE '%electronics%'
     AND city = 'Lagos'
     AND verified = true
     ORDER BY trust_score DESC, distance ASC
4. Shows results (max 20)
5. User clicks business card → Goes to profile page
6. User sees full details, reviews, map
7. User clicks "Visit Website" or "Get Directions"
```

### Flow 2: Business Registers & Gets Verified

```
1. Business owner signs up
2. Fills registration form (name, category, location, contact)
3. Uploads verification documents (CAC, bank statement, address proof)
4. Submits for review
5. Admin reviews documents
6. If approved:
   - Business status → 'active'
   - verified → true
   - Gets NFT Trust Badge
   - Profile goes live
7. Business can now be found in searches
```

### Flow 3: User Leaves Review

```
1. User finds business profile
2. Clicks "Write Review"
3. Rates 1-5 stars + optional text comment
4. (Optional) Uploads transaction proof (receipt screenshot)
5. Submits review
6. Review appears on business profile
7. Trust score recalculates based on new review
```

---

## 📊 Trust Score Algorithm

```typescript
// Trust Score = Weighted average of multiple signals
function calculateTrustScore(business: Business): number {
  const signals = {
    verification: {
      tier1: 30,
      tier2: 50,
      tier3: 70,
    },
    reviews: {
      weight: 0.3,
      score: (business.averageRating / 5) * 100,
    },
    volume: {
      weight: 0.2,
      score: Math.min((business.reviewCount / 50) * 100, 100),
    },
    recency: {
      weight: 0.1,
      score: calculateRecencyScore(business.lastReviewDate),
    },
  };

  const baseScore = signals.verification[`tier${business.verificationTier}`];
  const reviewScore = signals.reviews.score * signals.reviews.weight;
  const volumeScore = signals.volume.score * signals.volume.weight;
  const recencyScore = signals.recency.score * signals.recency.weight;

  return Math.min(
    baseScore + reviewScore + volumeScore + recencyScore,
    100
  );
}
```

---

## 🎨 UI/UX Principles

1. **Search-First**: Big search bar on homepage (like Google)
2. **Trust Signals Everywhere**: Verification badge, score, review count
3. **Mobile-First**: 70% of Nigerian users are on mobile
4. **Fast**: < 2s page load, instant search results
5. **Clear CTAs**: "Visit Website" and "Get Directions" buttons prominent
6. **Maps Integration**: Show business location visually

---

## 🚀 Go-to-Market Strategy

### Phase 1: MVP (2-3 weeks)
- Search & results page
- Business profiles
- Manual verification (admin dashboard)
- Basic review system

### Phase 2: Scale (Month 2)
- Advanced search filters
- Business analytics dashboard
- Automated verification (doc scanning AI)
- Mobile app (PWA)

### Phase 3: B2B (Month 3)
- Trust API (Jiji/Jumia can integrate)
- White-label solution
- Premium verification tiers
- Advertising for businesses

---

## 💰 Business Model

1. **Verification Fees**:
   - Tier 1: ₦50,000 (basic verification)
   - Tier 2: ₦150,000 (enhanced verification)
   - Tier 3: ₦500,000 (premium + audit)

2. **Premium Profiles**:
   - Featured in search results
   - Enhanced analytics
   - Priority customer support

3. **Trust API** (B2B):
   - Marketplaces pay to verify their sellers
   - ₦10/verification check

4. **Advertising**:
   - Sponsored listings in search results

---

**This is the ConfirmIT that scales. Simple, focused, defensible.**

**Bismillah. Let's build this.**
