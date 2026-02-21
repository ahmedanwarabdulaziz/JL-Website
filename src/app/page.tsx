import Link from "next/link";
import { Button, Container, Typography, Box, Stack } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HERO_IMAGE = "/images/Home%20Hero.png";
const BRAND_ORANGE = "#fe812b";

export default function HomePage() {
  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />

      {/* Hero */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: { xs: "65vh", md: "75vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.4)",
          },
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, px: 3, textAlign: "center" }}>
          <Stack spacing={2.5} alignItems="center">
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 600,
                color: "#fff",
                fontSize: { xs: "2.25rem", sm: "3rem", md: "3.5rem" },
                lineHeight: 1.15,
                letterSpacing: "0.02em",
                textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              }}
            >
              Bringing Furniture Value
            </Typography>
            <Box sx={{ width: 64, height: 2, bgcolor: BRAND_ORANGE }} />
            <Typography
              sx={{
                color: "rgba(255,255,255,0.95)",
                fontSize: { xs: "1rem", sm: "1.2rem", md: "1.3rem" },
                maxWidth: 480,
                lineHeight: 1.6,
                letterSpacing: "0.02em",
                textShadow: "0 1px 10px rgba(0,0,0,0.3)",
              }}
            >
              We believe everyone has the right to a well-furnished life
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
              <Button
                component={Link}
                href="/contact"
                variant="contained"
                size="large"
                sx={{
                  minHeight: 52,
                  minWidth: 160,
                  bgcolor: BRAND_ORANGE,
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#e67324", boxShadow: "none" },
                }}
              >
                Get in touch
              </Button>
              <Button
                component={Link}
                href="/gallery"
                variant="outlined"
                size="large"
                sx={{
                  minHeight: 52,
                  minWidth: 160,
                  borderColor: "rgba(255,255,255,0.8)",
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  "&:hover": { borderColor: BRAND_ORANGE, bgcolor: "rgba(254,129,43,0.12)", color: "#fff" },
                }}
              >
                View gallery
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Intro strip */}
      <Box sx={{ py: { xs: 5, md: 6 }, bgcolor: "#fff" }}>
        <Container maxWidth="md" sx={{ px: 3, textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 600,
              color: "#1a1a1a",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "0.02em",
              lineHeight: 1.3,
            }}
          >
            Crafted for comfort. Built to last.
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 2, maxWidth: 560, mx: "auto", lineHeight: 1.7, letterSpacing: "0.02em" }}>
            From reupholstery to custom pieces, we bring quality and style to every project. Experience the difference of furniture made with care.
          </Typography>
        </Container>
      </Box>

      {/* Value pillars */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#fafafa" }}>
        <Container maxWidth="lg" sx={{ px: 3 }}>
          <Typography
            variant="overline"
            sx={{ color: BRAND_ORANGE, letterSpacing: "0.25em", fontWeight: 600, display: "block", textAlign: "center", mb: 1 }}
          >
            Why choose us
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 600,
              color: "#1a1a1a",
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "1.75rem", md: "2rem" },
            }}
          >
            The JL difference
          </Typography>
          <Stack direction={{ xs: "column", md: "row" }} spacing={4} useFlexGap sx={{ gap: 4 }}>
            {[
              { title: "Quality materials", text: "We source durable fabrics and materials so your furniture stands the test of time." },
              { title: "Expert craft", text: "Skilled artisans bring decades of experience to every stitch and finish." },
              { title: "Personal service", text: "From consultation to delivery, we work with you to get the result you envision." },
            ].map((item) => (
              <Box
                key={item.title}
                sx={{
                  flex: 1,
                  p: 3,
                  bgcolor: "#fff",
                  borderRadius: 0,
                  borderTop: "3px solid",
                  borderColor: BRAND_ORANGE,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <Typography variant="h6" sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 600, color: "#1a1a1a", mb: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7, letterSpacing: "0.02em" }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#1a1a1a", color: "#fff" }}>
        <Container maxWidth="md" sx={{ px: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 600,
              color: "#fff",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              letterSpacing: "0.02em",
            }}
          >
            Ready to transform your space?
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 1.5, mb: 3 }}>
            Get a quotation or speak with our team today.
          </Typography>
          <Button
            component={Link}
            href="/contact"
            variant="contained"
            size="large"
            sx={{
              minHeight: 52,
              minWidth: 180,
              bgcolor: BRAND_ORANGE,
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              "&:hover": { bgcolor: "#e67324" },
            }}
          >
            Request quotation
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
