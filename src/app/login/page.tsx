"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminEmail } from "@/lib/constants";

export default function LoginPage() {
  const { signIn, user, loading, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => setLoadingTimedOut(true), 2500);
      return () => clearTimeout(t);
    }
    setLoadingTimedOut(false);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      if (typeof window !== "undefined") {
        window.location.href = isAdminEmail(email) ? "/admin" : "/";
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Sign in failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !loadingTimedOut) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (user) {
    return (
      <Container maxWidth="xs" sx={{ px: 2 }}>
        <Box sx={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", py: 3 }}>
          <Paper elevation={2} sx={{ p: 3, width: "100%", maxWidth: 400 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Already signed in
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Button component={Link} href={isAdminEmail(user.email) ? "/admin" : "/"} variant="contained" fullWidth sx={{ minHeight: 44 }}>
                Go to {isAdminEmail(user.email) ? "Dashboard" : "Home"}
              </Button>
              <Button
                onClick={async () => {
                  await signOut();
                  if (typeof window !== "undefined") window.location.href = "/login";
                }}
                variant="outlined"
                fullWidth
                sx={{ minHeight: 44 }}
              >
                Sign out
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              <Link href="/" style={{ color: "inherit" }}>Back to home</Link>
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ px: 2 }}>
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 3,
        }}
      >
        <Paper elevation={2} sx={{ p: 3, width: "100%", maxWidth: 400 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
            Sign in
          </Typography>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              autoComplete="email"
              required
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              autoComplete="current-password"
              required
              slotProps={{ input: { style: { minHeight: 44 } } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{ mt: 3, mb: 2, minHeight: 48 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
            </Button>
          </form>
          <Typography variant="body2" color="text.secondary" align="center">
            <Link href="/" style={{ color: "inherit" }}>
              Back to home
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
