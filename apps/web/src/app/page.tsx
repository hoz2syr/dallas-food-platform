"use client";

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Stack, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip,
  Avatar,
  Rating,
  Skeleton,
  IconButton,
  styled,
  alpha
} from '@mui/material';
import { ShoppingCart, ArrowRight, Play, Star, Clock, ShieldCheck, Leaf } from 'lucide-react';
import { addItem } from '../lib/cart/cart-store';
import { fetchMenus } from '../lib/api/menu-api';

// --- Styled Components for Aurora UI & Glassmorphism ---

const HeroSection = styled(Box)(() => ({
  position: 'relative',
  minHeight: '90vh',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  background: '#0A0A0A',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-20%',
    left: '-10%',
    width: '60%',
    height: '60%',
    background: 'radial-gradient(circle, rgba(26, 95, 122, 0.4) 0%, transparent 70%)',
    filter: 'blur(80px)',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: '50%',
    height: '50%',
    background: 'radial-gradient(circle, rgba(255, 209, 102, 0.2) 0%, transparent 70%)',
    filter: 'blur(100px)',
    zIndex: 1,
  }
}));

const GlassCard = styled(Card)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(12px)',
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  borderRadius: '24px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.4)}`,
  }
}));

const CategoryIconBox = styled(Box)(({ theme }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  background: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
}));

const FeatureItem = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '24px',
  background: alpha(theme.palette.background.paper, 0.4),
  border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
  height: '100%',
}));

// --- Mock Data ---

const CATEGORIES = [
  { icon: '🍖', name: 'Signature Grills', desc: 'Premium cuts, fire-roasted' },
  { icon: '🥗', name: 'Fresh Starters', desc: 'Organic seasonal greens' },
  { icon: '🍕', name: 'Stone Pizza', desc: 'Authentic thin-crust' },
  { icon: '🍜', name: 'Comfort Bowls', desc: 'Warm hearty creations' },
];

const REVIEWS = [
  {
    name: "Sarah Mitchell",
    location: "Dallas, TX",
    text: "Absolutely incredible food! The grilled steak was cooked to perfection, and the delivery was lightning fast.",
    rating: 5,
    avatar: "S"
  },
  {
    name: "Michael Chen",
    location: "Irving, TX",
    text: "Best food delivery service in town! Fresh ingredients, generous portions, and the service is top-notch.",
    rating: 5,
    avatar: "M"
  }
];

