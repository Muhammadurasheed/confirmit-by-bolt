import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield } from "lucide-react";
import { BUSINESS_TIERS } from "@/lib/constants";

interface TierSelectorProps {
  onSelectTier: (tier: 1 | 2 | 3) => void;
}

const tierIcons = {
  1: Shield,
  2: Zap,
  3: Star,
};

const tierColors = {
  1: "text-blue-500",
  2: "text-purple-500",
  3: "text-amber-500",
};

const tierBadges = {
  1: "Free",
  2: "Popular",
  3: "Recommended",
};

const TierSelector = ({ onSelectTier }: TierSelectorProps) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold">Get Verified & Listed on Marketplace</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join 500+ verified businesses on ConfirmIT. Get discovered by customers searching for your products.
        </p>

        <div className="flex flex-wrap justify-center gap-6 pt-4">
          {[
            "Full KYC verification + Trust ID NFT",
            "Listed in marketplace search results",
            "Enhanced profile with photos & analytics",
            "Valid for 12 months",
          ].map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-sm"
            >
              <Check className="h-5 w-5 text-success" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Simplified Single Tier Card */}
      <div className="max-w-xl mx-auto">
        {Object.entries(BUSINESS_TIERS).filter(([tier]) => tier === '1').map(([tier, info], index) => {
          const TierIcon = tierIcons[parseInt(tier) as 1 | 2 | 3];
          const tierNum = parseInt(tier) as 1 | 2 | 3;
          const isPopular = true;

          return (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                <Badge className="bg-gradient-primary text-white px-4 py-1 shadow-elegant">
                  Recommended - Simple Pricing
                </Badge>
              </div>
              
              <Card
                className={`relative overflow-hidden transition-all hover:shadow-elegant ${
                  isPopular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                <CardHeader className="text-center space-y-4 pb-4">
                  <div className="flex justify-center">
                    <div className={`rounded-full bg-primary/10 p-4 ${tierColors[tierNum]}`}>
                      <TierIcon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {info.name}
                    </CardTitle>
                    <div className="text-4xl font-bold">
                      <span>₦{info.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground block mt-1">/year (just ₦1,000/month)</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {info.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => onSelectTier(tierNum)}
                    variant="default"
                    className="w-full"
                    size="lg"
                  >
                    Get Verified & Start Listing
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            <strong>What happens after payment?</strong><br />
            Our admin team reviews your documents within 24-48 hours. Once approved, you'll receive your Trust ID NFT and your business will be listed in our marketplace where customers can find you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierSelector;
