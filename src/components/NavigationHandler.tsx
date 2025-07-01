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

  const preventBack = noBackAllowedPaths.includes(location.pathname);
  const preventExit = noExitAllowedPaths.includes(location.pathname);

  useNavigationLock(preventBack, preventExit);

  return <>{children}</>;
};

export default NavigationHandler;
