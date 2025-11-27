import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  TrendingUp,
  Shield,
  Star,
  Building2,
  Smartphone,
  ShoppingBag,
  Car,
  Home,
  Briefcase,
} from "lucide-react";

const Marketplace = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [userLocation, setUserLocation] = useState<string>("Lagos, Nigeria");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In production, reverse geocode to get city name
          setUserLocation(`Near you (${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)})`);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.log("Geolocation denied, using default");
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/marketplace/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategorySearch = (category: string) => {
    navigate(`/marketplace/search?q=${encodeURIComponent(category)}`);
  };

  const popularSearches = [
    "iPhone",
    "Laptop",
    "Wedding Photographer",
    "Caterer",
    "Fashion Designer",
    "Car Dealer",
    "Furniture",
    "Electronics",
  ];

  const categories = [
    { name: "Electronics", icon: Smartphone, query: "Electronics" },
    { name: "Fashion", icon: ShoppingBag, query: "Fashion" },
    { name: "Vehicles", icon: Car, query: "Vehicles" },
    { name: "Real Estate", icon: Home, query: "Real Estate" },
    { name: "Services", icon: Briefcase, query: "Services" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Search */}
        <section className="gradient-primary py-20 text-primary-foreground relative overflow-hidden">
          <Container className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Find Trusted Businesses Near You
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                Search for products and services. Discover verified businesses with proven trust scores.
              </p>

              {/* Search Box */}
              <div className="bg-white rounded-lg shadow-glow p-2 flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="What are you looking for? (e.g., iPhone, Laptop, Photographer)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="border-0 shadow-none focus-visible:ring-0 text-lg"
                  />
                </div>
                <div className="flex items-center gap-2 px-3 py-2 border-t md:border-t-0 md:border-l border-gray-200">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {isLoadingLocation ? "Detecting..." : userLocation}
                  </span>
                </div>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="md:w-auto w-full"
                  disabled={!searchQuery.trim()}
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="mt-6">
                <p className="text-sm opacity-75 mb-3">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((term) => (
                    <Badge
                      key={term}
                      variant="secondary"
                      className="cursor-pointer hover:bg-white/30 transition-colors"
                      onClick={() => {
                        setSearchQuery(term);
                        handleCategorySearch(term);
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Verified Businesses</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-8 w-8 text-warning" />
                </div>
                <p className="text-3xl font-bold">4.8/5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Searches This Month</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Building2 className="h-8 w-8 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">KYC Verified</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <Container>
            <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-elegant transition-shadow"
                    onClick={() => handleCategorySearch(category.query)}
                  >
                    <CardContent className="pt-6 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4">
                          <category.icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <p className="font-semibold">{category.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <Container>
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2">Search</h3>
                <p className="text-muted-foreground">
                  Enter what you're looking for and your location
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-success text-success-foreground w-12 h-12 flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2">Discover</h3>
                <p className="text-muted-foreground">
                  Browse verified businesses ranked by trust score and proximity
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-warning text-warning-foreground w-12 h-12 flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                </div>
                <h3 className="font-bold text-xl mb-2">Visit</h3>
                <p className="text-muted-foreground">
                  Click to visit their website or get directions to their store
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <Container>
            <Card className="bg-gradient-primary text-primary-foreground border-0">
              <CardContent className="py-12 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Own a Business? Get Listed Today
                </h2>
                <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                  Join 500+ verified businesses on ConfirmIT Marketplace. Get discovered by customers searching for your products and services.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/business/register")}
                >
                  Register Your Business
                </Button>
              </CardContent>
            </Card>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
