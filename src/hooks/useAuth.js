import { useEffect, useState } from "react";

export const isUserLoggedIn = () => !!localStorage.getItem("user");

export const getCurrentUserId = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  return storedUser?.user?.id;
};

/**
 * Reactive login-state hook — stays in sync across tabs/windows via the
 * `storage` event (fired when localStorage changes in another tab).
 */
export const useIsLoggedIn = () => {
  const [loggedIn, setLoggedIn] = useState(() => isUserLoggedIn());

  useEffect(() => {
    const sync = () => setLoggedIn(isUserLoggedIn());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return loggedIn;
};
