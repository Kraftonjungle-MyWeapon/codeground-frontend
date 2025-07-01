import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CyberLoadingSpinner from "@/components/CyberLoadingSpinner";
// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ProfileSetupPage = lazy(() => import("./pages/ProfileSetupPage"));
const MatchingPage = lazy(() => import("./pages/MatchingPage"));
const WaitingRoomPage = lazy(() => import("./pages/WaitingRoomPage"));
const ScreenShareSetupPage = lazy(() => import("./pages/ScreenShareSetupPage"));
const BattlePage = lazy(() => import("./pages/BattlePage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const TierPromotionPage = lazy(() => import("./pages/TierPromotionPage"));
const TierDemotionPage = lazy(() => import("./pages/TierDemotionPage"));
const RankingPage = lazy(() => import("./pages/RankingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

import { useEffect } from "react";
import { useUser } from "./context/UserContext";
import { authFetch } from "./utils/api";
import { getCookie, eraseCookie } from "@/lib/utils";

const queryClient = new QueryClient();

const App = () => {
  const { setUser, setIsLoading } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const token = getCookie("access_token");
      if (token) {
        try {
          const userResponse = await authFetch(
            "http://localhost:8000/api/v1/user/me",
          );
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            eraseCookie("access_token"); // Clear invalid token
          }
        } catch (error) {
          eraseCookie("access_token"); // Clear token on network error
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [setUser, setIsLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<CyberLoadingSpinner />}>
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
                <Route
                  path="/screen-share-setup"
                  element={<ScreenShareSetupPage />}
                />
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
