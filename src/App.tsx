import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CyberLoadingSpinner from "@/components/CyberLoadingSpinner";
import NavigationHandler from './components/NavigationHandler';
const HomePage = lazy(() => import("./pages/home/HomePage"));
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const SignupPage = lazy(() => import("./pages/signup/SignupPage"));
const ProfileSetupPage = lazy(() => import("./pages/setup-profile/ProfileSetupPage"));
const MatchingPage = lazy(() => import("./pages/matching/MatchingPage"));
const WaitingRoomPage = lazy(() => import("./pages/waiting-room/WaitingRoomPage"));
const ScreenShareSetupPage = lazy(() => import("./pages/ScreenShareSetupPage"));
const BattlePage = lazy(() => import("./pages/BattlePage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const TierPromotionPage = lazy(() => import("./pages/TierPromotionPage"));
const TierDemotionPage = lazy(() => import("./pages/TierDemotionPage"));
const RankingPage = lazy(() => import("./pages/ranking/RankingPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const NotFound = lazy(() => import("./pages/not-found/NotFound"));

import { useEffect } from "react";
import { useUser } from "./context/UserContext";
import { authFetch } from "./utils/api";
import { getCookie, eraseCookie } from "@/lib/utils";

const queryClient = new QueryClient();

const apiUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const { setUser, setIsLoading, isLoading } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const token = getCookie("access_token");
      if (token) {
        try {
          const userResponse = await authFetch(
            `${apiUrl}/api/v1/user/me`,
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
          {isLoading ? (
            <CyberLoadingSpinner />
          ) : (
            <Suspense fallback={<CyberLoadingSpinner />}>
              <NavigationHandler>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/setup-profile" element={<ProfileSetupPage />} />
                    <Route path="/matching" element={<MatchingPage />} />
                    <Route path="/waiting-room" element={<WaitingRoomPage />} />
                    <Route path="/screen-share-setup" element={<ScreenShareSetupPage />} />
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
              </NavigationHandler>
            </Suspense>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
