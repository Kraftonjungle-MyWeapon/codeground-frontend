import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CyberLoadingSpinner from "@/components/CyberLoadingSpinner";
import NavigationHandler from "./components/NavigationHandler";
import { useUser } from "./context/UserContext";

const HomePage = lazy(() => import("./pages/home/HomePage"));
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const SignupPage = lazy(() => import("./pages/signup/SignupPage"));
const ProfileSetupPage = lazy(
  () => import("./pages/setup-profile/ProfileSetupPage")
);
const MatchingPage = lazy(() => import("./pages/matching/MatchingPage"));
const WaitingRoomPage = lazy(
  () => import("./pages/waiting-room/WaitingRoomPage")
);
const ScreenShareSetupPage = lazy(() => import("./pages/ScreenShareSetupPage"));
const BattlePage = lazy(() => import("./pages/BattlePage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
const TierPromotionPage = lazy(() => import("./pages/TierPromotionPage"));
const TierDemotionPage = lazy(() => import("./pages/TierDemotionPage"));
const RankingPage = lazy(() => import("./pages/ranking/RankingPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));
const CreateProblemPage = lazy(() => import("./pages/CreateProblemPage"));
const UploadProblemPage = lazy(() => import("./pages/UploadProblemPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const ProblemDetailEdit = lazy(() => import("./pages/admin/components/ProblemDetailEdit"));
const AchievementPage = lazy(() => import("./pages/AchievementPage"));
const NotFound = lazy(() => import("./pages/not-found/NotFound"));
const OAuthCallback = lazy(
  () => import("./pages/login/components/OAuthCallback")
);

const queryClient = new QueryClient();

const App = () => {
  const { isLoading } = useUser();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen"> {/* Apply min-h-screen here */}
            {isLoading ? (
              <CyberLoadingSpinner />
            ) : (
              <Suspense fallback={<CyberLoadingSpinner />}>
                <NavigationHandler>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/oauth/callback" element={<OAuthCallback />} />
                    {[
                      { path: "/home", element: <HomePage /> },
                      { path: "/setup-profile", element: <ProfileSetupPage /> },
                      { path: "/matching", element: <MatchingPage /> },
                      { path: "/waiting-room/:roomId", element: <WaitingRoomPage /> },
                      {
                        path: "/screen-share-setup",
                        element: <ScreenShareSetupPage />,
                      },
                      { path: "/battle", element: <BattlePage /> },
                      { path: "/result", element: <ResultPage /> },
                      { path: "/tier-promotion", element: <TierPromotionPage /> },
                      { path: "/tier-demotion", element: <TierDemotionPage /> },
                      { path: "/ranking", element: <RankingPage /> },
                      { path: "/profile", element: <ProfilePage /> },
                      { path: "/settings", element: <SettingsPage /> },
                      { path: "/create-problem", element:<CreateProblemPage />},
                      { path: "/upload-problem", element:<UploadProblemPage />},
                      { path: "/admin/problems/:problemId", element: <ProblemDetailEdit />, adminOnly: true },
                      { path: "/admin", element: <AdminPage />, adminOnly: true },
                      { path: "/achievement", element:<AchievementPage /> } 
                    ].map(({ path, element, adminOnly }) => (
                      <Route
                        key={path}
                        path={path}
                        element={<ProtectedRoute adminOnly={adminOnly}>{element}</ProtectedRoute>}
                      />
                    ))}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </NavigationHandler>
              </Suspense>
            )}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;