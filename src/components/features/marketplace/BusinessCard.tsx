import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TrustScoreGauge from "@/components/shared/TrustScoreGauge";
import { Star, MapPin, Clock, ExternalLink, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { MarketplaceSearchResult } from "@/types/marketplace";

interface BusinessCardProps {
  business: MarketplaceSearchResult;
  index: number;
}

const BusinessCard = ({ business, index }: BusinessCardProps) => {
  return (
    <Card className="hover:shadow-elegant transition-all duration-300 relative overflow-hidden group">
      {/* Thumbnail Image */}
      {business.thumbnail && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={business.thumbnail}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {business.isOpen && (
            <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Open Now
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
              {business.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {business.tagline}
            </p>
          </div>

          {business.verified && (
            <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trust Score */}
        <div className="flex items-center gap-4">
          <TrustScoreGauge score={business.trustScore} size="sm" />

          {business.rating > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning fill-warning" />
              <span className="font-semibold">{business.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({business.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Location & Distance */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span>
            {business.location.area}, {business.location.city}
          </span>
          {business.distance > 0 && (
            <Badge variant="outline" className="ml-auto">
              {business.distance.toFixed(1)}km away
            </Badge>
          )}
        </div>

        {/* Products/Services */}
        {(business.products.length > 0 || business.services.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {business.products.slice(0, 3).map((product) => (
              <Badge key={product} variant="secondary" className="text-xs">
                {product}
              </Badge>
            ))}
            {business.products.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{business.products.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* CTA Button */}
        <Button asChild className="w-full group/btn">
          <Link to={`/marketplace/business/${business.businessId}`}>
            View Profile
            <ExternalLink className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>

      {/* Rank Indicator (for top 3) */}
      {index < 3 && (
        <div className="absolute top-3 left-3 bg-gradient-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
          {index + 1}
        </div>
      )}
    </Card>
  );
};

export default BusinessCard;
