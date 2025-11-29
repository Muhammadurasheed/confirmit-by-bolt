import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Search, Store, CheckCircle2, Lock, TrendingUp, MapPin, Award, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import MarketplaceSearchBar from "@/components/features/marketplace/MarketplaceSearchBar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Marketplace = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string, location?: { lat: number; lng: number }) => {
    setLoading(true);
    const params = new URLSearchParams({ q: query });
    if (location) {
      params.append('lat', location.lat.toString());
      params.append('lng', location.lng.toString());
    }
    navigate(`/marketplace/search?${params.toString()}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section - Apple-inspired */}
        <section className="relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl"
              animate={{
                x: [0, -30, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <Container className="relative py-20 md:py-32">
            <motion.div
              className="max-w-5xl mx-auto"
              {...fadeInUp}
            >
              {/* Badge */}
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Nigeria's First Blockchain-Verified Business Directory</span>
                </div>
              </motion.div>
              
              {/* Main headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-8 leading-tight">
                Discover{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  Trusted
                </span>
                {" "}Businesses
              </h1>
              
              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-center text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Every business is KYC-verified and secured with blockchain technology. 
                Search, verify, and transact with confidence.
              </p>

              {/* Search Bar - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <MarketplaceSearchBar onSearch={handleSearch} loading={loading} />
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-8 mt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">KYC Verified</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium">Trust Scored</span>
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* How It Works - Google Material Design inspired */}
        <section className="py-24 md:py-32 bg-muted/30">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Three Steps to Trust
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Finding verified businesses has never been this simple
              </p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Search,
                  title: "Search",
                  description: "Type what you need - iPhone, laptop, plumber, restaurant. We'll show you verified businesses near you.",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Shield,
                  title: "Verify",
                  description: "Check Trust Scores, blockchain verification, customer reviews, and complete business credentials.",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: Store,
                  title: "Visit",
                  description: "Click 'Visit Website' to go directly to their store. Buy with confidence knowing they're verified.",
                  color: "from-orange-500 to-red-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="relative group"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-card rounded-2xl p-8 h-full border shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl font-bold text-muted-foreground/20">{index + 1}</span>
                      <h3 className="text-2xl font-bold">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Container>
        </section>

        {/* Trust Features - Card Grid */}
        <section className="py-24 md:py-32">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Built on Trust
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every layer of verification you need to transact with confidence
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Shield,
                  title: "Full KYC Verification",
                  description: "CAC certificate, bank account verification, owner ID, and physical address. Every detail checked.",
                  gradient: "from-emerald-500/10 to-teal-500/10"
                },
                {
                  icon: Lock,
                  title: "Blockchain Security",
                  description: "Trust IDs minted as NFTs on Hedera. Immutable, permanent, unforgeable verification records.",
                  gradient: "from-blue-500/10 to-indigo-500/10"
                },
                {
                  icon: TrendingUp,
                  title: "Real Customer Reviews",
                  description: "Authentic feedback from verified customers. See ratings, read experiences, make informed decisions.",
                  gradient: "from-violet-500/10 to-purple-500/10"
                },
                {
                  icon: MapPin,
                  title: "Location-Based Discovery",
                  description: "Find businesses near you, sorted by distance and trust score. Local, verified, trustworthy.",
                  gradient: "from-orange-500/10 to-red-500/10"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className={`p-8 rounded-2xl border bg-gradient-to-br ${feature.gradient} hover:border-primary/50 transition-all duration-300 h-full`}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm border shadow-sm">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section - Vibrant */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <Container className="relative">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
                Start Your Search Now
              </h2>
              <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12">
                Join thousands discovering trusted businesses every day
              </p>
              
              <div className="bg-background/10 backdrop-blur-xl border border-primary-foreground/20 rounded-3xl p-6 mb-8">
                <MarketplaceSearchBar 
                  onSearch={handleSearch} 
                  loading={loading}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/business/register')}
                  className="text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all"
                >
                  Register Your Business
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
