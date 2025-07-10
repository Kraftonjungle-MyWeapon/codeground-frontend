import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UsePreventNavigationOptions {
  shouldPrevent: boolean;
  onAttemptNavigation: (confirm: () => void, cancel: () => void) => void;
  onNavigationConfirmed?: () => void; // New optional callback
}

const usePreventNavigation = ({ shouldPrevent, onAttemptNavigation }: UsePreventNavigationOptions) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);

  const confirmNavigation = useCallback(() => {
    setIsNavigationBlocked(false);
    if (nextLocation) {
      navigate(nextLocation);
      setNextLocation(null);
    }
  }, [nextLocation, navigate]);

  const cancelNavigation = useCallback(() => {
    setIsNavigationBlocked(false);
    setNextLocation(null);
  }, []);

  useEffect(() => {
    if (!shouldPrevent) return;

    const handlePopState = (event: PopStateEvent) => {
      console.log('Popstate event triggered. shouldPrevent:', shouldPrevent);
      // If the user tries to go back/forward, we block it and show the modal.
      // We need to push the current state back to history to prevent the URL from changing.
      window.history.pushState(null, '', location.pathname);
      setIsNavigationBlocked(true);
      console.log('Navigation blocked by popstate.');
      setNextLocation(null); // No specific next location for popstate
      onAttemptNavigation(confirmNavigation, cancelNavigation);
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldPrevent) {
        event.preventDefault();
        event.returnValue = ''; // Required for Chrome
        return ''; // Required for Firefox
      }
    };

    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href && anchor.target !== '_blank') {
        const url = new URL(anchor.href);
        if (url.origin === window.location.origin && url.pathname !== location.pathname) {
          event.preventDefault();
          setIsNavigationBlocked(true);
          console.log('Navigation blocked by link click.');
          setNextLocation(url.pathname);
          onAttemptNavigation(confirmNavigation, cancelNavigation);
        }
      }
    };

    const handleFormSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form && form.action && form.method) {
        const url = new URL(form.action, window.location.href);
        if (url.origin === window.location.origin && url.pathname !== location.pathname) {
          event.preventDefault();
          setIsNavigationBlocked(true);
          console.log('Navigation blocked by form submit.');
          setNextLocation(url.pathname);
          onAttemptNavigation(confirmNavigation, cancelNavigation);
        }
      }
    };

    // Initial pushState to ensure we have a state to manipulate
    window.history.pushState(null, '', location.pathname);

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleLinkClick, true); // Use capture phase
    document.addEventListener('submit', handleFormSubmit, true); // Use capture phase

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleLinkClick, true);
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, [shouldPrevent, location.pathname, onAttemptNavigation, confirmNavigation, cancelNavigation]);

  return { isNavigationBlocked, confirmNavigation, cancelNavigation };
};

export default usePreventNavigation;