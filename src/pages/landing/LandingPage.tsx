import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "@/lib/utils";
import LandingHeader from "@/pages/landing/components/LandingHeader";
import LandingHero from "@/pages/landing/components/LandingHero";
import StatsSection from "@/pages/landing/components/StatsSection";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getCookie("access_token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      <LandingHeader />
      <main className="relative z-10 container mx-auto px-6 py-16">
      <LandingHero />
      </main>
      <StatsSection />
    </div>
  );
};


export default LandingPage;
