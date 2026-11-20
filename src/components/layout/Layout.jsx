import { Suspense } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import FloatingActions from "../common/FloatingActions";
import ErrorBoundary from "../common/ErrorBoundary";
import { PageLoader } from "../ui/Spinner";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Page-level boundary + suspense keep the header/footer on screen
            while a page loads or if it crashes. Changing route clears errors. */}
        <ErrorBoundary resetKey={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Layout;
