import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useNavigationLock = (
  preventBack: boolean,
  preventExit: boolean,
  message: string = '현재 페이지를 벗어나면 진행 중인 작업이 유실될 수 있습니다. 정말로 이동하시겠습니까?'
) => {
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (preventBack) {
        // If preventBack is true and a popstate event occurs (user pressed back/forward)
        // We want to ensure they stay on the current page if it was a 'back' action.
        // The simplest way to "cancel" a back navigation is to push the current state back.
        window.history.pushState(null, '', location.pathname);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (preventExit) {
        event.returnValue = message; // Standard for browser compatibility
        return message; // For some older browsers
      }
    };

    // Add event listeners only if prevention is active
    if (preventBack) {
      // Push a new state on mount. This makes the current page the "last" page in history
      // from the browser's perspective, so going "back" will just bring them to this same state.
      window.history.pushState(null, '', location.pathname);
      window.addEventListener('popstate', handlePopState);
    }

    if (preventExit) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    // Cleanup function
    return () => {
      if (preventBack) {
        window.removeEventListener('popstate', handlePopState);
      }
      if (preventExit) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    };
  }, [preventBack, preventExit, location.pathname, message]);
};

export default useNavigationLock;
