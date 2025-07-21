import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import LandingHeader from "@/pages/landing/components/LandingHeader";
import LandingHero from "@/pages/landing/components/LandingHero";
import StatsSection from "@/pages/landing/components/StatsSection";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  return (
    <div className="min-h-screen overflow-hidden">
      <LandingHeader />
      <main className="relative z-10 container mx-auto px-6 py-16">
      <LandingHero />
      </main>
      <StatsSection />
    </div>
  );
};


export default LandingPage;
