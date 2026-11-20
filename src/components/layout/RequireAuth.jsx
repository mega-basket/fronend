import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "../../hooks/useAuth";

/**
 * Route guard for pages that need an account. Logged-out visitors are sent
 * to /login with the page they wanted in `state.from`, so login can bring
 * them straight back.
 */
const RequireAuth = () => {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
