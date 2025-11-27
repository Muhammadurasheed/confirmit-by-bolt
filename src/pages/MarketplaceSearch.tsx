import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import BusinessCard from "@/components/features/marketplace/BusinessCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, SlidersHorizontal, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { searchMarketplace } from "@/services/marketplace";
import type { MarketplaceSearchResult } from "@/types/marketplace";

const MarketplaceSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [businesses, setBusinesses] = useState<MarketplaceSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
    detectUserLocation();
  }, [searchParams]);

  const detectUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation denied, using default location");
        }
      );
    }
  };

  const performSearch = async (query: string) => {
    setLoading(true);

    try {
      const response = await searchMarketplace({
        query,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        radius: 10, // 10km radius
        page: 1,
        limit: 20, // Show more results
      });

      setBusinesses(response.results);
      setTotalResults(response.total);
    } catch (error) {
      toast.error("Search failed", {
        description: error instanceof Error ? error.message : "Unable to fetch results. Please try again.",
      });
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/marketplace/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 py-8 bg-gradient-subtle">
        <Container>
          {/* Search Header */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-elegant p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search for products or services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Results Header */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {loading ? "Searching..." : `Results for "${searchParams.get("q")}"`}
                </h1>
                {!loading && (
                  <p className="text-muted-foreground">
                    {totalResults} verified {totalResults === 1 ? "business" : "businesses"} found
                  </p>
                )}
              </div>

              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <div className="h-48 bg-muted animate-pulse" />
                  <CardContent className="pt-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No businesses found</h3>
                <p className="text-muted-foreground mb-6">
                  Try a different search term or browse by category
                </p>
                <Button onClick={() => navigate("/marketplace")}>
                  Back to Marketplace
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {businesses.map((business, index) => (
                <motion.div
                  key={business.businessId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BusinessCard business={business} index={index} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Location Note */}
          {userLocation && !loading && businesses.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                Results sorted by distance from your location
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default MarketplaceSearch;
