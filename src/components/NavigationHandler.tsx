import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useNavigationLock from '../hooks/useNavigationLock';

interface NavigationHandlerProps {
  children: React.ReactNode;
}

const NavigationHandler: React.FC<NavigationHandlerProps> = ({ children }) => {
  const location = useLocation();

  const noBackAllowedPaths = [
    '/home',
    '/setup-profile',
    '/matching',
    '/waiting-room',
    '/screen-share-setup',
    '/battle',
    '/result',
    '/tier-promotion',
    '/tier-demotion',
    '/ranking',
    '/profile',
    '/settings',
    '/not-found',
  ];

  const noExitAllowedPaths = [
    '/matching',
    '/waiting-room',
    '/screen-share-setup',
    '/battle',
    '/result',
  ];

  const allowedPathsForProblemData = [
    '/battle',
    '/matching',
    '/screen-share-setup',
    '/waiting-room',
  ];

  useEffect(() => {
    if (!allowedPathsForProblemData.some(path => location.pathname.startsWith(path))) {
      console.log("Clearing session storage for problem data.");
      sessionStorage.removeItem("currentMatchId");
      sessionStorage.removeItem("gameId");
      sessionStorage.removeItem("matchResult");
      sessionStorage.removeItem("websocketUrl");
      sessionStorage.removeItem("currentGameId");

      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith("problem_")) {
          sessionStorage.removeItem(key);
        }
      }
    }
  }, [location.pathname]);

  const preventBack = noBackAllowedPaths.includes(location.pathname);
  const preventExit = noExitAllowedPaths.includes(location.pathname);

  useNavigationLock(preventBack, preventExit);

  return <>{children}</>;
};

export default NavigationHandler;