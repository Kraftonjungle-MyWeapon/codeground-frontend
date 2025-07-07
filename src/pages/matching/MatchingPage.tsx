import React from "react";
import Header from "@/components/Header";
import { useMatching } from "@/hooks/useMatching";
import MatchingWaitingCard from "./components/MatchingWaitingCard";
import MatchFoundModal from "./components/MatchFoundModal";

const MatchingPage = () => {
  const {
    foundOpponent,
    matchingTime,
    acceptTimeLeft,
    userAccepted,
    opponentAccepted,
    opponent,
    handleAccept,
    handleDecline,
    handleCancel,
    formatTime,
  } = useMatching();

  return (
    <div className="min-h-screen cyber-grid">
      <Header />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-2xl">
          {!foundOpponent ? (
            <MatchingWaitingCard
              matchingTime={matchingTime}
              formatTime={formatTime}
              handleCancel={handleCancel}
            />
          ) : (
            <MatchFoundModal
              acceptTimeLeft={acceptTimeLeft}
              userAccepted={userAccepted}
              opponentAccepted={opponentAccepted}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
              opponent={opponent}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default MatchingPage;