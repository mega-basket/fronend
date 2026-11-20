import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Search } from "lucide-react";
import Button from "../../components/ui/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-extrabold tracking-tight text-neutral-200 md:text-9xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">Page not found</h1>
        <p className="mt-3 leading-7 text-neutral-500">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate("/")}>
            <Home size={18} />
            Go to home
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Go back
          </Button>
        </div>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          <Search size={15} />
          Browse all products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
