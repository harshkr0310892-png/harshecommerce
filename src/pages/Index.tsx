import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { SpecialOfferPopup } from "@/components/SpecialOfferPopup";
import { Crown, Sparkles, Truck, Shield, Gift, TrendingUp, Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function Index() {

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: sections } = useQuery({
    queryKey: ['home-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_sections')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const heroSection = sections?.find(s => s.section_type === 'hero');
  const featuredProductsSection = sections?.find(s => s.section_type === 'featured_products');
  const ctaSection = sections?.find(s => s.section_type === 'cta');

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // Filter products by category
  const specialOffers = useMemo(() => {
    return products?.filter(p => (p.discount_percentage || 0) > 0)
      .sort((a, b) => (b.discount_percentage || 0) - (a.discount_percentage || 0))
      .slice(0, 8) || [];
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products?.slice(0, 8) || [];
  }, [products]);


  return (
    <Layout>
      <SpecialOfferPopup />
      
      {/* Category Strip Above Banner */}
      {categories && categories.length > 0 && (
        <section className="container mx-auto px-4 pt-6 pb-4">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-4 md:gap-6 py-3 justify-start md:justify-center">
              {categories.slice(0, 12).map((cat: any) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.id)}`}
                  className="flex flex-col items-center text-center min-w-[80px] md:min-w-[88px] group"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-card overflow-hidden shadow-sm border border-border/40 flex items-center justify-center group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    {cat.image_url ? (
                      <img 
                        src={cat.image_url} 
                        alt={cat.name} 
                        className="w-full h-full object-cover" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-lg md:text-xl font-semibold text-muted-foreground">
                        {cat.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs md:text-sm mt-2 text-muted-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Width Banner */}
      <section className="container mx-auto px-4 pb-8">
        <div className="animate-fade-in">
          <BannerCarousel />
        </div>
      </section>

      {/* Trust Strip */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, title: 'Fast Delivery', desc: 'Quick shipping' },
            { icon: Shield, title: 'Secure Checkout', desc: 'Protected payments' },
            { icon: Gift, title: 'Best Offers', desc: 'Daily deals' },
            { icon: Sparkles, title: 'Premium Quality', desc: 'Curated products' },
          ].map((it, idx) => {
            const Icon = it.icon;
            return (
              <div
                key={it.title}
                className={cn(
                  'bg-card rounded-xl border border-border/50 p-4 flex items-center gap-3 animate-fade-in',
                  `stagger-${idx + 1}`
                )}
              >
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{it.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{it.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Special Offers Section */}
      {specialOffers.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                  <Flame className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold">
                    <span className="gradient-gold-text">Special Offers</span>
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Limited time deals you don't want to miss
                  </p>
                </div>
              </div>
              <Link to="/products">
                <Button variant="royalOutline" size="lg">
                  View All Offers
                  <TrendingUp className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {specialOffers.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    discount_percentage={product.discount_percentage || 0}
                    image_url={product.image_url}
                    cash_on_delivery={(product as any).cash_on_delivery}
                    images={product.images}
                    stock_status={product.stock_status}
                    stock_quantity={product.stock_quantity}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  <span className="gradient-gold-text">{featuredProductsSection?.title || 'Featured'}</span> Products
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {featuredProductsSection?.subtitle || 'Handpicked treasures from our collection'}
                </p>
              </div>
            </div>
            <Link to="/products">
              <Button variant="royalOutline" size="lg">
                View All Products
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  discount_percentage={product.discount_percentage || 0}
                  image_url={product.image_url}
                  cash_on_delivery={(product as any).cash_on_delivery}
                  images={product.images}
                  stock_status={product.stock_status}
                  stock_quantity={product.stock_quantity}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border/50">
              <Crown className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-muted-foreground mb-2">
                No products yet
              </h3>
              <p className="text-muted-foreground text-sm">
                Check back soon for our royal collection!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {ctaSection && (
        <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Premium Collection</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="gradient-gold-text">{ctaSection.title || 'Discover Royal Elegance'}</span>
              </h2>
              {ctaSection.subtitle && (
                <p className="text-muted-foreground mb-8 text-lg">
                  {ctaSection.subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={(ctaSection.content as any)?.buttonLink || '/products'}>
                  <Button variant="royal" size="lg" className="w-full sm:w-auto">
                    <Crown className="w-4 h-4 mr-2" />
                    {(ctaSection.content as any)?.buttonText || 'Shop Now'}
                  </Button>
                </Link>
                <Link to="/track-order">
                  <Button variant="royalOutline" size="lg" className="w-full sm:w-auto">
                    Track Order
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}