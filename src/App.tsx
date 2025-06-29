import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ProfileSetupPage = lazy(() => import("./pages/ProfileSetupPage"));
const MatchingPage = lazy(() => import("./pages/MatchingPage"));
const WaitingRoomPage = lazy(() => import("./pages/WaitingRoomPage"));
const BattlePage = lazy(() => import("./pages/BattlePage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const TierPromotionPage = lazy(() => import("./pages/TierPromotionPage"));
const TierDemotionPage = lazy(() => import("./pages/TierDemotionPage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { useEffect } from 'react';
import { useUser } from './context/UserContext';
import { authFetch } from './utils/api';

const queryClient = new QueryClient();

const App = () => {
  const { setUser } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userResponse = await authFetch('http://localhost:8000/api/v1/user/me');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            console.error('Failed to fetch user data on app load');
            localStorage.removeItem('access_token'); // Clear invalid token
          }
        } catch (error) {
          console.error('Network error fetching user data on app load:', error);
          localStorage.removeItem('access_token'); // Clear token on network error
        }
      }
    };
    fetchUser();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Index />} />
                <Route path="/setup-profile" element={<ProfileSetupPage />} />
                <Route path="/matching" element={<MatchingPage />} />
                <Route path="/waiting-room" element={<WaitingRoomPage />} />
                <Route path="/battle" element={<BattlePage />} />
                <Route path="/result" element={<ResultPage />} />
                <Route path="/tier-promotion" element={<TierPromotionPage />} />
                <Route path="/tier-demotion" element={<TierDemotionPage />} />
                <Route path="/ranking" element={<RankingPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