type Item = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus()
      .then((menus) => {
        const all = menus.flatMap((m: { items?: Item[] }) => m.items || []);
        setItems(all.map((it: Item) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          image: it.image,
          description: it.description
        })));
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (item: Item) => {
    addItem({ id: item.id, name: item.name, price: item.price });
  };

  return (
    <Box>
      {/* HERO SECTION */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                <Typography variant="overline" color="primary" sx={{ letterSpacing: 4, fontWeight: 700 }}>
                  ESTABLISHED 2026
                </Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '5rem' }, color: 'white' }}>
                  Art of <span style={{ color: '#FFD166' }}>Premium</span> Dining
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', maxWidth: '600px' }}>
                  Discover a culinary journey where tradition meets innovation. 
                  Experience the finest flavors of Dallas delivered with absolute precision.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    endIcon={<ArrowRight />}
                    sx={{ borderRadius: '100px', px: 4, py: 1.5, fontSize: '1.1rem' }}
                  >
                    View Menu
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    startIcon={<Play size={18} />}
                    sx={{ borderRadius: '100px', px: 4, color: 'white', borderColor: alpha('#fff', 0.3) }}
                  >
                    Watch Story
                  </Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.pexels.com/photos/12387900/pexels-photo-12387900.jpeg"
                  alt="Fine Dining"
                  sx={{ 
                    width: '100%', 
                    borderRadius: '40px', 
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                    transform: 'rotate(-2deg)'
                  }}
                />
                <GlassCard sx={{ position: 'absolute', bottom: -20, left: -20, p: 2, display: { xs: 'none', sm: 'block' } }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>⭐</Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="white">4.9/5 Rating</Typography>
                      <Typography variant="caption" color="text.secondary">Trusted by 10k+ foodies</Typography>
                    </Box>
                  </Stack>
                </GlassCard>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* CATEGORIES */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container>
          <Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
            <Typography variant="h3" color="white">Explore Categories</Typography>
            <Box sx={{ width: 60, height: 4, bgcolor: 'primary.main', borderRadius: 2 }} />
          </Stack>
          <Grid container spacing={3}>
            {CATEGORIES.map((cat, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <GlassCard sx={{ p: 4, textAlign: 'center' }}>
                  <Stack alignItems="center">
                    <CategoryIconBox className="icon-box">
                      {cat.icon}
                    </CategoryIconBox>
                    <Typography variant="h6" color="white" gutterBottom>{cat.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{cat.desc}</Typography>
                  </Stack>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FEATURED DISHES */}
      <Box sx={{ py: 10, background: 'linear-gradient(to bottom, #0A0A0A, #121212)' }}>
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
            <Box>
              <Typography variant="overline" color="primary">CHEF'S SPECIAL</Typography>
              <Typography variant="h3" color="white">Featured Dishes</Typography>
            </Box>
            <Button variant="text" color="primary" endIcon={<ArrowRight />}>View All</Button>
          </Stack>
          
          <Grid container spacing={4}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 6, mb: 2 }} />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Grid>
              ))
            ) : (
              items.slice(0, 3).map((item) => (
                <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <GlassCard>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="260"
                        image={item.image || 'https://pixabay.com/get/g1bdde58a80a4a79e555d7cbe7be75e09a969fd800f7bec09ee5f8a78ae7008ec26dc5f7a2ff46b9c5811e10590737c19.jpg'}
                        alt={item.name}
                      />
                      <Chip 
                        label="Premium" 
                        size="small" 
                        sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'primary.main', fontWeight: 700 }} 
                      />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" color="white" gutterBottom>{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, height: 40, overflow: 'hidden' }}>
                        {item.description || "Indulge in our masterfully crafted signature dish using the finest seasonal ingredients."}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" color="primary" fontWeight={700}>${item.price.toFixed(2)}</Typography>
                        <IconButton 
                          onClick={() => handleAddToCart(item)}
                          sx={{ bgcolor: alpha('#FFD166', 0.1), color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'background.paper' } }}
                        >
                          <ShoppingCart size={20} />
                        </IconButton>
                      </Stack>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* WHY US */}
      <Box sx={{ py: 12, bgcolor: '#0A0A0A' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 3 }}>
              <FeatureItem>
                <Box color="primary.main" mb={2}><Clock size={40} /></Box>
                <Typography variant="h6" color="white" gutterBottom>Rapid Delivery</Typography>
                <Typography variant="body2" color="text.secondary">Hot and fresh within 30 minutes, precision handled.</Typography>
              </FeatureItem>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FeatureItem>
                <Box color="primary.main" mb={2}><ShieldCheck size={40} /></Box>
                <Typography variant="h6" color="white" gutterBottom>Secure Dining</Typography>
                <Typography variant="body2" color="text.secondary">Highest safety standards from kitchen to your door.</Typography>
              </FeatureItem>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FeatureItem>
                <Box color="primary.main" mb={2}><Leaf size={40} /></Box>
                <Typography variant="h6" color="white" gutterBottom>Organic Sourced</Typography>
                <Typography variant="body2" color="text.secondary">We partner with local farms for peak ingredient quality.</Typography>
              </FeatureItem>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FeatureItem>
                <Box color="primary.main" mb={2}><Star size={40} /></Box>
                <Typography variant="h6" color="white" gutterBottom>Gold Standard</Typography>
                <Typography variant="body2" color="text.secondary">100% excellence guarantee on every single order.</Typography>
              </FeatureItem>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* TESTIMONIALS */}
      <Box sx={{ py: 10, background: 'linear-gradient(to top, #0A0A0A, #1B1B1B)' }}>
        <Container>
          <Stack spacing={1} alignItems="center" sx={{ mb: 8 }}>
            <Typography variant="h3" color="white">Guest Experiences</Typography>
            <Typography variant="body1" color="text.secondary">Shared by our community of fine diners</Typography>
          </Stack>
          <Grid container spacing={4}>
            {REVIEWS.map((rev, i) => (
              <Grid key={i} size={{ xs: 12, md: 6 }}>
                <GlassCard sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Rating value={rev.rating} readOnly sx={{ color: 'primary.main' }} />
                    <Typography variant="h6" color="white" sx={{ fontStyle: 'italic', fontWeight: 400, lineHeight: 1.6 }}>
                      "{rev.text}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>{rev.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" color="white" fontWeight={600}>{rev.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{rev.location}</Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </GlassCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CALL TO ACTION */}
      <Box sx={{ py: 15, position: 'relative', overflow: 'hidden' }}>
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'url(https://images.pexels.com/photos/31372786/pexels-photo-31372786.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
            zIndex: -1
          }} 
        />
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Stack spacing={4} alignItems="center">
            <Typography variant="h2" color="white">Experience Excellence Tonight</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600 }}>
              Indulge in the finest culinary creations. Order now and let us bring 
              the luxury of Dallas fine dining to your table.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              sx={{ borderRadius: 100, px: 8, py: 2, fontSize: '1.2rem', boxShadow: '0 10px 30px rgba(255, 209, 102, 0.4)' }}
            >
              Order Now
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ py: 8, bgcolor: '#000', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Container>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h4" color="primary" gutterBottom sx={{ fontFamily: '"Bodoni Moda", serif' }}>DALLAS</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Redefining the standard of premium food delivery. 
                Crafted with passion, delivered with excellence.
              </Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle1" color="white" gutterBottom fontWeight={700}>Platform</Typography>
              <Stack spacing={1}>
                {['Menu', 'About Us', 'Contact', 'Careers'].map(l => (
                  <Typography key={l} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{l}</Typography>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle1" color="white" gutterBottom fontWeight={700}>Support</Typography>
              <Stack spacing={1}>
                {['FAQ', 'Delivery', 'Privacy', 'Terms'].map(l => (
                  <Typography key={l} variant="body2" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{l}</Typography>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" color="white" gutterBottom fontWeight={700}>Newsletter</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Subscribe for exclusive tasting events and offers.</Typography>
              <Stack direction="row" spacing={1}>
                <Box component="input" placeholder="Email Address" sx={{ bgcolor: 'grey.800', border: 'none', borderRadius: 2, px: 2, color: 'white', flex: 1 }} />
                <Button variant="contained" size="small">Join</Button>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} Dallas Food Platform. All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}